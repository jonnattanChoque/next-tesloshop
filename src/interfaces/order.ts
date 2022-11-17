import { IUser } from "./User";

export interface IOrder {
    _id?: string;
    user?: IUser | string;
    orderItems: IOrderItem[];
    shippingAddress: ShippingAdrress;
    paymentResult?: string;

    numberOfItems: number;
    subtotal: number;
    tax: number;
    total: number;

    isPaid: boolean;
    paidAt?: string;

    transsactionId?: string;
}

export interface IOrderItem {
    _id?: string;
    title: string;
    sizes: string;
    quantity: number;
    gender: string;
    slug?: string;
    images?: string;
    price: number;
}

export interface ShippingAdrress {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    country: string;
    phone: string;
}