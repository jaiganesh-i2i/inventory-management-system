import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type {
  ApiResponse,
  PaginatedResponse,
  User,
  Product,
  Category,
  Warehouse,
  Inventory,
  InventoryWithDetails,
  Transaction,
  Alert,
  AlertThreshold,
  DashboardOverview,
  InventoryAnalytics,
  LoginCredentials,
  AuthResponse,
  CreateUserInput,
  UpdateUserInput,
  CreateProductInput,
  UpdateProductInput,
  CreateCategoryInput,
  UpdateCategoryInput,
  CreateWarehouseInput,
  UpdateWarehouseInput,
  CreateInventoryInput,
  UpdateInventoryInput,
  CreateTransactionInput,
  QueryParams
} from '../types/index';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken);
              const { access_token } = response.data?.tokens || {};
              
              if (access_token) {
                localStorage.setItem('access_token', access_token);
              }
              originalRequest.headers.Authorization = `Bearer ${access_token}`;
              
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Refresh token failed, redirect to login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Authentication endpoints
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await this.api.post('/api/v1/auth/login', credentials);
    return response.data;
  }

  async register(userData: CreateUserInput): Promise<ApiResponse<AuthResponse>> {
    const response: AxiosResponse<ApiResponse<AuthResponse>> = await this.api.post('/api/v1/auth/register', userData);
    return response.data;
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ tokens: { access_token: string; refresh_token: string; expires_in: number } }>> {
    const response: AxiosResponse<ApiResponse<{ tokens: { access_token: string; refresh_token: string; expires_in: number } }>> = await this.api.post('/api/v1/auth/refresh', { refreshToken });
    return response.data;
  }

  async logout(): Promise<ApiResponse<null>> {
    const response: AxiosResponse<ApiResponse<null>> = await this.api.post('/api/v1/auth/logout');
    return response.data;
  }

  async getProfile(): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.get('/api/v1/auth/me');
    return response.data;
  }

  // User endpoints
  async getUsers(params?: QueryParams): Promise<ApiResponse<PaginatedResponse<User>>> {
    const response: AxiosResponse<ApiResponse<PaginatedResponse<User>>> = await this.api.get('/api/v1/users', { params });
    return response.data;
  }

  async getUser(id: number): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.get(`/api/v1/users/${id}`);
    return response.data;
  }

  async createUser(userData: CreateUserInput): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.post('/api/v1/users', userData);
    return response.data;
  }

  async updateUser(id: number, userData: UpdateUserInput): Promise<ApiResponse<User>> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.put(`/api/v1/users/${id}`, userData);
    return response.data;
  }

  async deleteUser(id: number): Promise<ApiResponse<null>> {
    const response: AxiosResponse<ApiResponse<null>> = await this.api.delete(`/api/v1/users/${id}`);
    return response.data;
  }

  // Product endpoints
  async getProducts(params?: QueryParams): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const response: AxiosResponse<ApiResponse<PaginatedResponse<Product>>> = await this.api.get('/api/v1/products', { params });
    return response.data;
  }

  async getProduct(id: number): Promise<ApiResponse<Product>> {
    const response: AxiosResponse<ApiResponse<Product>> = await this.api.get(`/api/v1/products/${id}`);
    return response.data;
  }

  async createProduct(productData: CreateProductInput): Promise<ApiResponse<Product>> {
    const response: AxiosResponse<ApiResponse<Product>> = await this.api.post('/api/v1/products', productData);
    return response.data;
  }

  async updateProduct(id: number, productData: UpdateProductInput): Promise<ApiResponse<Product>> {
    const response: AxiosResponse<ApiResponse<Product>> = await this.api.put(`/api/v1/products/${id}`, productData);
    return response.data;
  }

  async deleteProduct(id: number): Promise<ApiResponse<null>> {
    const response: AxiosResponse<ApiResponse<null>> = await this.api.delete(`/api/v1/products/${id}`);
    return response.data;
  }

  // Category endpoints
  async getCategories(params?: QueryParams): Promise<ApiResponse<PaginatedResponse<Category>>> {
    const response: AxiosResponse<ApiResponse<PaginatedResponse<Category>>> = await this.api.get('/api/v1/categories', { params });
    return response.data;
  }

  async getCategory(id: number): Promise<ApiResponse<Category>> {
    const response: AxiosResponse<ApiResponse<Category>> = await this.api.get(`/api/v1/categories/${id}`);
    return response.data;
  }

  async createCategory(categoryData: CreateCategoryInput): Promise<ApiResponse<Category>> {
    const response: AxiosResponse<ApiResponse<Category>> = await this.api.post('/api/v1/categories', categoryData);
    return response.data;
  }

  async updateCategory(id: number, categoryData: UpdateCategoryInput): Promise<ApiResponse<Category>> {
    const response: AxiosResponse<ApiResponse<Category>> = await this.api.put(`/api/v1/categories/${id}`, categoryData);
    return response.data;
  }

  async deleteCategory(id: number): Promise<ApiResponse<null>> {
    const response: AxiosResponse<ApiResponse<null>> = await this.api.delete(`/api/v1/categories/${id}`);
    return response.data;
  }

  // Warehouse endpoints
  async getWarehouses(params?: QueryParams): Promise<ApiResponse<PaginatedResponse<Warehouse>>> {
    const response: AxiosResponse<ApiResponse<PaginatedResponse<Warehouse>>> = await this.api.get('/api/v1/warehouses', { params });
    return response.data;
  }

  async getWarehouse(id: number): Promise<ApiResponse<Warehouse>> {
    const response: AxiosResponse<ApiResponse<Warehouse>> = await this.api.get(`/api/v1/warehouses/${id}`);
    return response.data;
  }

  async createWarehouse(warehouseData: CreateWarehouseInput): Promise<ApiResponse<Warehouse>> {
    const response: AxiosResponse<ApiResponse<Warehouse>> = await this.api.post('/api/v1/warehouses', warehouseData);
    return response.data;
  }

  async updateWarehouse(id: number, warehouseData: UpdateWarehouseInput): Promise<ApiResponse<Warehouse>> {
    const response: AxiosResponse<ApiResponse<Warehouse>> = await this.api.put(`/api/v1/warehouses/${id}`, warehouseData);
    return response.data;
  }

  async deleteWarehouse(id: number): Promise<ApiResponse<null>> {
    const response: AxiosResponse<ApiResponse<null>> = await this.api.delete(`/api/v1/warehouses/${id}`);
    return response.data;
  }

  // Inventory endpoints
  async getInventory(params?: QueryParams): Promise<ApiResponse<PaginatedResponse<InventoryWithDetails>>> {
    const response: AxiosResponse<ApiResponse<PaginatedResponse<InventoryWithDetails>>> = await this.api.get('/api/v1/inventory', { params });
    return response.data;
  }

  async getInventoryItem(id: number): Promise<ApiResponse<InventoryWithDetails>> {
    const response: AxiosResponse<ApiResponse<InventoryWithDetails>> = await this.api.get(`/api/v1/inventory/${id}`);
    return response.data;
  }

  async createInventory(inventoryData: CreateInventoryInput): Promise<ApiResponse<Inventory>> {
    const response: AxiosResponse<ApiResponse<Inventory>> = await this.api.post('/api/v1/inventory', inventoryData);
    return response.data;
  }

  async updateInventory(id: number, inventoryData: UpdateInventoryInput): Promise<ApiResponse<Inventory>> {
    const response: AxiosResponse<ApiResponse<Inventory>> = await this.api.put(`/api/v1/inventory/${id}`, inventoryData);
    return response.data;
  }

  async deleteInventory(id: number): Promise<ApiResponse<null>> {
    const response: AxiosResponse<ApiResponse<null>> = await this.api.delete(`/api/v1/inventory/${id}`);
    return response.data;
  }

  // Transaction endpoints
  async createTransaction(transactionData: CreateTransactionInput): Promise<ApiResponse<{ transaction: Transaction; inventory: Inventory }>> {
    const response: AxiosResponse<ApiResponse<{ transaction: Transaction; inventory: Inventory }>> = await this.api.post('/api/v1/transactions', transactionData);
    return response.data;
  }

  async getInventoryTransactions(inventoryId: number): Promise<ApiResponse<{ inventory: Inventory; transactions: Transaction[]; total_transactions: number }>> {
    const response: AxiosResponse<ApiResponse<{ inventory: Inventory; transactions: Transaction[]; total_transactions: number }>> = await this.api.get(`/api/v1/transactions/inventory/${inventoryId}`);
    return response.data;
  }

  async getWarehouseTransactions(warehouseId: number): Promise<ApiResponse<{ warehouse_id: number; transactions: Transaction[]; total_transactions: number }>> {
    const response: AxiosResponse<ApiResponse<{ warehouse_id: number; transactions: Transaction[]; total_transactions: number }>> = await this.api.get(`/api/v1/transactions/warehouse/${warehouseId}`);
    return response.data;
  }

  // Alert endpoints
  async getAlerts(params?: QueryParams): Promise<ApiResponse<{ alerts: Alert[]; total_alerts: number; summary: { critical: number; warning: number; info: number } }>> {
    const response: AxiosResponse<ApiResponse<{ alerts: Alert[]; total_alerts: number; summary: { critical: number; warning: number; info: number } }>> = await this.api.get('/api/v1/alerts', { params });
    return response.data;
  }

  async acknowledgeAlert(alertId: number, notes?: string): Promise<ApiResponse<{ alert_id: number; acknowledged_by: number; acknowledged_at: string; notes: string | null }>> {
    const response: AxiosResponse<ApiResponse<{ alert_id: number; acknowledged_by: number; acknowledged_at: string; notes: string | null }>> = await this.api.post(`/api/v1/alerts/${alertId}/acknowledge`, { notes });
    return response.data;
  }

  // Dashboard endpoints
  async getDashboardOverview(): Promise<ApiResponse<DashboardOverview>> {
    const response: AxiosResponse<ApiResponse<DashboardOverview>> = await this.api.get('/api/v1/dashboard/overview');
    return response.data;
  }

  async getInventoryAnalytics(params?: QueryParams): Promise<ApiResponse<InventoryAnalytics>> {
    const response: AxiosResponse<ApiResponse<InventoryAnalytics>> = await this.api.get('/api/v1/dashboard/inventory-analytics', { params });
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ message: string; timestamp: string; environment: string; database: string }>> {
    const response: AxiosResponse<ApiResponse<{ message: string; timestamp: string; environment: string; database: string }>> = await this.api.get('/health');
    return response.data;
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService; 