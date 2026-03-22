// Add polyfills for Node.js globals
import fs from 'fs';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== CONFIG =====
const ROOT_FOLDER = path.join(__dirname, 'src');
const TARGET_FOLDER = ROOT_FOLDER;
const OUTPUT_FILE = path.join(ROOT_FOLDER, 'all_code.txt');
// ==================

const TEXT_EXTENSIONS = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.json',
  '.css',
  '.scss',
  '.html',
  '.md',
]);

function normalizeLineEndings(content) {
  return content
    .replace(/\u2028/g, '\n') // Line Separator
    .replace(/\u2029/g, '\n') // Paragraph Separator
    .replace(/\r\n/g, '\n') // Windows → Unix
    .replace(/\r/g, '\n'); // Old Mac
}

function extractFiles(dirPath, outputStream) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      extractFiles(fullPath, outputStream);
      continue;
    }

    const ext = path.extname(entry.name);
    if (!TEXT_EXTENSIONS.has(ext)) continue;

    try {
      let code = fs.readFileSync(fullPath, 'utf8');
      code = normalizeLineEndings(code);

      outputStream.write('\n');
      outputStream.write('='.repeat(70) + '\n');
      outputStream.write(`FILE: ${path.relative(ROOT_FOLDER, fullPath)}\n`);
      outputStream.write('='.repeat(70) + '\n');
      outputStream.write(code + '\n');
    } catch (err) {
      console.error(`❌ Failed to read: ${fullPath}`);
      console.error(err.message);
    }
  }
}

// ===== SAFETY CHECK =====
if (!fs.existsSync(TARGET_FOLDER)) {
  console.error('❌ Target folder does not exist:');
  console.error(TARGET_FOLDER);
  process.exit(1);
}

// ===== START =====
const outputStream = fs.createWriteStream(OUTPUT_FILE, { flags: 'w' });

extractFiles(TARGET_FOLDER, outputStream);

outputStream.end(() => {
  console.log('✅ Code extraction completed!');
  console.log(`📄 Output file created at:\n${OUTPUT_FILE}`);
});
