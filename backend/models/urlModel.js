const fs = require('fs');
const path = require('path');
const { URL_CONFIG } = require('../constants');

const DATA_FILE = path.join(__dirname, '../data/urls.json');

function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
  }

  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function sanitizeUrl(value) {
  if (!value) return value;
  if (!/^https?:\/\//i.test(value)) {
    return `https://${value}`;
  }
  return value;
}

function validateUrl(value) {
  try {
    const urlObj = new URL(value);
    return URL_CONFIG.ALLOWED_PROTOCOLS.includes(urlObj.protocol);
  } catch {
    return false;
  }
}

function createUrlDocument(payload) {
  const originalUrl = sanitizeUrl(payload.originalUrl);
  if (!validateUrl(originalUrl)) {
    throw new Error('Please provide a valid URL with http or https protocol');
  }

  return {
    id: payload.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    originalUrl,
    shortUrl: payload.shortUrl,
    clicks: 0,
    expirationDate: payload.expirationDate || null,
    isActive: true,
    createdBy: 'anonymous',
    lastAccessedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function findOne(query = {}) {
  const data = readData();
  return Promise.resolve(data.find((item) => {
    if (query.shortUrl) return item.shortUrl === query.shortUrl;
    if (query.originalUrl) return item.originalUrl === query.originalUrl && item.isActive;
    return false;
  }) || null);
}

function findOneAndDelete(query = {}) {
  const data = readData();
  const index = data.findIndex((item) => item.shortUrl === query.shortUrl);
  if (index === -1) return Promise.resolve(null);
  const [deleted] = data.splice(index, 1);
  writeData(data);
  return Promise.resolve(deleted);
}

function find(filter = {}) {
  const data = readData();
  let result = data;

  if (filter.isActive !== undefined) {
    result = result.filter((item) => item.isActive === filter.isActive);
  }

  if (filter.$or) {
    result = result.filter((item) => {
      return filter.$or.some((criterion) => {
        if (criterion.originalUrl && criterion.originalUrl.$regex) {
          return item.originalUrl.toLowerCase().includes(criterion.originalUrl.$regex.toLowerCase());
        }
        if (criterion.shortUrl && criterion.shortUrl.$regex) {
          return item.shortUrl.toLowerCase().includes(criterion.shortUrl.$regex.toLowerCase());
        }
        return false;
      });
    });
  }

  return Promise.resolve(result);
}

function countDocuments(query = {}) {
  const data = readData();
  let filtered = data;

  if (query.isActive !== undefined) {
    filtered = filtered.filter((item) => item.isActive === query.isActive);
  }

  if (query.expirationDate) {
    const now = new Date();
    filtered = filtered.filter((item) => {
      if (!item.expirationDate) return true;
      return new Date(item.expirationDate) < now;
    });
  }

  if (query.createdAt) {
    filtered = filtered.filter((item) => new Date(item.createdAt) >= query.createdAt.$gte);
  }

  return Promise.resolve(filtered.length);
}

function updateMany(filter = {}, update = {}) {
  const data = readData();
  const updated = data.map((item) => {
    const shouldUpdate = filter.expirationDate && filter.expirationDate.$lt && item.expirationDate && new Date(item.expirationDate) < new Date(filter.expirationDate.$lt);
    if (shouldUpdate) {
      return { ...item, ...update.$set };
    }
    return item;
  });
  writeData(updated);
  return Promise.resolve({ modifiedCount: updated.filter((item) => item.isActive === false).length });
}

function aggregate() {
  const data = readData();
  const totalClicks = data.reduce((sum, item) => sum + (item.clicks || 0), 0);
  return Promise.resolve([{ total: totalClicks }]);
}

function save(doc) {
  const data = readData();
  data.push(doc);
  writeData(data);
  return Promise.resolve(doc);
}

function findActive() {
  const data = readData();
  return Promise.resolve(data.filter((item) => item.isActive));
}

const model = {
  findOne,
  findOneAndDelete,
  find,
  countDocuments,
  updateMany,
  aggregate,
  findActive,
  save,
  create: save,
  createDocument: createUrlDocument,
};

module.exports = model;
