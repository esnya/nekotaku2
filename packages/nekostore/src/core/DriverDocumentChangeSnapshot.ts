import DriverDocumentSnapshot from './DriverDocumentSnapshot';
import DocumentChange from './DocumentChange';

export default interface DriverDocumentChangeSnapshot<T>
  extends DriverDocumentSnapshot<T> {
  change: DocumentChange;
}
