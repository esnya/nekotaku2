import Unsubscribe from '../types/Unsubscribe';
import QueryDescriptor from '../types/QueryDescriptor';
import DocumentReference from '../references/DocumentReference';
import Query from '../references/Query';
import DriverDocumentSnapshot from './DriverDocumentSnapshot';
import DriverDocumentChangeSnapshot from './DriverDocumentChangeSnapshot';
import CollectionReference from '../references/CollectionReference';

export default interface Driver {
  getQuery<T>(
    ref: Query<T>,
    descriptors: QueryDescriptor<T>[],
  ): Promise<DriverDocumentSnapshot<T>[]>;
  onQuerySnapshot<T>(
    ref: Query<T>,
    descriptors: QueryDescriptor<T>[],
    onNext: (changes: DriverDocumentChangeSnapshot<T>[]) => void,
  ): Promise<Unsubscribe>;

  getDocument<T>(ref: DocumentReference<T>): Promise<DriverDocumentSnapshot<T>>;
  onDocumentSnapshot<T>(
    ref: DocumentReference<T>,
    onNext: (snapshot: DriverDocumentSnapshot<T>) => void,
  ): Promise<Unsubscribe>;

  add<T>(ref: CollectionReference<T>, data: T): Promise<DocumentReference<T>>;
  update<T>(ref: DocumentReference<T>, data: Partial<T>): Promise<void>;
  delete<T>(ref: DocumentReference<T>): Promise<void>;
}