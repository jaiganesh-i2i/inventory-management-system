import { query, testConnection } from './database';
import { logger } from '../utils/logger';
import fs from 'fs';
import path from 'path';

// Read and execute SQL files
const executeSqlFile = async (filePath: string): Promise<void> => {
  try {
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    await query(sqlContent);
    logger.info(`Executed SQL file: ${filePath}`);
  } catch (error) {
    logger.error(`Error executing SQL file ${filePath}:`, error);
    throw error;
  }
};

// Initialize database schema
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Initialize the database connection pool first
    const { initializeDatabase: initDB } = await import('./database');
    const isConnected = await initDB();
    if (!isConnected) {
      throw new Error('Database connection failed');
    }

    logger.info('Starting database initialization...');

    // Execute migrations in order
    const migrations = [
      '001_initial_schema.sql',
      '002_triggers_and_functions.sql',
      '003_seed_data.sql'
    ];

    for (const migration of migrations) {
      const migrationPath = path.join(__dirname, '../../../database/migrations', migration);
      if (fs.existsSync(migrationPath)) {
        logger.info(`Executing migration: ${migration}`);
        await executeSqlFile(migrationPath);
      } else {
        logger.warn(`Migration file not found: ${migration}`);
      }
    }

    // Execute views
    const viewsPath = path.join(__dirname, '../../../database/views/001_common_views.sql');
    if (fs.existsSync(viewsPath)) {
      await executeSqlFile(viewsPath);
    }

    logger.info('Database initialization completed successfully');
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
};

// Create basic schema if migration file is not available
const createBasicSchema = async (): Promise<void> => {
  const basicSchema = `
    -- Create users table
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user')),
      is_active BOOLEAN DEFAULT true,
      last_login TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Create categories table
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Create products table
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      category_id INTEGER REFERENCES categories(id),
      sku VARCHAR(100) UNIQUE NOT NULL,
      barcode VARCHAR(100),
      specifications JSONB,
      unit_of_measure VARCHAR(50) DEFAULT 'piece',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Create warehouses table
    CREATE TABLE IF NOT EXISTS warehouses (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      address TEXT,
      contact_person VARCHAR(100),
      contact_email VARCHAR(255),
      contact_phone VARCHAR(20),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Create inventory table
    CREATE TABLE IF NOT EXISTS inventory (
      id SERIAL PRIMARY KEY,
      product_id INTEGER REFERENCES products(id),
      warehouse_id INTEGER REFERENCES warehouses(id),
      quantity INTEGER DEFAULT 0,
      min_threshold INTEGER DEFAULT 0,
      max_threshold INTEGER DEFAULT 1000,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(product_id, warehouse_id)
    );

    -- Insert default admin user
    INSERT INTO users (username, email, password_hash, role) 
    VALUES ('admin', 'admin@inventory.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ8KqG', 'admin')
    ON CONFLICT (username) DO NOTHING;

    -- Insert default category
    INSERT INTO categories (name, description) 
    VALUES ('General', 'General category for products')
    ON CONFLICT DO NOTHING;

    -- Insert default warehouse
    INSERT INTO warehouses (name, address) 
    VALUES ('Main Warehouse', '123 Main Street, City, State')
    ON CONFLICT DO NOTHING;
  `;

  await query(basicSchema);
  logger.info('Basic schema created successfully');
};

// Check if database is initialized
export const isDatabaseInitialized = async (): Promise<boolean> => {
  try {
    const result = await query('SELECT COUNT(*) FROM users');
    return parseInt(result.rows[0].count) > 0;
  } catch (error) {
    return false;
  }
};

// Reset database (for development)
export const resetDatabase = async (): Promise<void> => {
  try {
    logger.warn('Resetting database...');
    
    // Drop all tables (in reverse order of dependencies)
    const dropTables = `
      DROP TABLE IF EXISTS inventory CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;
      DROP TABLE IF EXISTS warehouses CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `;
    
    await query(dropTables);
    logger.info('Database reset completed');
    
    // Reinitialize
    await initializeDatabase();
  } catch (error) {
    logger.error('Database reset failed:', error);
    throw error;
  }
}; 