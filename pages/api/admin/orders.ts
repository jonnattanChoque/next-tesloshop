import { isValidObjectId } from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../src/db';
import { IOrder } from '../../../src/interfaces';
import { OrderModel, UserModel } from '../../../src/models';

type Data =
| {message: string}
| IOrder[]

export default function handlres(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getOrders(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}

async function getOrders(req: NextApiRequest, res: NextApiResponse<Data>) {
    await db.connect();
    const orders = await await OrderModel.find().sort({createdAt: 'desc'}).populate('user', 'name email').lean();
    await db.disconnect();

    return res.status(200).json(orders);
}
