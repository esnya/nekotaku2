import CollectionReference from './store/CollectionReference';
import Driver from './driver/Driver';

export default class Nekostore {
  public constructor(driver: Driver) {
    this.driver = driver;
  }

  public readonly driver: Driver;

  public collection<T>(id: string): CollectionReference<T> {
    return new CollectionReference<T>(this.driver, id);
  }
}

export { default as Driver } from './driver/Driver';
