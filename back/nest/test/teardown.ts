export default async () => {
  //console.log('\n\n==>Teardown<==');
  await globalThis.__prisma__.cleanDb();
  await globalThis.__app__.close();
};
