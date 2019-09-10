import uuid from 'uuid';
import mingo from 'mingo';
import Store, { getQueries } from '../core/Store';
import QueryDescriptor from '../core/QueryDescriptor';

export default class MemoryStore implements Store {
  private store: Record<string, any> = {};

  public async add<T>(collection: string, data: T): Promise<string> {
    const id = uuid.v4();
    const key = `${collection}:${id}`;

    this.store[key] = data;

    return id;
  }

  public async delete<T>(collection: string, id: string): Promise<void> {
    const key = `${collection}:${id}`;
    delete this.store[key];
  }

  public async update<T>(
    collection: string,
    id: string,
    data: T,
  ): Promise<void> {
    const key = `${collection}:${id}`;
    this.store[key] = data;
  }

  public async find<T, U>(
    collection: string,
    descriptors: QueryDescriptor<U>[],
  ): Promise<{ id: string; payload: T }[]> {
    const query = new mingo.Query(getQueries(descriptors));

    const keyPattern = new RegExp(`^${collection}:([^:]+)$`);
    const items = Object.keys(this.store)
      .map(key => {
        const m = key.match(keyPattern);
        if (!m) return null;
        return {
          id: m[1],
          payload: this.store[key] as T,
        };
      })
      .filter(a => a !== null) as {
      id: string;
      payload: T;
    }[];

    return query.find(items).all();
  }

  public async get<T>(collection: string, id: string): Promise<T> {
    const key = `${collection}:${id}`;
    const item = this.store[key];
    if (!item) throw new Error('NotFound');
    return item;
  }

  public serverTimestamp(): any {
    return new Date();
  }
}
