import firebase from 'firebase/app';
import Driver from '../core/Driver';
import Query from '../core/Query';
import CollectionReference from '../core/CollectionReference';
import DocumentReference from '../core/DocumentReference';
import DriverDocumentSnapshot from '../core/DriverDocumentSnapshot';
import DriverDocumentChangeSnapshot from '../core/DriverDocumentChangeSnapshot';
import Unsubscribe from '../core/Unsubscribe';
import DocumentPayload from '../core/DocumentPayload';

type Firestore = firebase.firestore.Firestore;

function serverTimestamp(): firebase.firestore.FieldValue {
  return firebase.firestore.FieldValue.serverTimestamp();
}

function collection<T>(
  firestore: Firestore,
  ref: CollectionReference<T>,
): firebase.firestore.CollectionReference {
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  return (ref.parent ? doc(firestore, ref.parent) : firestore).collection(
    ref.collectionId,
  );
}

function query<T>(
  firestore: Firestore,
  query: Query<T>,
): firebase.firestore.Query {
  const ref = collection(firestore, query.collection);

  return query.descriptors.reduce((p: firebase.firestore.Query, c) => {
    switch (c.type) {
      case 'EndAt':
        return p.endAt(c.value);
      case 'EndBefore':
        return p.endBefore(c.value);
      case 'Limit':
        return p.limit(c.limit);
      case 'OrderBy':
        return p.orderBy(c.fieldPath, c.direction);
      case 'StartAfter':
        return p.startAfter(c.value);
      case 'StartAt':
        return p.startAt(c.value);
      case 'Where':
        return p.where(c.fieldPath, c.operator, c.value);
      default:
        throw new Error(`Unsupported query type ${c.type}`);
    }
  }, ref);
}

function doc<T>(
  firestore: Firestore,
  ref: DocumentReference<T>,
): firebase.firestore.DocumentReference {
  return collection(firestore, ref.parent).doc(ref.id);
}

function encodeSnapshot<T>(
  snapshot: firebase.firestore.DocumentSnapshot,
): DriverDocumentSnapshot<T> {
  const { id } = snapshot;
  const payload = snapshot.data();
  if (!payload) return { id };

  const { data, createdAt, updatedAt } = payload as {
    data: T;
    createdAt: firebase.firestore.Timestamp;
    updatedAt: firebase.firestore.Timestamp;
  };
  if (!data || !createdAt || !updatedAt) return { id };

  return {
    id,
    payload: {
      data,
      createdAt: createdAt.toDate(),
      updatedAt: updatedAt.toDate(),
    },
  };
}

function encodeChangeSnapshot<T>(
  snapshot: firebase.firestore.DocumentChange,
): DriverDocumentChangeSnapshot<T> {
  return {
    ...encodeSnapshot<T>(snapshot.doc),
    change: {
      newIndex: snapshot.newIndex,
      oldIndex: snapshot.oldIndex,
      type: snapshot.type,
    },
  };
}

export default class FirestoreDriver implements Driver {
  private firestore: Firestore;

  public constructor(firestore: Firestore) {
    this.firestore = firestore;
  }

  async getQuery<T>(ref: Query<T>): Promise<DriverDocumentSnapshot<T>[]> {
    const snapshot = await query(this.firestore, ref).get();
    return snapshot.docs.map(doc => encodeSnapshot<T>(doc));
  }

  onQuerySnapshot<T>(
    ref: Query<T>,
    onNext: (changes: DriverDocumentChangeSnapshot<T>[]) => void,
  ): Unsubscribe {
    return query(this.firestore, ref).onSnapshot(snapshot => {
      onNext(
        snapshot.docChanges().map(change => encodeChangeSnapshot<T>(change)),
      );
    });
  }

  async getDocument<T>(
    ref: DocumentReference<T>,
  ): Promise<DocumentPayload<T> | undefined> {
    const snapshot = await doc(this.firestore, ref).get();
    return snapshot.data() as DocumentPayload<T> | undefined;
  }

  onDocumentSnapshot<T>(
    ref: DocumentReference<T>,
    onNext: (snapshot?: DocumentPayload<T>) => void,
  ): Unsubscribe {
    return doc(this.firestore, ref).onSnapshot(snapshot =>
      onNext(snapshot.data() as DocumentPayload<T> | undefined),
    );
  }

  async add<T>(
    ref: CollectionReference<T>,
    data: T,
  ): Promise<DocumentReference<T>> {
    const timestamp = serverTimestamp();
    const { id } = await collection(this.firestore, ref).add({
      data,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
    return ref.doc(id);
  }

  async set<T>(ref: DocumentReference<T>, data: Partial<T>): Promise<void> {
    const timestamp = serverTimestamp();
    await doc(this.firestore, ref).set({
      data,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }

  async update<T>(ref: DocumentReference<T>, data: Partial<T>): Promise<void> {
    await doc(this.firestore, ref).update({
      data,
      updatedAt: serverTimestamp(),
    });
  }

  async delete<T>(ref: DocumentReference<T>): Promise<void> {
    await doc(this.firestore, ref).delete();
  }
}
