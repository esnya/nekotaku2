import Query from '../references/Query';
import DocumentChangeSnapshot from './DocumentChangeSnapshot';

export default class QueryChangeSnapshot<T> extends Array<
  DocumentChangeSnapshot<T>
> {
  public constructor(query: Query<T>, docs: DocumentChangeSnapshot<T>[]) {
    super(...docs);
    this.query = query;
  }

  public readonly query: Query<T>;
}
