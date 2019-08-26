import DocumentReference from './DocumentReference';
import Query from './Query';
import Driver from '../driver/Driver';

export default class CollectionReference<T> extends Query<T> {
  public constructor(
    driver: Driver,
    id: string,
    parent?: DocumentReference<{}>,
  ) {
    super(driver, id, parent);
  }

  public get id(): string {
    return this.collectionId;
  }

  public async add(data: T): Promise<DocumentReference<T>> {
    return await this.driver.add<T>(this, data);
  }

  public doc(id: string): DocumentReference<T> {
    return new DocumentReference<T>(this, id);
  }
}
