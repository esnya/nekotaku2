import CollectionReference from './references/CollectionReference';
import Driver from './drivers/Driver';

export default class Nekostore {
  public constructor(driver: Driver) {
    this.driver = driver;
  }

  public readonly driver: Driver;

  public collection<T>(id: string): CollectionReference<T> {
    return new CollectionReference<T>(this.driver, id);
  }
}
