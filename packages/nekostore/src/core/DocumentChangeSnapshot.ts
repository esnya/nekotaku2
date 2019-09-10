import DocumentSnapshot from './DocumentSnapshot';
import DocumentChange, { ChangeType } from './DocumentChange';
import DocumentReference from './DocumentReference';
import DocumentPayload from './DocumentPayload';

export default class DocumentChangeSnapshot<T> extends DocumentSnapshot<T>
  implements DocumentChange {
  public constructor(
    ref: DocumentReference<T>,
    change: DocumentChange,
    payload?: DocumentPayload<T>,
  ) {
    super(ref, payload);

    this.type = change.type;
    this.newIndex = change.newIndex;
    this.oldIndex = change.oldIndex;
  }

  public readonly type: ChangeType;
  public readonly newIndex: number;
  public readonly oldIndex: number;
}
