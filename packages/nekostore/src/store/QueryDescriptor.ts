import FieldPath from './FieldPath';
import DocumentSnapshot from './DocumentSnapshot';

export interface QueryDescriptorBase<T extends string> {
  type: T;
}
interface QueryDescriptorWithSnapshot<T extends string, U>
  extends QueryDescriptorBase<T> {
  snapshot: DocumentSnapshot<U>;
}
export type EndAt<T> = QueryDescriptorWithSnapshot<'EndAt', T>;
export type EndBefore<T> = QueryDescriptorWithSnapshot<'EndBefore', T>;
export interface Limit extends QueryDescriptorBase<'Limit'> {
  limit: number;
}
interface QueryDescriptorWithFieldPath<T extends string>
  extends QueryDescriptorBase<T> {
  fieldPath: FieldPath;
}
export type OrderDirection = 'desc' | 'asc';
export interface OrderBy extends QueryDescriptorWithFieldPath<'OrderBy'> {
  direction: OrderDirection;
}
export type StartAt<T> = QueryDescriptorWithSnapshot<'StartAt', T>;
export type StartAfter<T> = QueryDescriptorWithSnapshot<'StartAfter', T>;
export type WhereOperator = '<' | '<=' | '==' | '>' | '>=';
export interface Where extends QueryDescriptorWithFieldPath<'Where'> {
  operator: WhereOperator;
  value: any;
}
type QueryDescriptor<T> =
  | EndAt<T>
  | EndBefore<T>
  | Limit
  | OrderBy
  | StartAt<T>
  | StartAfter<T>
  | Where;
export default QueryDescriptor;

declare const QueryDescriptorTypeGetter: QueryDescriptor<{}>;
export type QueryType = typeof QueryDescriptorTypeGetter.type;
