import DocumentMetadata from '../types/DocumentMetadata';

export default interface DriverDocumentSnapshot<T> {
  id: string;
  data?: T;
  metadata?: DocumentMetadata;
}
