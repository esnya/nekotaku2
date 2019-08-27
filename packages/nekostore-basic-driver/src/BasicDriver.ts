// import mingo from 'mingo';
import {
  Driver,
  Unsubscribe,
  DriverDocumentSnapshot,
  DocumentReference,
  DocumentChange,
  DocumentPath,
  CollectionPath,
  DriverDocumentChangeSnapshot,
  QueryDescriptor,
  CollectionReference,
  Query,
} from 'nekostore';

export interface Publisher {
  publish<T>(event: string, value: T): Promise<void>;
}

export interface Subscriber {
  subscribe<T>(
    event: string,
    callback: (value: T) => void,
  ): Promise<Unsubscribe>;
}

export interface Store {
  add<T>(collection: string, data: T): Promise<string>;
  delete(collection: string, id: string): Promise<void>;
  find<T>(collection: string, query: {}): Promise<T[]>;
  get<T>(collection: string, id: string): Promise<T | undefined>;
  update<T>(collection: string, id: string, data: T): Promise<void>;
}

export interface Options {
  publisher: Publisher;
  subscriber: Subscriber;
  store: Store;
}

const PathSeperator = '/';
function toDocumentKey(path: DocumentPath): string {
  return path
    .map(e => [e.collectionId, e.documentId].join(PathSeperator))
    .join(PathSeperator);
}

function toCollectionKey(path: CollectionPath): string {
  const { parent, collectionId } = path;
  if (!parent) return collectionId;

  return [toDocumentKey(parent), collectionId].join(PathSeperator);
}

export default class BasicDriver implements Driver {
  public constructor(options: Options) {
    this.publisher = options.publisher;
    this.subscriber = options.subscriber;
    this.store = options.store;
  }

  public readonly publisher: Publisher;
  public readonly subscriber: Subscriber;
  public readonly store: Store;

  private async emitChange<T>(
    ref: DocumentReference<T>,
    snapshot: DriverDocumentSnapshot<T>,
    change: DocumentChange,
  ): Promise<void> {
    const changeSnapshot: DriverDocumentChangeSnapshot<T> = {
      ...snapshot,
      change,
    };
    await Promise.all([
      this.publisher.publish(toDocumentKey(ref.path), snapshot),
      this.publisher.publish(toCollectionKey(ref.parent.path), [
        changeSnapshot,
      ]),
    ]);
  }

  public async getQuery<T>(
    ref: Query<T>,
    descriptors: QueryDescriptor<T>[],
  ): Promise<DriverDocumentSnapshot<T>[]> {
    if (descriptors.length > 0) throw new Error('Query is not supported');

    const collection = toCollectionKey(ref.path);
    const results = await this.store.find<DriverDocumentSnapshot<T>>(
      collection,
      {},
    );

    return results;
  }

  public async onQuerySnapshot<T>(
    ref: Query<T>,
    descriptors: QueryDescriptor<T>[],
    onNext: (changes: DriverDocumentChangeSnapshot<T>[]) => void,
  ): Promise<Unsubscribe> {
    if (descriptors.length > 0) throw new Error('Query is not supported');

    return await this.subscriber.subscribe<DriverDocumentChangeSnapshot<T>[]>(
      toCollectionKey(ref.path),
      onNext,
    );
  }

  public async getDocument<T>(
    ref: DocumentReference<T>,
  ): Promise<DriverDocumentSnapshot<T>> {
    const data = await this.store.get<DriverDocumentSnapshot<T>>(
      toCollectionKey(ref.parent.path),
      ref.id,
    );

    if (!data) {
      return {
        id: ref.id,
      };
    }

    return data;
  }

  public async onDocumentSnapshot<T>(
    ref: DocumentReference<T>,
    onNext: (snapshot: DriverDocumentSnapshot<T>) => void,
  ): Promise<Unsubscribe> {
    return await this.subscriber.subscribe<DriverDocumentSnapshot<T>>(
      toDocumentKey(ref.path),
      onNext,
    );
  }

  public async add<T>(
    ref: CollectionReference<T>,
    data: T,
  ): Promise<DocumentReference<T>> {
    const insertData = {
      data,
      metadata: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        userId: 'local',
      },
    };

    const id = await this.store.add(toCollectionKey(ref.path), insertData);

    const snapshot = {
      id,
      ...insertData,
    };

    const docRef = new DocumentReference<T>(ref, id);

    this.emitChange(docRef, snapshot, {
      type: 'added',
      newIndex: 0,
      oldIndex: 0,
    });

    return docRef;
  }

  public async update<T>(
    ref: DocumentReference<T>,
    data: Partial<T>,
  ): Promise<void> {
    const prevSnapshot = await this.store.get<DriverDocumentSnapshot<T>>(
      toCollectionKey(ref.parent.path),
      ref.id,
    );

    if (!prevSnapshot || !prevSnapshot.data || !prevSnapshot.metadata)
      throw new Error('Not found error');

    const nextData = {
      ...prevSnapshot.data,
      data,
    };
    const nextMetadata = {
      ...prevSnapshot.metadata,
      updatedAt: Date.now(),
    };

    const snapshot: DriverDocumentSnapshot<T> = {
      id: ref.id,
      data: nextData,
      metadata: nextMetadata,
    };

    await this.store.update(toCollectionKey(ref.parent.path), ref.id, snapshot);

    this.emitChange(ref, snapshot, {
      type: 'modified',
      newIndex: 0,
      oldIndex: 0,
    });
  }

  public async delete<T>(ref: DocumentReference<T>): Promise<void> {
    await this.store.delete(toCollectionKey(ref.parent.path), ref.id);
    this.emitChange(
      ref,
      { id: ref.id },
      { type: 'removed', newIndex: 0, oldIndex: 0 },
    );
  }
}
