# API Specification Document

## 1. API Overview

### 1.1 Base URL
```
Development: http://localhost:5000/api
Production: https://your-backend.railway.app/api
```

### 1.2 Authentication
- **Method**: JWT Bearer Token
- **Header**: `Authorization: Bearer <token>`
- **Token Expiry**: 24 hours
- **Refresh Token**: Available for token renewal

### 1.3 Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2024-12-19T10:30:00Z"
}
```

### 1.4 Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": []
  },
  "timestamp": "2024-12-19T10:30:00Z"
}
```

### 1.5 Pagination Format
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 2. Authentication Endpoints

### 2.1 User Authentication

#### **POST /auth/login**
**Description**: Authenticate user and return JWT token

**Request Body**:
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@inventory.com",
      "role": "admin"
    }
  }
}
```

#### **POST /auth/refresh**
**Description**: Refresh JWT token

**Request Body**:
```json
{
  "refreshToken": "refresh_token_here"
}
```

#### **POST /auth/logout**
**Description**: Logout user and invalidate token

**Headers**: `Authorization: Bearer <token>`

## 3. User Management Endpoints

### 3.1 Users CRUD

#### **GET /users**
**Description**: Get all users with pagination

**Query Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search by username or email
- `role` (string): Filter by role
- `is_active` (boolean): Filter by active status

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@inventory.com",
      "role": "admin",
      "is_active": true,
      "last_login": "2024-12-19T10:30:00Z",
      "created_at": "2024-12-19T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

#### **POST /users**
**Description**: Create new user

**Request Body**:
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

#### **GET /users/:id**
**Description**: Get user by ID

#### **PUT /users/:id**
**Description**: Update user

**Request Body**:
```json
{
  "username": "updateduser",
  "email": "updated@example.com",
  "role": "manager",
  "is_active": true
}
```

#### **DELETE /users/:id**
**Description**: Delete user (soft delete)

## 4. Product Management Endpoints

### 4.1 Products CRUD

#### **GET /products**
**Description**: Get all products with filtering and pagination

**Query Parameters**:
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search by name or SKU
- `category_id` (number): Filter by category
- `is_active` (boolean): Filter by active status
- `sort_by` (string): Sort field (name, sku, created_at)
- `sort_order` (string): Sort order (asc, desc)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Laptop",
      "description": "High-performance laptop",
      "sku": "LAP001",
      "barcode": "123456789",
      "category": {
        "id": 1,
        "name": "Electronics"
      },
      "specifications": {
        "brand": "Dell",
        "model": "XPS 13"
      },
      "unit_of_measure": "piece",
      "is_active": true,
      "created_at": "2024-12-19T10:30:00Z"
    }
  ]
}
```

#### **POST /products**
**Description**: Create new product

**Request Body**:
```json
{
  "name": "New Product",
  "description": "Product description",
  "category_id": 1,
  "sku": "PROD001",
  "barcode": "987654321",
  "specifications": {
    "brand": "Brand Name",
    "model": "Model Number"
  },
  "unit_of_measure": "piece"
}
```

#### **GET /products/:id**
**Description**: Get product by ID with inventory information

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Laptop",
    "description": "High-performance laptop",
    "sku": "LAP001",
    "category": {
      "id": 1,
      "name": "Electronics"
    },
    "specifications": {},
    "inventory": [
      {
        "warehouse_id": 1,
        "warehouse_name": "Main Warehouse",
        "quantity": 50,
        "min_threshold": 10,
        "max_threshold": 100
      }
    ],
    "created_at": "2024-12-19T10:30:00Z"
  }
}
```

#### **PUT /products/:id**
**Description**: Update product

#### **DELETE /products/:id**
**Description**: Soft delete product

### 4.2 Categories Management

#### **GET /categories**
**Description**: Get all categories with hierarchy

#### **POST /categories**
**Description**: Create new category

#### **GET /categories/:id**
**Description**: Get category by ID

#### **PUT /categories/:id**
**Description**: Update category

#### **DELETE /categories/:id**
**Description**: Delete category

## 5. Inventory Management Endpoints

### 5.1 Inventory Operations

#### **GET /inventory**
**Description**: Get inventory levels across all warehouses

**Query Parameters**:
- `warehouse_id` (number): Filter by warehouse
- `product_id` (number): Filter by product
- `low_stock` (boolean): Show only low stock items
- `out_of_stock` (boolean): Show only out of stock items

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "Laptop",
        "sku": "LAP001"
      },
      "warehouse": {
        "id": 1,
        "name": "Main Warehouse"
      },
      "quantity": 50,
      "min_threshold": 10,
      "max_threshold": 100,
      "reserved_quantity": 5,
      "available_quantity": 45,
      "stock_status": "Normal"
    }
  ]
}
```

#### **PUT /inventory/:id**
**Description**: Update inventory quantity

**Request Body**:
```json
{
  "quantity": 60,
  "min_threshold": 15,
  "max_threshold": 120,
  "notes": "Stock adjustment"
}
```

#### **POST /inventory/adjustment**
**Description**: Make inventory adjustment

**Request Body**:
```json
{
  "product_id": 1,
  "warehouse_id": 1,
  "adjustment_type": "in",
  "quantity": 10,
  "reason": "Purchase order received",
  "reference_type": "purchase_order",
  "reference_id": 123
}
```

### 5.2 Inventory Transfers

#### **GET /inventory/transfers**
**Description**: Get all inventory transfers

#### **POST /inventory/transfers**
**Description**: Create inventory transfer

**Request Body**:
```json
{
  "product_id": 1,
  "from_warehouse_id": 1,
  "to_warehouse_id": 2,
  "quantity": 20,
  "expected_arrival_date": "2024-12-25",
  "notes": "Transfer to secondary warehouse"
}
```

#### **PUT /inventory/transfers/:id/status**
**Description**: Update transfer status

**Request Body**:
```json
{
  "status": "completed",
  "actual_arrival_date": "2024-12-24"
}
```

### 5.3 Stock Alerts

#### **GET /inventory/alerts**
**Description**: Get stock alerts

**Query Parameters**:
- `alert_type` (string): Filter by alert type
- `is_acknowledged` (boolean): Filter by acknowledgment status
- `warehouse_id` (number): Filter by warehouse

#### **POST /inventory/alerts/:id/acknowledge**
**Description**: Acknowledge stock alert

## 6. Purchase Order Management Endpoints

### 6.1 Purchase Orders CRUD

#### **GET /purchase-orders**
**Description**: Get all purchase orders

**Query Parameters**:
- `status` (string): Filter by status
- `supplier_id` (number): Filter by supplier
- `date_from` (date): Filter by date range
- `date_to` (date): Filter by date range

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "order_number": "PO-2024-001",
      "status": "pending",
      "total_amount": 5000.00,
      "order_date": "2024-12-19",
      "expected_delivery_date": "2024-12-25",
      "supplier": {
        "id": 1,
        "name": "Tech Supplies Inc"
      },
      "items_count": 5,
      "created_by": "admin"
    }
  ]
}
```

#### **POST /purchase-orders**
**Description**: Create new purchase order

**Request Body**:
```json
{
  "supplier_id": 1,
  "expected_delivery_date": "2024-12-25",
  "notes": "Urgent order",
  "items": [
    {
      "product_id": 1,
      "quantity": 10,
      "unit_price": 500.00
    }
  ]
}
```

#### **GET /purchase-orders/:id**
**Description**: Get purchase order details

#### **PUT /purchase-orders/:id/status**
**Description**: Update purchase order status

**Request Body**:
```json
{
  "status": "received",
  "actual_delivery_date": "2024-12-24"
}
```

### 6.2 Purchase Order Items

#### **GET /purchase-orders/:id/items**
**Description**: Get purchase order items

#### **POST /purchase-orders/:id/items**
**Description**: Add item to purchase order

#### **PUT /purchase-orders/:id/items/:item_id**
**Description**: Update purchase order item

## 7. Supplier Management Endpoints

### 7.1 Suppliers CRUD

#### **GET /suppliers**
**Description**: Get all suppliers

#### **POST /suppliers**
**Description**: Create new supplier

**Request Body**:
```json
{
  "name": "New Supplier",
  "contact_person": "John Doe",
  "email": "john@supplier.com",
  "phone": "+1234567890",
  "address": "123 Supplier St, City, State",
  "contact_info": {
    "website": "https://supplier.com",
    "payment_terms": "Net 30"
  }
}
```

#### **GET /suppliers/:id**
**Description**: Get supplier by ID

#### **PUT /suppliers/:id**
**Description**: Update supplier

#### **DELETE /suppliers/:id**
**Description**: Soft delete supplier

## 8. Warehouse Management Endpoints

### 8.1 Warehouses CRUD

#### **GET /warehouses**
**Description**: Get all warehouses

#### **POST /warehouses**
**Description**: Create new warehouse

**Request Body**:
```json
{
  "name": "New Warehouse",
  "location": "456 New St, City, State",
  "address": "Full address details",
  "capacity": 5000,
  "manager_id": 2
}
```

#### **GET /warehouses/:id**
**Description**: Get warehouse by ID

#### **PUT /warehouses/:id**
**Description**: Update warehouse

#### **DELETE /warehouses/:id**
**Description**: Soft delete warehouse

## 9. Reporting Endpoints

### 9.1 Inventory Reports

#### **GET /reports/inventory**
**Description**: Get inventory summary report

**Query Parameters**:
- `warehouse_id` (number): Filter by warehouse
- `category_id` (number): Filter by category
- `date` (date): Report date

**Response**:
```json
{
  "success": true,
  "data": {
    "total_products": 150,
    "total_items": 5000,
    "total_value": 250000.00,
    "low_stock_items": 15,
    "out_of_stock_items": 3,
    "warehouse_summary": [
      {
        "warehouse_id": 1,
        "warehouse_name": "Main Warehouse",
        "total_items": 3000,
        "total_value": 150000.00
      }
    ]
  }
}
```

#### **GET /reports/turnover**
**Description**: Get inventory turnover report

**Query Parameters**:
- `product_id` (number): Filter by product
- `period_start` (date): Start date
- `period_end` (date): End date

#### **GET /reports/low-stock**
**Description**: Get low stock report

#### **GET /reports/transactions**
**Description**: Get transaction history report

### 9.2 Export Endpoints

#### **GET /reports/export/inventory**
**Description**: Export inventory data to CSV/Excel

**Query Parameters**:
- `format` (string): Export format (csv, excel)
- `warehouse_id` (number): Filter by warehouse

#### **GET /reports/export/transactions**
**Description**: Export transaction data

## 10. Audit and Logging Endpoints

### 10.1 Audit Logs

#### **GET /audit-logs**
**Description**: Get audit logs

**Query Parameters**:
- `user_id` (number): Filter by user
- `action` (string): Filter by action
- `table_name` (string): Filter by table
- `date_from` (date): Filter by date range
- `date_to` (date): Filter by date range

## 11. API Scalability Considerations

### 11.1 Pagination
- All list endpoints support pagination
- Default page size: 10 items
- Maximum page size: 100 items
- Consistent pagination format across all endpoints

### 11.2 Caching Strategy
- **GET requests**: Cache for 5 minutes
- **Inventory data**: Cache for 1 minute
- **User data**: Cache for 10 minutes
- **Report data**: Cache for 15 minutes

### 11.3 Rate Limiting
- **Authentication endpoints**: 5 requests per minute
- **Data modification endpoints**: 100 requests per minute
- **Data retrieval endpoints**: 1000 requests per minute
- **Report endpoints**: 10 requests per minute

### 11.4 Database Optimization
- Use database indexes for all query parameters
- Implement query optimization for complex reports
- Use database views for common queries
- Implement connection pooling

### 11.5 Error Handling
- Consistent error response format
- Proper HTTP status codes
- Detailed error messages for debugging
- Validation error details

### 11.6 Security
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- SQL injection prevention
- CORS configuration

## 12. API Versioning

### 12.1 Version Strategy
- URL versioning: `/api/v1/`
- Backward compatibility for 6 months
- Deprecation notices in headers
- Migration guides for breaking changes

### 12.2 Current Version
- **Version**: v1
- **Base URL**: `/api/v1/`
- **Status**: Active
- **Deprecation Date**: TBD

## 13. API Documentation

### 13.1 OpenAPI/Swagger
- Auto-generated API documentation
- Interactive API testing
- Request/response examples
- Schema definitions

### 13.2 Postman Collection
- Complete API collection
- Environment variables
- Pre-request scripts
- Test scripts

---

**Document Version**: 1.0
**Last Updated**: 2024-12-19
**Next Review**: After Phase 1 completion 