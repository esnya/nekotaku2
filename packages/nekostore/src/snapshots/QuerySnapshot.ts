import Query from '../references/Query';
import DocumentSnapshot from './DocumentSnapshot';

export default class QuerySnapshot<T> extends Array<DocumentSnapshot<T>> {
  public constructor(query: Query<T>, docs: DocumentSnapshot<T>[]) {
    super(...docs);
    this.query = query;
  }

  public readonly query: Query<T>;
}
