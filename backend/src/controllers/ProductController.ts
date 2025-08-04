import { Request, Response } from 'express';
import { ProductModel } from '../models/ProductModel';
import { CreateProductInput, UpdateProductInput, QueryParams } from '../types/database';
import { logger } from '../utils/logger';
import { safeParseInt, safeParseBoolean, safeParseSortOrder } from '../utils/helpers';

export class ProductController {
  /**
   * Create a new product
   * POST /api/products
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const productData: CreateProductInput = req.body;
      
      // Validate required fields
      if (!productData.name || !productData.sku) {
        res.status(400).json({
          success: false,
          error: 'Missing required fields: name, sku'
        });
        return;
      }

      // Check if SKU already exists
      const existingSku = await ProductModel.findBySku(productData.sku);
      if (existingSku) {
        res.status(409).json({
          success: false,
          error: 'SKU already exists'
        });
        return;
      }

      // Check if barcode already exists (if provided)
      if (productData.barcode) {
        const existingBarcode = await ProductModel.findByBarcode(productData.barcode);
        if (existingBarcode) {
          res.status(409).json({
            success: false,
            error: 'Barcode already exists'
          });
          return;
        }
      }

      const product = await ProductModel.create(productData);
      
      res.status(201).json({
        success: true,
        data: product,
        message: 'Product created successfully'
      });
    } catch (error) {
      logger.error('Error creating product:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get all products with pagination and filtering
   * GET /api/products
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const queryParams: QueryParams = {
        page: safeParseInt(req.query.page as string) || 1,
        limit: safeParseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
        category_id: req.query.category_id ? safeParseInt(req.query.category_id as string) : undefined,
        is_active: safeParseBoolean(req.query.is_active as string),
        sortBy: req.query.sortBy as string || 'created_at',
        sortOrder: safeParseSortOrder(req.query.sortOrder as string)
      };

      const result = await ProductModel.findAll(queryParams);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error fetching products:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get all products with category information
   * GET /api/products/with-category
   */
  static async getAllWithCategory(req: Request, res: Response): Promise<void> {
    try {
      const queryParams: QueryParams = {
        page: safeParseInt(req.query.page as string) || 1,
        limit: safeParseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
        category_id: req.query.category_id ? safeParseInt(req.query.category_id as string) : undefined,
        is_active: safeParseBoolean(req.query.is_active as string),
        sortBy: req.query.sortBy as string || 'p.created_at',
        sortOrder: safeParseSortOrder(req.query.sortOrder as string)
      };

      const result = await ProductModel.findAllWithCategory(queryParams);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error fetching products with category:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get product by ID
   * GET /api/products/:id
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = safeParseInt(req.params.id);
      
      if (id === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid product ID'
        });
        return;
      }

      const product = await ProductModel.findById(id);
      
      if (!product) {
        res.status(404).json({
          success: false,
          error: 'Product not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      logger.error('Error fetching product:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get product by ID with category information
   * GET /api/products/:id/with-category
   */
  static async getByIdWithCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = safeParseInt(req.params.id);
      
      if (id === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid product ID'
        });
        return;
      }

      const product = await ProductModel.findByIdWithCategory(id);
      
      if (!product) {
        res.status(404).json({
          success: false,
          error: 'Product not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      logger.error('Error fetching product with category:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get product by ID with inventory information
   * GET /api/products/:id/with-inventory
   */
  static async getByIdWithInventory(req: Request, res: Response): Promise<void> {
    try {
      const id = safeParseInt(req.params.id);
      
      if (id === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid product ID'
        });
        return;
      }

      const product = await ProductModel.findByIdWithInventory(id);
      
      if (!product) {
        res.status(404).json({
          success: false,
          error: 'Product not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      logger.error('Error fetching product with inventory:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Update product
   * PUT /api/products/:id
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = safeParseInt(req.params.id);
      
      if (id === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid product ID'
        });
        return;
      }

      const updateData: UpdateProductInput = req.body;
      
      // Check if product exists
      const existingProduct = await ProductModel.findById(id);
      if (!existingProduct) {
        res.status(404).json({
          success: false,
          error: 'Product not found'
        });
        return;
      }

      // Check for SKU conflicts if SKU is being updated
      if (updateData.sku && updateData.sku !== existingProduct.sku) {
        const skuExists = await ProductModel.skuExists(updateData.sku, id);
        if (skuExists) {
          res.status(409).json({
            success: false,
            error: 'SKU already exists'
          });
          return;
        }
      }

      // Check for barcode conflicts if barcode is being updated
      if (updateData.barcode && updateData.barcode !== existingProduct.barcode) {
        const barcodeExists = await ProductModel.barcodeExists(updateData.barcode, id);
        if (barcodeExists) {
          res.status(409).json({
            success: false,
            error: 'Barcode already exists'
          });
          return;
        }
      }

      const updatedProduct = await ProductModel.update(id, updateData);
      
      if (!updatedProduct) {
        res.status(404).json({
          success: false,
          error: 'Product not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedProduct,
        message: 'Product updated successfully'
      });
    } catch (error) {
      logger.error('Error updating product:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Delete product (soft delete)
   * DELETE /api/products/:id
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = safeParseInt(req.params.id);
      
      if (id === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid product ID'
        });
        return;
      }

      // Check if product exists
      const existingProduct = await ProductModel.findById(id);
      if (!existingProduct) {
        res.status(404).json({
          success: false,
          error: 'Product not found'
        });
        return;
      }

      const deleted = await ProductModel.delete(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Product not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting product:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get products by category
   * GET /api/products/category/:categoryId
   */
  static async getByCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = safeParseInt(req.params.categoryId);
      
      if (categoryId === 0) {
        res.status(400).json({
          success: false,
          error: 'Invalid category ID'
        });
        return;
      }

      const products = await ProductModel.findByCategory(categoryId);

      res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
      logger.error('Error fetching products by category:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get low stock products
   * GET /api/products/low-stock
   */
  static async getLowStock(req: Request, res: Response): Promise<void> {
    try {
      const products = await ProductModel.getLowStockProducts();

      res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
      logger.error('Error fetching low stock products:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get out of stock products
   * GET /api/products/out-of-stock
   */
  static async getOutOfStock(req: Request, res: Response): Promise<void> {
    try {
      const products = await ProductModel.getOutOfStockProducts();

      res.status(200).json({
        success: true,
        data: products
      });
    } catch (error) {
      logger.error('Error fetching out of stock products:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get product statistics
   * GET /api/products/stats
   */
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const [totalCount, countByCategory] = await Promise.all([
        ProductModel.getTotalCount(),
        ProductModel.getCountByCategory()
      ]);

      res.status(200).json({
        success: true,
        data: {
          total_products: totalCount,
          products_by_category: countByCategory
        }
      });
    } catch (error) {
      logger.error('Error fetching product statistics:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Search products by SKU or barcode
   * GET /api/products/search/:identifier
   */
  static async searchByIdentifier(req: Request, res: Response): Promise<void> {
    try {
      const identifier = req.params.identifier;
      
      if (!identifier) {
        res.status(400).json({
          success: false,
          error: 'Search identifier is required'
        });
        return;
      }

      // Try to find by SKU first
      let product = await ProductModel.findBySku(identifier);
      
      // If not found by SKU, try barcode
      if (!product) {
        product = await ProductModel.findByBarcode(identifier);
      }

      if (!product) {
        res.status(404).json({
          success: false,
          error: 'Product not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      logger.error('Error searching product by identifier:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 