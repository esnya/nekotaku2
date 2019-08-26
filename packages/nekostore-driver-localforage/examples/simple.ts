import localforage from 'localforage';
import * as memoryDriver from 'localforage-driver-memory';
import { EventEmitter } from 'events';
import Nekostore from 'nekostore/lib/Nekostore';
import LocalForageDriver from '..';

interface Foo {
  a: boolean;
  b: string;
}

async function main(): Promise<void> {
  await localforage.defineDriver(memoryDriver);
  await localforage.setDriver(memoryDriver._driver);

  localforage.config({
    driver: memoryDriver._driver,
  });

  const eventBus = new EventEmitter();
  const driver = new LocalForageDriver(localforage, eventBus);
  const nekostore = new Nekostore(driver);

  const c1 = nekostore.collection<Foo>('c1');
  const unsubscribeC1 = await c1.onSnapshot(snapshot => {
    console.log('c1 snapshot', snapshot);
  });

  const d1 = await c1.add({
    a: true,
    b: 'foo',
  });
  console.log(await d1.get());

  const unsubscribeD1 = await d1.onSnapshot(snapshot => {
    console.log('d1 snapshot', snapshot);
  });

  await d1.update({ b: 'bar' });
  console.log(await d1.get());

  await d1.delete();
  console.log(await d1.get());

  await unsubscribeD1();
  await unsubscribeC1();
}
main().catch((e: Error) => {
  console.error(e.stack || e);
});
