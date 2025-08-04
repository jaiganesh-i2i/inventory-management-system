import { Request, Response } from 'express';
import { CategoryModel } from '../models/CategoryModel';
import { CreateCategoryInput, UpdateCategoryInput, QueryParams } from '../types/database';
import { logger } from '../utils/logger';

export class CategoryController {
  /**
   * Create a new category
   * POST /api/categories
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const categoryData: CreateCategoryInput = req.body;
      
      // Validate required fields
      if (!categoryData.name) {
        res.status(400).json({
          success: false,
          error: 'Missing required field: name'
        });
        return;
      }

      // Check if category name already exists
      const existingCategory = await CategoryModel.findByName(categoryData.name);
      if (existingCategory) {
        res.status(409).json({
          success: false,
          error: 'Category name already exists'
        });
        return;
      }

      const category = await CategoryModel.create(categoryData);
      
      res.status(201).json({
        success: true,
        data: category,
        message: 'Category created successfully'
      });
    } catch (error) {
      logger.error('Error creating category:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get all categories with pagination and filtering
   * GET /api/categories
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const queryParams: QueryParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        search: req.query.search as string,
        parent_id: req.query.parent_id ? parseInt(req.query.parent_id as string) : undefined,
        is_active: req.query.is_active === 'true' ? true : req.query.is_active === 'false' ? false : undefined,
        sortBy: req.query.sortBy as string || 'created_at',
        sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'desc'
      };

      const result = await CategoryModel.findAll(queryParams);

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      logger.error('Error fetching categories:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get category by ID
   * GET /api/categories/:id
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id || '0');
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid category ID'
        });
        return;
      }

      const category = await CategoryModel.findById(id);
      
      if (!category) {
        res.status(404).json({
          success: false,
          error: 'Category not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: category
      });
    } catch (error) {
      logger.error('Error fetching category:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Update category
   * PUT /api/categories/:id
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id || '0');
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid category ID'
        });
        return;
      }

      const updateData: UpdateCategoryInput = req.body;
      
      // Check if category exists
      const existingCategory = await CategoryModel.findById(id);
      if (!existingCategory) {
        res.status(404).json({
          success: false,
          error: 'Category not found'
        });
        return;
      }

      // Check for name conflicts if name is being updated
      if (updateData.name && updateData.name !== existingCategory.name) {
        const nameExists = await CategoryModel.nameExists(updateData.name, id);
        if (nameExists) {
          res.status(409).json({
            success: false,
            error: 'Category name already exists'
          });
          return;
        }
      }

      const updatedCategory = await CategoryModel.update(id, updateData);
      
      if (!updatedCategory) {
        res.status(404).json({
          success: false,
          error: 'Category not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedCategory,
        message: 'Category updated successfully'
      });
    } catch (error) {
      logger.error('Error updating category:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Delete category (soft delete)
   * DELETE /api/categories/:id
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id || '0');
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid category ID'
        });
        return;
      }

      // Check if category exists
      const existingCategory = await CategoryModel.findById(id);
      if (!existingCategory) {
        res.status(404).json({
          success: false,
          error: 'Category not found'
        });
        return;
      }

      const deleted = await CategoryModel.delete(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          error: 'Category not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting category:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get category tree (hierarchical structure)
   * GET /api/categories/tree
   */
  static async getCategoryTree(req: Request, res: Response): Promise<void> {
    try {
      const categoryTree = await CategoryModel.getCategoryTree();

      res.status(200).json({
        success: true,
        data: categoryTree
      });
    } catch (error) {
      logger.error('Error fetching category tree:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get subcategories of a category
   * GET /api/categories/:id/subcategories
   */
  static async getSubcategories(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id || '0');
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid category ID'
        });
        return;
      }

      // Check if category exists
      const existingCategory = await CategoryModel.findById(id);
      if (!existingCategory) {
        res.status(404).json({
          success: false,
          error: 'Category not found'
        });
        return;
      }

      const subcategories = await CategoryModel.getSubcategories(id);

      res.status(200).json({
        success: true,
        data: subcategories
      });
    } catch (error) {
      logger.error('Error fetching subcategories:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get parent categories of a category
   * GET /api/categories/:id/parents
   */
  static async getParentCategories(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id || '0');
      
      if (isNaN(id)) {
        res.status(400).json({
          success: false,
          error: 'Invalid category ID'
        });
        return;
      }

      // Check if category exists
      const existingCategory = await CategoryModel.findById(id);
      if (!existingCategory) {
        res.status(404).json({
          success: false,
          error: 'Category not found'
        });
        return;
      }

      const parentCategories = await CategoryModel.getParentCategories();

      res.status(200).json({
        success: true,
        data: parentCategories
      });
    } catch (error) {
      logger.error('Error fetching parent categories:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get categories with product count
   * GET /api/categories/with-product-count
   */
  static async getCategoriesWithProductCount(req: Request, res: Response): Promise<void> {
    try {
      const categories = await CategoryModel.getCategoriesWithProductCount();

      res.status(200).json({
        success: true,
        data: categories
      });
    } catch (error) {
      logger.error('Error fetching categories with product count:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get category hierarchy
   * GET /api/categories/hierarchy
   */
  static async getCategoryHierarchy(req: Request, res: Response): Promise<void> {
    try {
      const hierarchy = await CategoryModel.getCategoryHierarchy();

      res.status(200).json({
        success: true,
        data: hierarchy
      });
    } catch (error) {
      logger.error('Error fetching category hierarchy:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }

  /**
   * Get category statistics
   * GET /api/categories/stats
   */
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const [totalCount, categoriesWithProductCount] = await Promise.all([
        CategoryModel.getTotalCount(),
        CategoryModel.getCategoriesWithProductCount()
      ]);

      res.status(200).json({
        success: true,
        data: {
          total_categories: totalCount,
          categories_with_products: categoriesWithProductCount
        }
      });
    } catch (error) {
      logger.error('Error fetching category statistics:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  }
} 