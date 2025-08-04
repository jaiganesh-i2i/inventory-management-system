import { Pool, PoolClient } from 'pg';
import { logger } from '../utils/logger';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'inventory_management',
  user: process.env.DB_USER || 'inventory_user',
  password: process.env.DB_PASSWORD || 'inventory_pass',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
};

// Create connection pool
let pool: Pool | null = null;

// Initialize database connection
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    // Try to connect to PostgreSQL
    pool = new Pool(dbConfig);
    
    // Test the connection
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    
    logger.info('✅ PostgreSQL database connected successfully');
    return true;
  } catch (error) {
    logger.error('❌ PostgreSQL connection failed:', error);
    return false;
  }
};

// Get database connection
export const getConnection = async (): Promise<PoolClient> => {
  if (!pool) {
    throw new Error('Database not initialized');
  }
  return await pool.connect();
};

// Get database client (alias for getConnection)
export const getClient = async (): Promise<PoolClient> => {
  return await getConnection();
};

// Test database connection
export const testConnection = async (): Promise<boolean> => {
  try {
    if (pool) {
      const client = await pool.connect();
      await client.query('SELECT NOW()');
      client.release();
      return true;
    }
    return false;
  } catch (error) {
    logger.error('Database connection test failed:', error);
    return false;
  }
};

// Close database connection
export const closePool = async (): Promise<void> => {
  if (pool) {
    await pool.end();
  }
};

// Export pool for direct access
export { pool };

// Export query function for compatibility
export const query = async (text: string, params?: any[]) => {
  if (!pool) {
    throw new Error('Database not initialized');
  }
  return await pool.query(text, params);
}; 