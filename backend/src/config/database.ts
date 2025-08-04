import { Pool, PoolClient } from 'pg';
import { logger } from '../utils/logger';

// Database configuration with Railway support
const getDbConfig = () => {
  // Check if we're on Railway (has DATABASE_URL)
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    return {
      host: url.hostname,
      port: parseInt(url.port || '5432'),
      database: url.pathname.slice(1), // Remove leading slash
      user: url.username,
      password: url.password,
      ssl: { rejectUnauthorized: false }, // Railway requires SSL
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    };
  }
  
  // Standard configuration
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'inventory_management',
    user: process.env.DB_USER || 'inventory_user',
    password: process.env.DB_PASSWORD || 'inventory_pass',
    ssl: false, // Disable SSL for local Docker development
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
};

const dbConfig = getDbConfig();

// Create connection pool
let pool: Pool | null = null;

// Initialize database connection
export const initializeDatabase = async (): Promise<boolean> => {
  try {
    logger.info('🔧 Database Configuration:', {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user,
      ssl: !!dbConfig.ssl,
      hasDatabaseUrl: !!process.env.DATABASE_URL
    });
    
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