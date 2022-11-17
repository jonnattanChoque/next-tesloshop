import mongoose from 'mongoose';
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../src/db';
import { IOrder } from '../../../src/interfaces';
import { ProductModel, OrderModel } from '../../../src/models';

type Data = 
| { message: string; }
| IOrder

export default function handlres(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'POST':
            return createOrder(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}

async function createOrder(req: NextApiRequest, res: NextApiResponse<Data>) {
    const {orderItems, total, user} = req.body;
    if (!user) {
        return res.status(401).json({message: 'No te has logueado'});
    }
    //Verificar que el carrito no esté vacío
    const productsIds = orderItems.map((item: { _id: string; }) => item._id);
    await db.connect();
    const dbProducts = await ProductModel.find({_id: {$in: productsIds}});

    try {
        const subTotal = orderItems.map((item: { _id: string, quantity: number }) => {
            const currentPrice = dbProducts.find((product) => product._id.toString() === item._id)?.price;
            if(!currentPrice) throw new Error('No se encontró el producto');
            var price = currentPrice * item.quantity;
            var sum =+ price;
            return  sum;
        });
        
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const subtotalGen = subTotal.reduce((a: any, b: any) => a + b, 0);
        const totalBackend = (subtotalGen) * (taxRate + 1);
        if (totalBackend !== total) {
            return res.status(400).json({message: 'El total no coincide'});
        }

        //Success Order
        const newOrder = new OrderModel({
            ...req.body,
            isPaid: false,
            user: user,
        });
        newOrder.total = Math.round(newOrder.total * 100) / 100;
        await newOrder.save()

        return res.status(201).json(newOrder);

    } catch (error) {
        await db.disconnect();
        console.log(error)
        res.status(400).json({message: 'Error al crear el pedido'});
    }

    res.status(200).json({ message: 'Order created' })
}

