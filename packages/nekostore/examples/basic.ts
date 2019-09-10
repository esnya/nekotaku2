import Nekostore from '../src/Nekostore';
import BasicDriver from '../src/drivers/BasicDriver';

interface Data1 {
  foo: string;
}

async function main(): Promise<void> {
  const driver = new BasicDriver();
  const store = new Nekostore(driver);

  const c1 = store.collection<Data1>('c1');
  const d1 = await c1.add({ foo: 'bar' });

  const value = await d1.get();
  console.log('[get]', JSON.stringify(value.data));

  const unsubscribe1 = await c1.onSnapshot(snapshot =>
    console.log(
      '[c1]',
      snapshot[0].id,
      snapshot[0].type,
      JSON.stringify(snapshot[0].data),
    ),
  );
  const unsubscribe2 = await d1.onSnapshot(snapshot =>
    console.log('[d1]', JSON.stringify(snapshot.data)),
  );

  await d1.update({ foo: 'foobar' });
  await c1.add({ foo: 'hoge' });
  await d1.delete();

  unsubscribe1();
  unsubscribe2();
}
main().catch(error => {
  console.error(error);
  process.exit(1);
});
