import { Pool, PoolClient } from 'pg';
import { logger } from '../utils/logger';

// Railway-specific database configuration
const getRailwayDbConfig = () => {
  // Railway provides these environment variables
  const railwayUrl = process.env.DATABASE_URL;
  
  if (railwayUrl) {
    // Parse Railway's DATABASE_URL
    const url = new URL(railwayUrl);
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
  
  // Fallback to standard environment variables
  return {
    host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
    port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432'),
    database: process.env.DB_NAME || process.env.PGDATABASE || 'inventory_management',
    user: process.env.DB_USER || process.env.PGUSER || 'inventory_user',
    password: process.env.DB_PASSWORD || process.env.PGPASSWORD || 'inventory_pass',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
};

// Create connection pool
let pool: Pool | null = null;

// Initialize database connection for Railway
export const initializeRailwayDatabase = async (): Promise<boolean> => {
  try {
    const dbConfig = getRailwayDbConfig();
    
    logger.info('🔧 Railway Database Configuration:', {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user,
      ssl: !!dbConfig.ssl
    });
    
    // Try to connect to PostgreSQL
    pool = new Pool(dbConfig);
    
    // Test the connection
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();
    
    logger.info('✅ Railway PostgreSQL database connected successfully');
    return true;
  } catch (error) {
    logger.error('❌ Railway PostgreSQL connection failed:', error);
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