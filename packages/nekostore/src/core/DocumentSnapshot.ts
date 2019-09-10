import DocumentReference from './DocumentReference';

export interface DocumentSnapshotWithData<T> extends DocumentSnapshot<T> {
  readonly data: T;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export default class DocumentSnapshot<T> {
  public constructor(
    ref: DocumentReference<T>,
    payload?: {
      data: T;
      createdAt: Date;
      updatedAt: Date;
    },
  ) {
    this.ref = ref;

    if (payload) {
      this.data = payload.data;
      this.createdAt = payload.createdAt;
      this.updatedAt = payload.updatedAt;
    }
  }

  public readonly data?: T;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;
  public readonly ref: DocumentReference<T>;

  public get id(): string {
    return this.ref.id;
  }

  public exists(): this is DocumentSnapshotWithData<T> {
    return typeof this.data !== undefined;
  }
}
