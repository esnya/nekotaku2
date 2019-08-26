import firebase from 'firebase/app';
import 'firebase/firestore';
import Driver from 'nekostore/lib/driver/Driver';
import Unsubscribe from 'nekostore/lib/store/Unsubscribe';
import QueryDescriptor from 'nekostore/lib/store/QueryDescriptor';
import CollectionReference from 'nekostore/lib/store/CollectionReference';
import DocumentReference from 'nekostore/lib/store/DocumentReference';
import DriverDocumentSnapshot from 'nekostore/lib/driver/DriverDocumentSnapshot';
import DriverDocumentChangeSnapshot from 'nekostore/lib/driver/DriverDocumentChangeSnapshot';

function parseSnapshot<T>(
  snapshot: firebase.firestore.DocumentSnapshot,
): DriverDocumentSnapshot<T> {
  const { id } = snapshot;
  const rawData = snapshot.data();

  if (!rawData) {
    return {
      id,
    };
  }

  const { metadata, data } = rawData;

  return {
    id,
    metadata,
    data,
  };
}

export default class FirebaseDriver implements Driver {
  public constructor(app: firebase.app.App) {
    this.app = app;
  }

  private readonly app: firebase.app.App;

  private collection<T>(
    ref: CollectionReference<T>,
  ): firebase.firestore.CollectionReference {
    return ref.parent
      ? this.doc(ref.parent).collection(ref.id)
      : this.app.firestore().collection(ref.id);
  }

  private doc<T>(
    ref: DocumentReference<T>,
  ): firebase.firestore.DocumentReference {
    const col = this.collection<T>(ref.parent);
    return col.doc(ref.id);
  }

  private compileQuery<T>(
    descriptors: QueryDescriptor<T>[],
    prev: firebase.firestore.Query,
  ): firebase.firestore.Query {
    if (descriptors.length === 0) return prev;

    const [descriptor, ...others] = descriptors;
    switch (descriptor.type) {
      case 'EndAt':
        return this.compileQuery<T>(
          others,
          prev.endAt(this.doc(descriptor.snapshot.ref)),
        );
      case 'EndBefore':
        return this.compileQuery<T>(
          others,
          prev.endAt(this.doc(descriptor.snapshot.ref)),
        );
      case 'Limit':
        return this.compileQuery<T>(others, prev.limit(descriptor.limit));
      case 'OrderBy':
        return this.compileQuery<T>(
          others,
          prev.orderBy(descriptor.fieldPath.join('.'), descriptor.direction),
        );
      case 'StartAfter':
        return this.compileQuery<T>(
          others,
          prev.startAfter(this.doc(descriptor.snapshot.ref)),
        );
      case 'StartAt':
        return this.compileQuery<T>(
          others,
          prev.startAt(this.doc(descriptor.snapshot.ref)),
        );
      case 'Where':
        return this.compileQuery<T>(
          others,
          prev.where(
            descriptor.fieldPath.join('.'),
            descriptor.operator,
            descriptor.value,
          ),
        );
    }
  }

  public async getQuery<T>(
    ref: CollectionReference<T>,
    descriptors: QueryDescriptor<T>[],
  ): Promise<DriverDocumentSnapshot<T>[]> {
    const query = this.compileQuery<T>(descriptors, this.collection(ref));
    const snapshot = await query.get();
    return snapshot.docs.map(doc => parseSnapshot<T>(doc));
  }

  public async onQuerySnapshot<T>(
    ref: CollectionReference<T>,
    descriptors: QueryDescriptor<T>[],
    onNext: (changes: DriverDocumentChangeSnapshot<T>[]) => void,
  ): Promise<Unsubscribe> {
    const query = this.compileQuery<T>(descriptors, this.collection(ref));
    const unsubscribe = query.onSnapshot(snapshot => {
      const changes = snapshot.docChanges().map(docChange => {
        const { doc, ...change } = docChange;
        return {
          ...parseSnapshot<T>(doc),
          change,
        };
      });
      onNext(changes);
    });
    return async () => {
      unsubscribe();
    };
  }

  public async getDocument<T>(
    ref: DocumentReference<T>,
  ): Promise<DriverDocumentSnapshot<T>> {
    const snapshot = await this.doc(ref).get();
    return parseSnapshot<T>(snapshot);
  }

  public async onDocumentSnapshot<T>(
    ref: DocumentReference<T>,
    onNext: (snapshot: DriverDocumentSnapshot<T>) => void,
  ): Promise<Unsubscribe> {
    const unsubscribe = this.doc(ref).onSnapshot(snapshot => {
      onNext(parseSnapshot<T>(snapshot));
    });

    return async () => {
      unsubscribe();
    };
  }

  public async add<T>(
    ref: CollectionReference<T>,
    data: T,
  ): Promise<DocumentReference<T>> {
    const docRef = await this.collection(ref).add(data);
    return new DocumentReference<T>(ref, docRef.id);
  }
  public async update<T>(
    ref: DocumentReference<T>,
    data: Partial<T>,
  ): Promise<void> {
    await this.doc(ref).update(data);
  }
  public async delete<T>(ref: DocumentReference<T>): Promise<void> {
    await this.doc(ref).delete();
  }
}
