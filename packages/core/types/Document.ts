export default interface Document<T> {
  id: string;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number;
  userId: string;
  data: T;
}
