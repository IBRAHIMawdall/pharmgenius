# PharmGenius Deployment Environment Setup

## Required Environment Variables

### Azure Cosmos DB Configuration
```bash
COSMOS_DB_ENDPOINT=your_azure_cosmos_db_endpoint_here
COSMOS_DB_KEY=your_azure_cosmos_db_key_here
COSMOS_DB_DATABASE=pharmgenius
COSMOS_DB_CONTAINER=drugs
```

### Application Configuration
```bash
NODE_ENV=production
PORT=5000
```

## Render.com Deployment

The `render.yaml` file is already configured with the proper environment variables. You need to:

1. **Set the Cosmos DB credentials in Render dashboard:**
   - Go to your service in Render dashboard
   - Navigate to Environment section
   - Set the following variables:
     - `COSMOS_DB_ENDPOINT` = Your Azure Cosmos DB endpoint
     - `COSMOS_DB_KEY` = Your Azure Cosmos DB key

2. **The following variables are already set:**
   - `COSMOS_DB_DATABASE` = pharmgenius
   - `COSMOS_DB_CONTAINER` = drugs
   - `NODE_ENV` = production
   - `PORT` = 5000

## Local Development

For local development, create a `.env` file in the root directory with:

```bash
NODE_ENV=development
PORT=5000
COSMOS_DB_ENDPOINT=your_local_or_dev_endpoint
COSMOS_DB_KEY=your_local_or_dev_key
COSMOS_DB_DATABASE=pharmgenius
COSMOS_DB_CONTAINER=drugs
```

## Azure Cosmos DB Setup

1. Create a Cosmos DB account in Azure
2. Create a database named `pharmgenius`
3. Create a container named `drugs`
4. Get the endpoint and key from the Azure portal
5. Configure the environment variables in Render

## Current Status

✅ `render.yaml` configured
✅ Environment variables documented
✅ Build and start commands set
✅ Port configuration set to 5000 