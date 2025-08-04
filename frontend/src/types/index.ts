// User types
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'manager' | 'user';
}

export interface UpdateUserInput {
  username?: string;
  email?: string;
  role?: 'admin' | 'manager' | 'user';
  is_active?: boolean;
}

// Product types
export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string;
  price: number;
  cost: number;
  category_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductInput {
  name: string;
  sku: string;
  description?: string;
  price: number;
  cost: number;
  category_id: number;
}

export interface UpdateProductInput {
  name?: string;
  sku?: string;
  description?: string;
  price?: number;
  cost?: number;
  category_id?: number;
  is_active?: boolean;
}

// Category types
export interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  parent_id?: number;
}

export interface UpdateCategoryInput {
  name?: string;
  description?: string;
  parent_id?: number;
  is_active?: boolean;
}

// Warehouse types
export interface Warehouse {
  id: number;
  name: string;
  location: string;
  capacity: number;
  manager_id?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateWarehouseInput {
  name: string;
  location: string;
  capacity: number;
  manager_id?: number;
}

export interface UpdateWarehouseInput {
  name?: string;
  location?: string;
  capacity?: number;
  manager_id?: number;
  is_active?: boolean;
}

// Inventory types
export interface Inventory {
  id: number;
  product_id: number;
  warehouse_id: number;
  quantity: number;
  reserved_quantity: number;
  min_threshold: number;
  max_threshold?: number;
  created_at: string;
  updated_at: string;
}

export interface InventoryWithDetails extends Inventory {
  product: Product;
  warehouse: Warehouse;
}

export interface CreateInventoryInput {
  product_id: number;
  warehouse_id: number;
  quantity: number;
  min_threshold?: number;
  max_threshold?: number;
}

export interface UpdateInventoryInput {
  quantity?: number;
  min_threshold?: number;
  max_threshold?: number;
}

// Transaction types
export interface Transaction {
  id: number;
  inventory_id: number;
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
  quantity: number;
  reason: string;
  reference?: string;
  notes?: string;
  created_by: number;
  created_at: string;
}

export interface CreateTransactionInput {
  inventory_id: number;
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
  quantity: number;
  reason: string;
  reference?: string;
  notes?: string;
  source_warehouse_id?: number;
  destination_warehouse_id?: number;
}

// Alert types
export interface Alert {
  id: number;
  type: 'low-stock' | 'out-of-stock' | 'reorder';
  severity: 'critical' | 'warning' | 'info';
  inventory_id: number;
  product_id: number;
  product_name: string;
  warehouse_id: number;
  warehouse_name: string;
  current_quantity: number;
  threshold: number;
  message: string;
  created_at: string;
}

export interface AlertThreshold {
  inventory_id: number;
  low_stock_threshold: number;
  reorder_point: number;
  reorder_quantity: number;
  is_active: boolean;
}

// Dashboard types
export interface DashboardOverview {
  total_products: number;
  total_warehouses: number;
  total_inventory_value: number;
  low_stock_items: number;
  out_of_stock_items: number;
  total_transactions: number;
  pending_alerts: number;
  critical_alerts: number;
  recent_activity: ActivityItem[];
}

export interface ActivityItem {
  id: number;
  type: 'transaction' | 'alert';
  description: string;
  timestamp: string;
  user: string;
}

export interface InventoryAnalytics {
  period: string;
  warehouse_id?: number;
  total_value: number;
  average_value: number;
  value_change: number;
  top_products: TopProduct[];
  category_distribution: CategoryDistribution[];
  stock_levels: StockLevels;
  turnover_rate: number;
  average_lead_time: number;
}

export interface TopProduct {
  product_id: number;
  product_name: string;
  sku: string;
  quantity: number;
  value: number;
  percentage: number;
}

export interface CategoryDistribution {
  category: string;
  value: number;
  percentage: number;
}

export interface StockLevels {
  healthy: number;
  low: number;
  critical: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Authentication types
export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// Query parameters
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  [key: string]: any;
} 