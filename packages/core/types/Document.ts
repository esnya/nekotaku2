export default interface Document<T> {
  id: string;
  createdAt: number;
  updatedAt: number;
  deletedAt?: number;
  data: T;
}
