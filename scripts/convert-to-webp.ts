/**
 * scripts/convert-to-webp.ts
 * ──────────────────────────
 * Converte todas as imagens PNG/JPG/JPEG do diretório public/ para WebP de alta qualidade.
 * Mantém o arquivo original intacto e gera o .webp ao lado.
 * Uso: npx tsx scripts/convert-to-webp.ts
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const WEBP_QUALITY = 88; // alta qualidade (80–90 é o ponto ideal qualidade/tamanho)
const DIRS_TO_SCAN = [
  path.join(ROOT, 'public'),
  path.join(ROOT, 'src', 'assets'),
];

const EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);

async function scanDir(dir: string): Promise<string[]> {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;

  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await scanDir(full));
    } else if (entry.isFile() && EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

async function convertFile(inputPath: string): Promise<void> {
  const ext = path.extname(inputPath).toLowerCase();
  const webpPath = inputPath.replace(new RegExp(`\\${ext}$`, 'i'), '.webp');

  // Pular se já existe um .webp mais recente
  if (fs.existsSync(webpPath)) {
    const srcStat = await fs.promises.stat(inputPath);
    const dstStat = await fs.promises.stat(webpPath);
    if (dstStat.mtimeMs >= srcStat.mtimeMs) {
      console.log(`  ⏭  Skip (já existe): ${path.relative(ROOT, webpPath)}`);
      return;
    }
  }

  const before = (await fs.promises.stat(inputPath)).size;

  await sharp(inputPath)
    .webp({ quality: WEBP_QUALITY, effort: 5 })
    .toFile(webpPath);

  const after = (await fs.promises.stat(webpPath)).size;
  const saved = (((before - after) / before) * 100).toFixed(1);
  const status = before > after ? `↓ ${saved}% menor` : `↑ maior (original mantido)`;

  console.log(`  ✅ ${path.relative(ROOT, webpPath)}  [${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB  ${status}]`);
}

async function main() {
  console.log('\n🖼  Essence Pharma — Conversor WebP de Alta Qualidade\n');

  const allFiles: string[] = [];
  for (const dir of DIRS_TO_SCAN) {
    const found = await scanDir(dir);
    allFiles.push(...found);
  }

  if (allFiles.length === 0) {
    console.log('Nenhuma imagem PNG/JPG encontrada.');
    return;
  }

  console.log(`Encontradas ${allFiles.length} imagem(ns) para converter:\n`);

  let converted = 0;
  let skipped = 0;

  for (const file of allFiles) {
    try {
      const before = fs.existsSync(
        file.replace(new RegExp(`\\${path.extname(file)}$`, 'i'), '.webp')
      );
      await convertFile(file);
      before ? skipped++ : converted++;
    } catch (err: any) {
      console.error(`  ❌ Erro ao converter ${path.relative(ROOT, file)}: ${err.message}`);
    }
  }

  console.log(`\n✨ Concluído! ${converted} convertida(s), ${skipped} pulada(s) (já existiam).\n`);
}

main().catch(console.error);
