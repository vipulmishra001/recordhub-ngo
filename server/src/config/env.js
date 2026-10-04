const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file (server directory or root)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const config = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ngo_records_db',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_fallback_key_32_characters_long',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 10,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@ngo.org',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'AdminPass123!'
};

// Check critical configuration in production
if (config.NODE_ENV === 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('FATAL: JWT_SECRET must be set and at least 32 characters in production.');
  }
  if (!process.env.MONGODB_URI) {
    throw new Error('FATAL: MONGODB_URI must be provided in production.');
  }
  if (process.env.MONGODB_URI.includes('127.0.0.1') || process.env.MONGODB_URI.includes('localhost')) {
    throw new Error('FATAL: Production MONGODB_URI cannot point to localhost or 127.0.0.1. Please configure your remote MongoDB Atlas connection string.');
  }
}

module.exports = config;
