import { CosmosClient } from '@azure/cosmos';
import fs from 'fs';
import Papa from 'papaparse';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateToCosmos() {
  // Initialize Cosmos DB client
  const client = new CosmosClient({
    endpoint: process.env.COSMOS_DB_ENDPOINT,
    key: process.env.COSMOS_DB_KEY
  });

  const database = client.database(process.env.COSMOS_DB_DATABASE);
  const container = database.container(process.env.COSMOS_DB_CONTAINER);

  // Read CSV file
  const drugDbPath = path.join(__dirname, 'UAE drug list.csv');
  const csvData = fs.readFileSync(drugDbPath, 'utf8').replace(/^\uFEFF/, ''); // Remove BOM if present

  // Parse CSV
  const parsed = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true,
  });

  if (parsed.errors.length > 0) {
    console.error('Error parsing CSV:', parsed.errors);
    return;
  }

  // Prepare data for Cosmos DB
  const drugs = parsed.data
    .filter(drug => drug['Package Name'])
    .map((drug, index) => ({
      id: (index + 1).toString(),
      ...drug
    }));

  // Batch insert into Cosmos DB
  console.log(`Migrating ${drugs.length} drugs to Cosmos DB...`);
  
  for (const drug of drugs) {
    try {
      await container.items.create(drug);
      console.log(`Migrated drug: ${drug['Package Name']}`);
    } catch (error) {
      console.error(`Error migrating drug ${drug['Package Name']}:`, error.message);
    }
  }

  console.log('Migration complete!');
}

migrateToCosmos().catch(console.error);
