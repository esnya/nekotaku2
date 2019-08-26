declare module 'localforage-find' {
  import LocalForage from 'localforage';

  export default function addFind(localForage: LocalForage): void;
}
