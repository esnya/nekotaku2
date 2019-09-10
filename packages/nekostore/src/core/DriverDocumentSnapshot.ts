import DocumentPayload from './DocumentPayload';

export default interface DriverDocumentSnapshot<T> {
  id: string;
  payload?: DocumentPayload<T>;
}
