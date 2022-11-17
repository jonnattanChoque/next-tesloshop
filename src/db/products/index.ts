import { db } from '../../db';
import { IProduct } from '../../interfaces';
import { ProductModel } from '../../models';

const getProductBySlug = async (slug: string): Promise<IProduct | null> => {
    db.connect();
    const product = await ProductModel.findOne({ slug }).lean();
    db.disconnect();
    
    if(!product) {
        throw new Error('Product not found');
    }

    return JSON.parse(JSON.stringify(product));
}


interface ProductSlug { slug: string }
const getAllProductsSlug = async (): Promise<ProductSlug[]> => {
    db.connect();
    const slugs = await ProductModel.find().select('slug -_id').lean();
    db.disconnect();
    
    if(!slugs) {
        throw new Error('Product not found');
    }

    return slugs
}

const getProductsByTerm = async (term: string): Promise<IProduct[]> => {
    term = term.toString().toLowerCase();
    await db.connect();
    const products = await ProductModel.find({ $text: { $search: term } })
    .select('title images price inStock slug -_id').lean();
    await db.disconnect();

    return products;
}

const getAllProducts= async (): Promise<IProduct[]> => {
    await db.connect();
    const slugs = await ProductModel.find().select('title images price inStock slug -_id').lean();
    await db.disconnect();
    
    if(!slugs) {
        throw new Error('Product not found');
    }

    return slugs
}

const getTotalProducts= async () => {
    await db.connect();
    const products = await ProductModel.count()
    await db.disconnect();

    return products
}

const getEmptyStockProducts= async () => {
    await db.connect();
    const products = await ProductModel.count({inStock: 0})
    await db.disconnect();

    return products
}

const getLowStockProducts= async () => {
    await db.connect();
    const products = await ProductModel.count({inStock: {$lte: 10}})
    await db.disconnect();

    return products
}

const dbProducts = {
    getProductBySlug,
    getAllProductsSlug,
    getProductsByTerm,
    getAllProducts,
    getTotalProducts,
    getEmptyStockProducts,
    getLowStockProducts
}

export default dbProducts;