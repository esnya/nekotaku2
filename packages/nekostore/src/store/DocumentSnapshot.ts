import DocumentMetadata from './DocumentMetadata';
import DocumentReference from './DocumentReference';

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

  public get exists(): boolean {
    return typeof this.data !== undefined;
  }
  public get id(): string {
    return this.ref.id;
  }

  public get createdAt(): undefined | number {
    return this.metadata && this.metadata.createdAt;
  }
  public get updatedAt(): undefined | number {
    return this.metadata && this.metadata.updatedAt;
  }
  public get userId(): undefined | string {
    return this.metadata && this.metadata.userId;
  }
}
