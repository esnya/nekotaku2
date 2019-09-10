import QueryDescriptor, { WhereOperator } from './QueryDescriptor';
import { FilterQuery } from 'mongodb';

export default interface Store {
  add<T>(collection: string, data: T): Promise<string>;
  delete(collection: string, id: string): Promise<void>;
  update<T>(collection: string, id: string, data: T): Promise<void>;
  find<T, U>(
    collection: string,
    query: QueryDescriptor<U>[],
  ): Promise<{ id: string; payload: T }[]>;
  get<T>(collection: string, id: string): Promise<T>;
  serverTimestamp(): any;
}

function getQueryOperator(op: WhereOperator): string {
  switch (op) {
    case '<':
      return '$gt';
    case '<=':
      return '$ge';
    case '==':
      return '$eq';
    case '>':
      return '$lt';
    case '>=':
      return '$le';
  }
}

function getQuery<T>(descriptor: QueryDescriptor<T>): FilterQuery<any> | null {
  switch (descriptor.type) {
    case 'Limit':
    case 'Offset':
    case 'OrderBy':
      return null;
    case 'Where':
      return {
        [descriptor.fieldPath as keyof T]: {
          [getQueryOperator(descriptor.operator)]: descriptor.value,
        },
      };
    default:
      throw new Error(`Unsupported query type ${descriptor.type}`);
  }
}

export function getQueries<T>(
  descriptors: QueryDescriptor<T>[],
): FilterQuery<any> {
  const queries = descriptors
    .map(getQuery)
    .filter(a => a !== null) as FilterQuery<T>[];

  if (queries.length === 0) return {};
  else if (queries.length === 1) return queries[0];
  return { $and: queries };
}
