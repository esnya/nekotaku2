import Unsubscribe from './Unsubscribe';
import DocumentReference from './DocumentReference';
import Query from './Query';
import DriverDocumentSnapshot from './DriverDocumentSnapshot';
import DriverDocumentChangeSnapshot from './DriverDocumentChangeSnapshot';
import CollectionReference from './CollectionReference';
import DocumentPayload from './DocumentPayload';

export default interface Driver {
  getQuery<T>(ref: Query<T>): Promise<DriverDocumentSnapshot<T>[]>;
  onQuerySnapshot<T>(
    ref: Query<T>,
    onNext: (changes: DriverDocumentChangeSnapshot<T>[]) => void,
  ): Unsubscribe;

  getDocument<T>(
    ref: DocumentReference<T>,
  ): Promise<DocumentPayload<T> | undefined>;
  onDocumentSnapshot<T>(
    ref: DocumentReference<T>,
    onNext: (snapshot?: DocumentPayload<T>) => void,
  ): Unsubscribe;

  add<T>(ref: CollectionReference<T>, data: T): Promise<DocumentReference<T>>;
  set<T>(ref: DocumentReference<T>, data: T): Promise<void>;
  update<T>(ref: DocumentReference<T>, data: Partial<T>): Promise<void>;
  delete<T>(ref: DocumentReference<T>): Promise<void>;
}
