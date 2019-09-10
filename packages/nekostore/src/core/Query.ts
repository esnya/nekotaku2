import DocumentSnapshot from './DocumentSnapshot';
import Unsubscribe from './Unsubscribe';
import Driver from './Driver';
import DocumentReference from './DocumentReference';
import CollectionPath from './CollectionPath';
import QueryDescriptor, {
  OrderDirection,
  WhereOperator,
} from './QueryDescriptor';
import QuerySnapshot from './QuerySnapshot';
import CollectionReference from './CollectionReference';
import QueryChangedSnapshot from './QueryChangeSnapshot';
import DocumentChangeSnapshot from './DocumentChangeSnapshot';

export default class Query<T> {
  public constructor(
    driver: Driver,
    collectionId: string,
    parent?: DocumentReference<{}>,
    descriptors: QueryDescriptor<T>[] = [],
  ) {
    this.driver = driver;
    this.collectionId = collectionId;
    this.parent = parent;
    this.descriptors = descriptors;
  }

  public readonly collectionId: string;
  public readonly driver: Driver;
  public readonly descriptors: QueryDescriptor<T>[];
  public readonly parent?: DocumentReference<{}>;

  public get collection(): CollectionReference<T> {
    return new CollectionReference<T>(
      this.driver,
      this.collectionId,
      this.parent,
    );
  }
  public get path(): CollectionPath {
    return {
      parent: this.parent && this.parent.path,
      collectionId: this.collectionId,
    };
  }

  private query(descriptor: QueryDescriptor<T>): Query<T> {
    return new Query<T>(this.driver, this.collectionId, this.parent, [
      ...this.descriptors,
      descriptor,
    ]);
  }

  public endAt(value: any | DocumentSnapshot<T>): Query<T> {
    return this.query({
      type: 'EndAt',
      value,
    });
  }

  public endBefore(value: any | DocumentSnapshot<T>): Query<T> {
    return this.query({
      type: 'EndBefore',
      value,
    });
  }

  public async get(): Promise<QuerySnapshot<T>> {
    const docs = await this.driver.getQuery<T>(this);
    return new QuerySnapshot(
      this,
      docs.map(({ id, payload }) => {
        const ref = new DocumentReference(this.collection, id);
        return new DocumentSnapshot(ref, payload);
      }),
    );
  }

  public limit(limit: number): Query<T> {
    return this.query({
      type: 'Limit',
      limit,
    });
  }

  public offset(offset: number): Query<T> {
    return this.query({
      type: 'Offset',
      offset,
    });
  }

  public async onSnapshot(
    onNext: (snapshot: QueryChangedSnapshot<T>) => void,
  ): Promise<Unsubscribe> {
    return await this.driver.onQuerySnapshot(this, snapshot => {
      onNext(
        new QueryChangedSnapshot<T>(
          this,
          snapshot.map(doc => {
            const { id, payload, change } = doc;

            const ref = new DocumentReference<T>(this.collection, id);

            return new DocumentChangeSnapshot<T>(ref, change, payload);
          }),
        ),
      );
    });
  }

  public orderBy(
    fieldPath: string,
    direction: OrderDirection = 'asc',
  ): Query<T> {
    return this.query({
      type: 'OrderBy',
      fieldPath,
      direction,
    });
  }

  public startAfter(value: any | DocumentSnapshot<T>): Query<T> {
    return this.query({
      type: 'StartAfter',
      value,
    });
  }

  public startAt(value: any | DocumentSnapshot<T>): Query<T> {
    return this.query({
      type: 'StartAt',
      value,
    });
  }

  public where(
    fieldPath: string,
    operator: WhereOperator,
    value: any,
  ): Query<T> {
    return this.query({
      type: 'Where',
      fieldPath,
      operator,
      value,
    });
  }
}
