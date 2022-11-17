import { NextApiRequest, NextApiResponse } from 'next';
import dbOrders from '../../../src/db/orders';
import dbProducts from '../../../src/db/products';
import dbUsers from '../../../src/db/users';

type Data =  | {
    numberOfOrders: number;
    numberOfClients: number;
    numberOfProducts: number;
    paidOrders: number;
    notPaidORders: number;
    productsWithNoInventory: number;
    lowInventory: number; //low 10
}
| {message: string}

export default function handlres(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getInfoAdmin(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}

async function getInfoAdmin(req: NextApiRequest, res: NextApiResponse<Data>) {

    const [
        numberOfOrders,
        numberOfClients,
        numberOfProducts,
        paidOrders,
        productsWithNoInventory,
        lowInventory
    ] = await Promise.all([
        //Orders
        await dbOrders.getTotalOrders(),

        //Clients
        await dbUsers.getTotalUsers(),

        //Products
        await dbProducts.getTotalProducts(),

        //Paid Orders
        await dbOrders.getTotalOrdersPaid(),

        //Products with no inventory
        await dbProducts.getEmptyStockProducts(),

        //Low Inventory
        await dbProducts.getLowStockProducts(),
    ]);

    res.status(200).json({
        numberOfOrders,
        paidOrders,
        notPaidORders: numberOfOrders - paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory
    })
}
