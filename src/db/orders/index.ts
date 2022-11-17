import { db } from '../../db';
import { IOrder } from '../../interfaces';
import { OrderModel } from '../../models';
import {isValidObjectId} from 'mongoose'

const getOrderById = async (id: string): Promise<IOrder | null> => {
    if(!isValidObjectId(id)) return null;
    
    db.connect();
    const order = await OrderModel.findById(id).lean();
    db.disconnect();
    if(!order) {
        throw new Error('Order not found');
    }

    return JSON.parse(JSON.stringify(order));
}

const getAllOrders= async (): Promise<IOrder[]> => {
    await db.connect();
    const orders = await OrderModel.find().lean();
    await db.disconnect();
    
    if(!orders) {
        throw new Error('Orders not found');
    }

    return orders
}

const getTotalOrders= async () => {
    await db.connect();
    const orders = await OrderModel.count();
    await db.disconnect();
    
    if(!orders) {
        throw new Error('Orders not found');
    }

    return orders
}

const getTotalOrdersPaid= async () => {
    await db.connect();
    const orders = await OrderModel.count({isPaid: true});
    console.log(orders)
    await db.disconnect();
    return orders
}

const getAllOrdersByUser= async (userId: string): Promise<IOrder[] | null> => {
    if(!isValidObjectId(userId)) return null;



    await db.connect();
    const orders = await OrderModel.find({user: userId}).lean();
    await db.disconnect();
    
    if(!orders) {
        throw new Error('Orders not found');
    }

    return JSON.parse(JSON.stringify(orders));
}

const dbOrders = {
    getOrderById,
    getAllOrders,
    getAllOrdersByUser,
    getTotalOrders,
    getTotalOrdersPaid
}

export default dbOrders;