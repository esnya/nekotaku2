import DocumentSnapshot from '../snapshots/DocumentSnapshot';
import Unsubscribe from '../types/Unsubscribe';
import FieldPath from '../types/FieldPath';
import Driver from '../drivers/Driver';
import DocumentReference from './DocumentReference';
import CollectionPath from '../types/CollectionPath';
import QueryDescriptor, {
  OrderDirection,
  WhereOperator,
} from '../types/QueryDescriptor';
import QuerySnapshot from '../snapshots/QuerySnapshot';
import CollectionReference from './CollectionReference';
import QueryChangedSnapshot from '../snapshots/QueryChangeSnapshot';
import DocumentChangeSnapshot from '../snapshots/DocumentChangeSnapshot';

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

  public endAt(snapshot: DocumentSnapshot<T>): Query<T> {
    return this.query({
      type: 'EndAt',
      snapshot,
    });
  }

  public endBefore(snapshot: DocumentSnapshot<T>): Query<T> {
    return this.query({
      type: 'EndBefore',
      snapshot,
    });
  }

  public async get(): Promise<QuerySnapshot<T>> {
    const docs = await this.driver.getQuery<T>(this, this.descriptors);
    return new QuerySnapshot(
      this,
      docs.map(({ id, data, metadata }) => {
        const ref = new DocumentReference(this.collection, id);
        return new DocumentSnapshot(ref, data, metadata);
      }),
    );
  }

  public limit(limit: number): Query<T> {
    return this.query({
      type: 'Limit',
      limit,
    });
  }

  public async onSnapshot(
    onNext: (snapshot: QueryChangedSnapshot<T>) => void,
  ): Promise<Unsubscribe> {
    return await this.driver.onQuerySnapshot(
      this,
      this.descriptors,
      snapshot => {
        onNext(
          new QueryChangedSnapshot<T>(
            this,
            snapshot.map(doc => {
              const { id, data, change, metadata } = doc;

              const ref = new DocumentReference<T>(this.collection, id);

              return new DocumentChangeSnapshot<T>(ref, change, data, metadata);
            }),
          ),
        );
      },
    );
  }

  public orderBy(
    fieldPath: FieldPath,
    direction: OrderDirection = 'asc',
  ): Query<T> {
    return this.query({
      type: 'OrderBy',
      fieldPath,
      direction,
    });
  }

  public startAfter(snapshot: DocumentSnapshot<T>): Query<T> {
    return this.query({
      type: 'StartAfter',
      snapshot,
    });
  }

  public startAt(snapshot: DocumentSnapshot<T>): Query<T> {
    return this.query({
      type: 'StartAt',
      snapshot,
    });
  }

  public where(
    fieldPath: FieldPath,
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
