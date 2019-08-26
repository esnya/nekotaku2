import Driver from 'nekostore/lib/driver/Driver';
import LocalForage from 'localforage';
import Query from 'nekostore/lib/store/Query';
import QueryDescriptor from 'nekostore/lib/store/QueryDescriptor';
import DriverDocumentSnapshot from 'nekostore/lib/driver/DriverDocumentSnapshot';
import addFind from 'localforage-find';
import CollectionPath from 'nekostore/lib/store/CollectionPath';
import DocumentPath from 'nekostore/lib/store/DocumentPath';
import { EventEmitter } from 'events';
import DriverDocumentChangeSnapshot from 'nekostore/lib/driver/DriverDocumentChangeSnapshot';
import Unsubscribe from 'nekostore/lib/store/Unsubscribe';
import DocumentReference from 'nekostore/lib/store/DocumentReference';
import CollectionReference from 'nekostore/lib/store/CollectionReference';
import uuid from 'uuid';
import DocumentChange from 'nekostore/lib/store/DocumentChange';

interface LocalForageWithFind extends LocalForage {
  find<T>(
    critina: (key: string, value: T) => boolean,
    limit?: number,
  ): Promise<T[]>;
}

const PathSepereter = '/';
function getKey(path: DocumentPath): string {
  return path
    .map(a => [a.collectionId, a.documentId].join(PathSepereter))
    .join(PathSepereter);
}
function getCollectionKey(path: CollectionPath): string {
  const { parent, collectionId } = path;
  if (!parent) return collectionId;
  return [getKey(parent), collectionId].join(PathSepereter);
}

export default class LocalForageDriver implements Driver {
  public constructor(localForage: LocalForage, eventBus: EventEmitter) {
    if (!('find' in localForage)) addFind(localForage);

    if (!('find' in localForage)) {
      throw new TypeError('localforage-find is not installed');
    }

    this.localForage = localForage;
    this.eventBus = eventBus;
  }

  private emitChange<T>(
    ref: DocumentReference<T>,
    snapshot: DriverDocumentSnapshot<T>,
    change: DocumentChange,
  ): void {
    this.eventBus.emit(getKey(ref.path), snapshot);
    const changeSnapshot: DriverDocumentChangeSnapshot<T> = {
      ...snapshot,
      change,
    };
    this.eventBus.emit(getCollectionKey(ref.parent.path), [changeSnapshot]);
  }

  private addDocumentEventListener<T>(
    ref: DocumentReference<T>,
    onNext: (snapshot: DriverDocumentSnapshot<T>) => void,
  ): () => Promise<void> {
    const event = getKey(ref.path);
    this.eventBus.on(event, onNext);
    return async () => {
      this.eventBus.off(event, onNext);
    };
  }

  private addCollectionEventListener<T>(
    ref: Query<T>,
    onNext: (snapshot: DriverDocumentChangeSnapshot<T>[]) => void,
  ): () => Promise<void> {
    const event = getCollectionKey(ref.path);
    this.eventBus.on(event, onNext);
    return async () => {
      this.eventBus.off(event, onNext);
    };
  }

  private async getItem<T>(
    ref: DocumentReference<T>,
  ): Promise<DriverDocumentSnapshot<T>> {
    const snapshot = await this.localForage.getItem<
      DriverDocumentChangeSnapshot<T>
    >(getKey(ref.path));
    if (!snapshot) {
      return {
        id: ref.id,
      };
    }

    return snapshot;
  }

  private async removeItem<T>(ref: DocumentReference<T>): Promise<void> {
    await this.localForage.removeItem(getKey(ref.path));
  }

  private async setItem<T>(
    ref: DocumentReference<T>,
    value: DriverDocumentSnapshot<T>,
  ): Promise<void> {
    await this.localForage.setItem<DriverDocumentSnapshot<T>>(
      getKey(ref.path),
      value,
    );
  }

  public readonly localForage: LocalForageWithFind;
  public readonly eventBus: EventEmitter;

  public async getQuery<T>(
    ref: Query<T>,
    descriptors: QueryDescriptor<T>[],
  ): Promise<DriverDocumentSnapshot<T>[]> {
    if (descriptors.length > 0) throw new Error('Query is not supported');

    const keyPrefix = getCollectionKey(ref.path);
    const results = await this.localForage.find<DriverDocumentSnapshot<T>>(
      (key: string) => key.startsWith(keyPrefix),
    );

    return results;
  }

  public async onQuerySnapshot<T>(
    ref: Query<T>,
    descriptors: QueryDescriptor<T>[],
    onNext: (changes: DriverDocumentChangeSnapshot<T>[]) => void,
  ): Promise<Unsubscribe> {
    if (descriptors.length > 0) throw new Error('Query is not supported');
    return this.addCollectionEventListener(ref, onNext);
  }

  public async getDocument<T>(
    ref: DocumentReference<T>,
  ): Promise<DriverDocumentSnapshot<T>> {
    return await this.getItem(ref);
  }

  public async onDocumentSnapshot<T>(
    ref: DocumentReference<T>,
    onNext: (snapshot: DriverDocumentSnapshot<T>) => void,
  ): Promise<Unsubscribe> {
    return this.addDocumentEventListener(ref, onNext);
  }

  public async add<T>(
    ref: CollectionReference<T>,
    data: T,
  ): Promise<DocumentReference<T>> {
    const id = uuid.v4();
    const docRef = new DocumentReference<T>(ref, id);
    const snapshot = {
      id,
      data,
      metadata: {
        createdAt: Date.now(),
        updatedAt: Date.now(),
        userId: 'local',
      },
    };
    await this.setItem(docRef, snapshot);
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
    const { data: oldData, metadata: oldMetadata } = await this.getItem(ref);

    if (!oldData || !oldMetadata) throw new Error('Not found error');

    const newData: T = {
      ...oldData,
      data,
    };
    const newMetadata = {
      ...oldMetadata,
      updatedAt: Date.now(),
    };
    const snapshot: DriverDocumentSnapshot<T> = {
      id: ref.id,
      data: newData,
      metadata: newMetadata,
    };

    await this.setItem(ref, snapshot);

    this.emitChange(ref, snapshot, {
      type: 'modified',
      newIndex: 0,
      oldIndex: 0,
    });
  }

  public async delete<T>(ref: DocumentReference<T>): Promise<void> {
    await this.removeItem(ref);
    this.emitChange(
      ref,
      { id: ref.id },
      { type: 'removed', newIndex: 0, oldIndex: 0 },
    );
  }
}
