import merge from 'lodash/merge';
import Unsubscribe from '../core/Unsubscribe';
import DriverDocumentSnapshot from '../core/DriverDocumentSnapshot';
import DocumentPath from '../core/DocumentPath';
import CollectionPath from '../core/CollectionPath';
import Query from '../core/Query';
import DriverDocumentChangeSnapshot from '../core/DriverDocumentChangeSnapshot';
import DocumentReference from '../core/DocumentReference';
import DocumentPayload from '../core/DocumentPayload';
import DocumentChange from '../core/DocumentChange';
import CollectionReference from '../core/CollectionReference';
import Driver from '../core/Driver';
import EventBus from '../core/EventBus';
import Store from '../core/Store';
import LocalEventBus from '../events/LocanEventBus';
import MemoryStore from '../stores/MemoryStore';

const Sep = ':';

function getDocumentKey(path: DocumentPath): string {
  return path.map(e => `${e.collectionId}${Sep}${e.documentId}`).join(Sep);
}

function getCollectionKey(path: CollectionPath): string {
  return path.parent
    ? `${getDocumentKey(path.parent)}${Sep}${path.collectionId}`
    : path.collectionId;
}

export default class BasicDriver implements Driver {
  private readonly eventBus: EventBus;
  private readonly store: Store;

  public constructor(eventBus?: EventBus, store?: Store) {
    this.eventBus = eventBus || new LocalEventBus();
    this.store = store || new MemoryStore();
  }

  private emitChange<T>(
    ref: DocumentReference<T>,
    change: DocumentChange,
    payload?: DocumentPayload<T>,
  ): void {
    const collection = getCollectionKey(ref.parent.path);
    this.eventBus.emit(collection, [
      {
        id: ref.id,
        change,
        payload,
      },
    ]);

    const key = getDocumentKey(ref.path);
    this.eventBus.emit(key, payload);
  }

  public getQuery<T>(ref: Query<T>): Promise<DriverDocumentSnapshot<T>[]> {
    const collection = getCollectionKey(ref.path);
    return this.store.find<DocumentPayload<T>, T>(collection, ref.descriptors);
  }

  public onQuerySnapshot<T>(
    ref: Query<T>,
    onNext: (changes: DriverDocumentChangeSnapshot<T>[]) => void,
  ): Unsubscribe {
    const collection = getCollectionKey(ref.path);
    return this.eventBus.on<DriverDocumentChangeSnapshot<T>[]>(
      collection,
      onNext,
    );
  }

  public getDocument<T>(
    ref: DocumentReference<T>,
  ): Promise<DocumentPayload<T> | undefined> {
    const collection = getCollectionKey(ref.parent.path);
    return this.store.get<DocumentPayload<T>>(collection, ref.id);
  }
  public onDocumentSnapshot<T>(
    ref: DocumentReference<T>,
    onNext: (snapshot?: DocumentPayload<T>) => void,
  ): Unsubscribe {
    const key = getDocumentKey(ref.path);
    return this.eventBus.on<DocumentPayload<T> | undefined>(key, onNext);
  }

  public async add<T>(
    ref: CollectionReference<T>,
    data: T,
  ): Promise<DocumentReference<T>> {
    const collection = getCollectionKey(ref.path);

    const timestamp = this.store.serverTimestamp();
    const payload = {
      data,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    const id = await this.store.add(collection, payload);

    const docRef = ref.doc(id);
    this.emitChange(
      docRef,
      { type: 'added', newIndex: 0, oldIndex: -1 },
      payload,
    );

    return ref.doc(id);
  }

  public async set<T>(ref: DocumentReference<T>, data: T): Promise<void> {
    const collection = getCollectionKey(ref.parent.path);

    const timestamp = this.store.serverTimestamp();
    const payload = {
      data,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await this.store.update(collection, ref.id, payload);

    this.emitChange(
      ref,
      { type: 'modified', newIndex: -1, oldIndex: -1 },
      payload,
    );
  }

  public async update<T>(
    ref: DocumentReference<T>,
    data: Partial<T>,
  ): Promise<void> {
    const collection = getCollectionKey(ref.parent.path);

    const timestamp = this.store.serverTimestamp();
    const prev = await this.store
      .get<DocumentPayload<T>>(collection, ref.id)
      .catch(() => undefined);

    const payload = {
      data: merge(data, prev && prev.data),
      createdAt: prev ? prev.createdAt : timestamp,
      updatedAt: timestamp,
    };

    await this.store.update(collection, ref.id, payload);

    this.emitChange(
      ref,
      { type: 'modified', newIndex: -1, oldIndex: -1 },
      await this.store.get(collection, ref.id),
    );
  }

  public async delete<T>(ref: DocumentReference<T>): Promise<void> {
    const collection = getCollectionKey(ref.parent.path);

    await this.store.delete(collection, ref.id);

    this.emitChange(ref, { type: 'removed', newIndex: -1, oldIndex: -1 });
  }
}
