import * as fst from 'fs';
import * as path from 'path';

const fs = fst.promises;
const sourcePath = path.join(__dirname, 'dist-json');
const distPath = path.join(__dirname, 'merge.json');

async function main(): Promise<void> {
  const files = await fs.readdir(sourcePath);
  const items = [];

  for (const file of files) {
    const inputFilePath = path.join(sourcePath, file);

    const content = await fs.readFile(inputFilePath, 'utf-8');

    const json: [] = JSON.parse(content);

    items.push(...json);
  }

  await fs.writeFile(distPath, JSON.stringify(items, null, 2));
}

main().then(
  () => console.log('success')
).catch(
  (err) => console.log('failure', err)
);
