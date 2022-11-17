import { createContext } from 'react'
import { ShippingAdrress } from '../../interfaces';
import { ICartProduct } from '../../interfaces/Cart';

interface ContextProps {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
    shippingAdrress: ShippingAdrress;
    addProductToCart: (product: ICartProduct) => void;
    updateCartQuantity: (product: ICartProduct) => void;
    deleteProductCart: (product: ICartProduct) => void;
    updateAddress: (address: ShippingAdrress) => void;
    createOrder: () => Promise<{ hasError: boolean, message: string }>;
}

export const CartContext = createContext({} as ContextProps)