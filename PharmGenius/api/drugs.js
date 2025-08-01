const express = require('express');
const { container } = require('../db/cosmosClient');
const router = express.Router();

// CREATE
router.post('/', async (req, res) => {
  try {
    const { resource } = await container.items.create(req.body);
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL (with pagination)
router.get('/', async (req, res) => {
  const pageSize = parseInt(req.query.limit) || 20;
  const continuationToken = req.query.continuationToken || undefined;
  try {
    const querySpec = { 
      query: 'SELECT * FROM c',
      parameters: []
    };
    const { resources, continuationToken: nextToken } = await container.items
      .query(querySpec, { maxItemCount: pageSize, continuationToken })
      .fetchNext();
    res.json({ 
      items: resources, 
      continuationToken: nextToken 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE
router.get('/:id', async (req, res) => {
  try {
    const { resource } = await container.item(req.params.id, req.params.id).read();
    if (!resource) return res.status(404).json({ error: 'Not found' });
    res.json(resource);
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
});

// UPDATE
router.put('/:id', async (req, res) => {
  try {
    const { resource } = await container.item(req.params.id, req.params.id)
      .replace({ ...req.body, id: req.params.id });
    res.json(resource);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await container.item(req.params.id, req.params.id).delete();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(404).json({ error: 'Not found' });
  }
});

// SEARCH by name
router.get('/search/:name', async (req, res) => {
  try {
    const querySpec = {
      query: 'SELECT * FROM c WHERE CONTAINS(LOWER(c.name), LOWER(@name))',
      parameters: [{ name: '@name', value: req.params.name }]
    };
    const { resources } = await container.items.query(querySpec).fetchAll();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
