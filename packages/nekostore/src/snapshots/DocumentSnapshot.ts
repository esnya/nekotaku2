import DocumentMetadata from '../types/DocumentMetadata';
import DocumentReference from '../references/DocumentReference';

export interface DocumentSnapshotWithData<T> extends DocumentSnapshot<T> {
  readonly data: T;
  readonly metadata: DocumentMetadata;
}

export default class DocumentSnapshot<T> {
  public constructor(
    ref: DocumentReference<T>,
    data?: T,
    metadata?: DocumentMetadata,
  ) {
    this.ref = ref;
    this.metadata = metadata;
    this.data = data;
  }

  public readonly data?: T;
  public readonly metadata?: DocumentMetadata;
  public readonly ref: DocumentReference<T>;

  public get id(): string {
    return this.ref.id;
  }

  public exists(): this is DocumentSnapshotWithData<T> {
    return typeof this.data !== undefined;
  }
}
