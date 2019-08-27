import DocumentSnapshot from './DocumentSnapshot';
import DocumentChange, { ChangeType } from '../types/DocumentChange';
import DocumentReference from '../references/DocumentReference';
import DocumentMetadata from '../types/DocumentMetadata';

export default class DocumentChangeSnapshot<T> extends DocumentSnapshot<T>
  implements DocumentChange {
  public constructor(
    ref: DocumentReference<T>,
    change: DocumentChange,
    data?: T,
    metadata?: DocumentMetadata,
  ) {
    super(ref, data, metadata);
    this.change = change;
  }

  public readonly change: DocumentChange;

  public get type(): ChangeType {
    return this.change.type;
  }
  public get newIndex(): number {
    return this.newIndex;
  }
  public get oldIndex(): number {
    return this.oldIndex;
  }
}
