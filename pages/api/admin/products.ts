import { isValidObjectId } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../src/db';
import { IProduct } from '../../../src/interfaces';
import { ProductModel } from '../../../src/models';
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config(process.env.CLOUDINARY_URL || '');

type Data =
| {message: string}
| IProduct[]
| IProduct

export default function handlres(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getProducts(req, res);
        case 'PUT':
            return updateProduct(req, res);
        case 'POST':
            return createProduct(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}

async function getProducts(req: NextApiRequest, res: NextApiResponse<Data>) {
    await db.connect();
    const products = await await ProductModel.find().sort({title: 'asc'}).lean();
    await db.disconnect();

    return res.status(200).json(products);
}

async function updateProduct(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { _id = '', images = [] } = req.body as IProduct;

    if(!isValidObjectId(_id)) {
        return res.status(400).json({ message: 'Invalid product id' });
    }

    if(images.length < 2) {
        return res.status(400).json({ message: 'Product must have at least 2 images' });
    }

    try {
        await db.connect();

        const product = await ProductModel.findById(_id);
        if(!product) {
            await db.disconnect();
            return res.status(400).json({ message: 'Product not found' });
        }

        product.images.forEach(async (image) => {
            if(!images.includes(image)) {
                const fileId = image.substring(image.lastIndexOf('/') + 1).split('.')[0];
                await cloudinary.uploader.destroy(fileId);
            }
        });

        await product.update(req.body);
        await db.disconnect();
        return res.status(200).json(product);
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(500).json({ message: 'Something went wrong' });
    }
}

async function createProduct(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { images = [] } = req.body as IProduct;

    if(images.length < 2) {
        return res.status(400).json({ message: 'Product must have at least 2 images' });
    }

    try {
        await db.connect();
        const productInDB = await ProductModel.findOne({ slug: req.body.slug });
        if(productInDB) {
            await db.disconnect();
            return res.status(400).json({ message: 'Product already exists' });
        }

        const product = new ProductModel(req.body);
        await product.save();
        await db.disconnect();
        return res.status(201).json(product);
    } catch (error) {
        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'Something went wrong' });
    }
}

