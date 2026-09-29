import fs from 'fs';
import path from 'path';

async function download(url: string, dest: string) {
  const res = await fetch(url, { headers: { 'User-Agent': 'mtg-downloader/1.0' } });
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buffer);
  console.log(`Saved ${dest} (${buffer.length} bytes)`);
}

async function main() {
  const imgDir = path.join(__dirname, '..', 'public', 'img');
  if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

  await download(
    'https://upload.wikimedia.org/wikipedia/commons/3/3f/Magicthegathering-logo.svg',
    path.join(imgDir, 'magic-logo.svg')
  );

  await download(
    'https://cards.scryfall.io/art_crop/front/d/5/d5806e68-1054-458e-866d-1f2470f682b2.jpg',
    path.join(imgDir, 'sauron-ring.jpg')
  );

  await download(
    'https://cards.scryfall.io/art_crop/front/3/7/374d7383-a1a7-4eea-91f7-290180e14cc9.jpg',
    path.join(imgDir, 'cloud-sword.jpg')
  );

  console.log('All iconic assets downloaded successfully.');
}

main().catch(console.error);
