import DocumentSnapshot from './DocumentSnapshot';
import DocumentChange, { ChangeType } from './DocumentChange';
import DocumentReference from './DocumentReference';
import DocumentMetadata from './DocumentMetadata';

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
