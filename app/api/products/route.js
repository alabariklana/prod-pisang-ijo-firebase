import { withDatabase } from '@/lib/mongodb';
import { 
  ApiResponse, 
  handleApiError, 
  validateRequiredFields, 
  validateNumber, 
  sanitizeString 
} from '@/lib/api-utils';
import { config } from '@/lib/config';

/**
 * Get all products with stock information
 * @param {Request} request - HTTP request
 * @returns {Promise<NextResponse>} Products list response
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const isActiveOnly = searchParams.get('active') === 'true';
    const category = searchParams.get('category');

    return await withDatabase(async (db) => {
      // Build query filters
      const query = {};
      if (isActiveOnly) {
        query.isActive = true;
      }
      if (category) {
        query.category = category;
      }

      const products = await db.collection('products')
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();
      
      // Normalize product data with stock information
      const normalizedProducts = products.map(product => ({
        ...product,
        _id: product._id.toString(),
        stock: validateNumber(product.stock, 'stock', { required: false, default: 0 }),
        lowStockThreshold: validateNumber(product.lowStockThreshold, 'lowStockThreshold', { 
          required: false, 
          default: config.business.lowStockThreshold 
        }),
        isActive: product.isActive !== false,
        price: validateNumber(product.price, 'price', { required: false, default: 0 }),
        // Add computed fields
        isLowStock: (product.stock || 0) <= (product.lowStockThreshold || config.business.lowStockThreshold),
        isOutOfStock: (product.stock || 0) === 0
      }));
      
      return ApiResponse.success(normalizedProducts, 'Products retrieved successfully');
    });
  } catch (error) {
    return handleApiError(error, 'GET /api/products');
  }
}

/**
 * Create a new product
 * @param {Request} request - HTTP request with product data
 * @returns {Promise<NextResponse>} Created product response
 */
export async function POST(request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return ApiResponse.validationError('Invalid JSON in request body');
    }

    // Validate required fields
    validateRequiredFields(body, ['name', 'category', 'price']);

    // Extract and validate data
    const productData = {
      name: sanitizeString(body.name, { trim: true, maxLength: 200, minLength: 2 }),
      category: sanitizeString(body.category, { trim: true, maxLength: 100 }),
      price: validateNumber(body.price, 'price', { min: 0, max: 10000000 }),
      description: sanitizeString(body.description || '', { trim: true, maxLength: 1000 }),
      imageUrl: sanitizeString(body.imageUrl || '', { trim: true, maxLength: 500 }),
      stock: validateNumber(body.stock || 0, 'stock', { min: 0, max: 100000, required: false }),
      lowStockThreshold: validateNumber(
        body.lowStockThreshold || config.business.lowStockThreshold, 
        'lowStockThreshold', 
        { min: 0, max: 1000, required: false }
      ),
      isActive: Boolean(body.isActive !== false),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Additional business validations
    if (productData.lowStockThreshold > productData.stock) {
      return ApiResponse.validationError('Low stock threshold cannot be greater than current stock');
    }

    return await withDatabase(async (db) => {
      // Check for duplicate product names
      const existingProduct = await db.collection('products').findOne({
        name: { $regex: new RegExp(`^${productData.name}$`, 'i') }
      });

      if (existingProduct) {
        return ApiResponse.validationError('Product with this name already exists');
      }

      // Insert new product
      const result = await db.collection('products').insertOne(productData);

      // Fetch the created product with proper formatting
      const createdProduct = await db.collection('products').findOne({
        _id: result.insertedId
      });

      return ApiResponse.success(
        {
          ...createdProduct,
          _id: createdProduct._id.toString()
        },
        'Product created successfully',
        201
      );
    });
  } catch (error) {
    return handleApiError(error, 'POST /api/products');
  }
}