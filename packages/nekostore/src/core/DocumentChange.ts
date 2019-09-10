export type ChangeType = 'added' | 'modified' | 'removed';

export default interface DocumentChange {
  type: ChangeType;
  newIndex: number;
  oldIndex: number;
}
