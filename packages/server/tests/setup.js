// packages/server/tests/setup.js

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const logger = require('../src/config/logger');

// Disable logging during tests
logger.transports.forEach((t) => (t.silent = true));

let mongod;

// Function to connect to the in-memory database
const connect = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri;
  process.env.NODE_ENV = 'test';
  
  await mongoose.connect(uri);
};

// Function to clear all collections
const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

// Function to close database connection
const closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

module.exports = {
  connect,
  clearDatabase,
  closeDatabase
};