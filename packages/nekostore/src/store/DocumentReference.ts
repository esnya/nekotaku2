import CollectionReference from './CollectionReference';
import Unsubscribe from './Unsubscribe';
import DocumentSnapshot from './DocumentSnapshot';
import DocumentPath from './DocumentPath';
import Driver from '../driver/Driver';

export default class DocumentReference<T> {
  public constructor(parent: CollectionReference<T>, id: string) {
    this.parent = parent;
    this.id = id;
  }

  public readonly parent: CollectionReference<T>;
  public readonly id: string;

  public get driver(): Driver {
    return this.parent.driver;
  }

  public get path(): DocumentPath {
    const { parent, collectionId } = this.parent.path;

    return [
      ...(parent || []),
      {
        collectionId,
        documentId: this.id,
      },
    ];
  }

  public collection<U>(id: string): CollectionReference<U> {
    return new CollectionReference(this.driver, id, this);
  }

  public async delete(): Promise<void> {
    return await this.driver.delete(this);
  }

  public async get(): Promise<DocumentSnapshot<T>> {
    const { data, metadata } = await this.driver.getDocument<T>(this);

    return new DocumentSnapshot(this, data, metadata);
  }

  public async onSnapshot(
    onNext: (snapshot: DocumentSnapshot<T>) => void,
  ): Promise<Unsubscribe> {
    return await this.driver.onDocumentSnapshot<T>(
      this,
      ({ data, metadata }) => {
        onNext(new DocumentSnapshot(this, data, metadata));
      },
    );
  }

  public async update(data: Partial<T>): Promise<void> {
    return await this.driver.update<T>(this, data);
  }
}
