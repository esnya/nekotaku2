import DocumentMetadata from '../store/DocumentMetadata';

export default interface DriverDocumentSnapshot<T> {
  id: string;
  data?: T;
  metadata?: DocumentMetadata;
}
