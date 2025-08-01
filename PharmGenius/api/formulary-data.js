import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'daman-formulary.json');
    const data = fs.readFileSync(filePath, 'utf8');
    
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Failed to load formulary data' });
  }
}