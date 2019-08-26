import DocumentPath from './DocumentPath';

export default interface CollectionPath {
  parent?: DocumentPath;
  collectionId: string;
}
