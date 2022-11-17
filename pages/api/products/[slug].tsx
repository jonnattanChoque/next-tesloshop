// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../src/db'
import { IProduct } from '../../../src/interfaces'
import { ProductModel } from '../../../src/models'

type Data =
    | { message: string }
    | IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getProduct(req, res)

        default:
            res.status(400).json({ message: 'Bad request' })
    }
    res.status(200).json({ message: 'John Doe' })
}

async function getProduct(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { slug } = req.query;

    await db.connect()
    const product = await ProductModel.findOne({ slug }).select('title images price inStock slug -_id').lean()
    await db.disconnect()

    if (!product) {
        res.status(404).json({ message: 'Product not found' })
    }

    return res.status(200).json(product!)
}

