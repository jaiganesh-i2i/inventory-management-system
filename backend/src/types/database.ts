// Database Types and Interfaces
// Based on the database schema design

export interface User {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'manager' | 'user';
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Supplier {
  id: number;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  contact_info?: Record<string, any>;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Warehouse {
  id: number;
  name: string;
  location?: string;
  address?: string;
  capacity?: number;
  manager_id?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  category_id?: number;
  sku: string;
  barcode?: string;
  specifications?: Record<string, any>;
  unit_of_measure: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Inventory {
  id: number;
  product_id: number;
  warehouse_id: number;
  quantity: number;
  min_threshold: number;
  max_threshold?: number;
  reserved_quantity: number;
  created_at: Date;
  updated_at: Date;
}

export interface PurchaseOrder {
  id: number;
  order_number: string;
  supplier_id: number;
  status: 'pending' | 'approved' | 'ordered' | 'received' | 'cancelled';
  total_amount: number;
  order_date: Date;
  expected_delivery_date?: Date;
  actual_delivery_date?: Date;
  notes?: string;
  created_by?: number;
  created_at: Date;
  updated_at: Date;
}

export interface PurchaseOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  received_quantity: number;
  created_at: Date;
}

export interface InventoryTransaction {
  id: number;
  product_id: number;
  warehouse_id: number;
  transaction_type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  reference_type?: 'purchase_order' | 'transfer' | 'adjustment' | 'manual';
  reference_id?: number;
  notes?: string;
  created_by?: number;
  created_at: Date;
}

export interface InventoryTransfer {
  id: number;
  transfer_number: string;
  product_id: number;
  from_warehouse_id: number;
  to_warehouse_id: number;
  quantity: number;
  status: 'pending' | 'in_transit' | 'completed' | 'cancelled';
  transfer_date: Date;
  expected_arrival_date?: Date;
  actual_arrival_date?: Date;
  notes?: string;
  created_by?: number;
  created_at: Date;
  updated_at: Date;
}

export interface StockAlert {
  id: number;
  product_id: number;
  warehouse_id: number;
  alert_type: 'low_stock' | 'out_of_stock' | 'overstock' | 'expiry';
  message: string;
  is_acknowledged: boolean;
  acknowledged_by?: number;
  acknowledged_at?: Date;
  created_at: Date;
}

export interface AuditLog {
  id: number;
  user_id?: number;
  action: string;
  table_name: string;
  record_id?: number;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

export interface InventoryReport {
  id: number;
  report_date: Date;
  total_products: number;
  total_items: number;
  total_value: number;
  low_stock_items: number;
  out_of_stock_items: number;
  created_at: Date;
}

export interface TurnoverReport {
  id: number;
  product_id: number;
  period_start: Date;
  period_end: Date;
  beginning_quantity: number;
  ending_quantity: number;
  total_in: number;
  total_out: number;
  turnover_rate?: number;
  created_at: Date;
}

// Extended interfaces with related data
export interface ProductWithCategory extends Product {
  category?: Category;
}

export interface ProductWithInventory extends Product {
  inventory?: Inventory[];
}

export interface InventoryWithDetails extends Inventory {
  product?: Product;
  warehouse?: Warehouse;
}

export interface PurchaseOrderWithItems extends PurchaseOrder {
  items?: PurchaseOrderItem[];
  supplier?: Supplier;
}

export interface PurchaseOrderItemWithProduct extends PurchaseOrderItem {
  product?: Product;
}

export interface InventoryTransactionWithDetails extends InventoryTransaction {
  product?: Product;
  warehouse?: Warehouse;
}

export interface StockAlertWithDetails extends StockAlert {
  product?: Product;
  warehouse?: Warehouse;
}

// Input types for creating/updating records
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

export interface CreateProductInput {
  name: string;
  description?: string;
  category_id?: number;
  sku: string;
  barcode?: string;
  specifications?: Record<string, any>;
  unit_of_measure?: string;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  category_id?: number;
  sku?: string;
  barcode?: string;
  specifications?: Record<string, any>;
  unit_of_measure?: string;
  is_active?: boolean;
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
  reserved_quantity?: number;
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

export interface CreateWarehouseInput {
  name: string;
  location?: string;
  address?: string;
  capacity?: number;
  manager_id?: number;
}

export interface UpdateWarehouseInput {
  name?: string;
  location?: string;
  address?: string;
  capacity?: number;
  manager_id?: number;
  is_active?: boolean;
}

export interface CreatePurchaseOrderInput {
  supplier_id: number;
  order_number: string;
  expected_delivery_date?: Date;
  notes?: string;
  items: CreatePurchaseOrderItemInput[];
}

export interface CreatePurchaseOrderItemInput {
  product_id: number;
  quantity: number;
  unit_price: number;
}

export interface CreateInventoryTransactionInput {
  product_id: number;
  warehouse_id: number;
  transaction_type: 'in' | 'out' | 'adjustment' | 'transfer';
  quantity: number;
  reference_type?: 'purchase_order' | 'transfer' | 'adjustment' | 'manual';
  reference_id?: number;
  notes?: string;
}

// Query types
export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  category_id?: number;
  warehouse_id?: number;
  supplier_id?: number;
  product_id?: number;
  parent_id?: number;
  manager_id?: number;
  role?: string;
  status?: string;
  is_active?: boolean;
  date_from?: Date;
  date_to?: Date;
}

export interface QueryParams extends PaginationParams, SortParams, FilterParams {}

// Response types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
  details?: Record<string, any>;
} 