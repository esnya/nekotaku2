import DriverDocumentSnapshot from './DriverDocumentSnapshot';
import DocumentChange from '../types/DocumentChange';

export default interface DriverDocumentChangeSnapshot<T>
  extends DriverDocumentSnapshot<T | undefined> {
  change: DocumentChange;
}
