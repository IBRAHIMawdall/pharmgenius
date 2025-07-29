import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const drugDbPath = path.join(__dirname, '..', 'database', 'database', 'UAE drug list.csv');
console.log('Database path:', drugDbPath);
console.log('File exists:', fs.existsSync(drugDbPath));

try {
  const csvData = fs.readFileSync(drugDbPath, 'utf8');
  console.log('File size:', csvData.length);
  console.log('First 200 characters:', csvData.substring(0, 200));
} catch (error) {
  console.error('Error:', error.message);
}