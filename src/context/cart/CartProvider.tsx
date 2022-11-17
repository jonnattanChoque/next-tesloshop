import { FC, ReactNode, useEffect, useReducer, useContext } from 'react';
import { ICartProduct } from '../../interfaces/Cart';
import { CartContext, CartReducer } from './';
import Cookie from 'js-cookie';
import { IOrder, ShippingAdrress } from '../../interfaces';
import { globalApi } from '../../api';
import { AuthContext } from '../auth';
import axios from 'axios';

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
    shippingAdrress?: ShippingAdrress;
}

const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAdrress: undefined
};

interface Props {
    children: ReactNode
}

export const CartProvider: FC<Props> = ({ children }) => {
    const [state, dispatch] = useReducer(CartReducer, CART_INITIAL_STATE);
    const { user } = useContext(AuthContext)

    useEffect(() => {
        try {
            const cookieProducts = Cookie.get('cart') ? JSON.parse(Cookie.get('cart')!) : []
            dispatch({ type: 'Cart - LoadCartFromCookies|storage', payload: cookieProducts });
        } catch (error) {
            dispatch({ type: 'Cart - LoadCartFromCookies|storage', payload: [] });
        }
    }, []);

    useEffect(() => {
        if (state.cart.length > 0) {
            Cookie.set('cart', JSON.stringify(state.cart));
        }
    }, [state.cart]);


    useEffect(() => {
        const numberOfItems = state.cart.reduce((prev: any, current: { quantity: any; }) => current.quantity + prev, 0);
        const subTotal = state.cart.reduce((prev: number, current: { price: number; quantity: number; }) => (current.price * current.quantity) + prev, 0);
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

        const orderSummary = {
            numberOfItems,
            subTotal,
            tax: subTotal * taxRate,
            total: subTotal * (taxRate + 1)
        }

        dispatch({ type: 'CART - UpdateOrder', payload: orderSummary });
    }, [state.cart]);

    useEffect(() => {
        const cookies = Cookie.get('address');
        if (cookies) {
            const infoParse = JSON.parse(cookies);
            const shippingAdrress: ShippingAdrress = {
                firstName: infoParse.lastName || '',
                lastName: infoParse.lastName || '',
                address: infoParse.address || '',
                address2: infoParse.address2 || '',
                country: infoParse.country || '',
                phone: infoParse.phone || '',
            }

            dispatch({ type: 'Cart - LoadAddressFromCookies', payload: shippingAdrress });
        }
    }, []);


    const addProductToCart = (product: ICartProduct) => {
        // Si el producto es nuevo
        const productInCart = state.cart.some((p: { _id: string; }) => p._id === product._id);
        if (!productInCart) return dispatch({ type: 'CART - AddProductCart', payload: [...state.cart, product] })

        // Si el producto ya existe, pero con tallas diferentes
        const productInCartButDifferentSize = state.cart.some((p: { _id: string; sizes: string | undefined; }) => p._id === product._id && p.sizes === product.sizes);
        if (!productInCartButDifferentSize) return dispatch({ type: 'CART - AddProductCart', payload: [...state.cart, product] })

        const updatedQuantity = state.cart.map((p: { _id: string; sizes: string | undefined; quantity: number; }) => {
            if (p._id !== product._id) return p;
            if (p.sizes !== product.sizes) return p;

            p.quantity = p.quantity + product.quantity;
            return p;
        });

        dispatch({ type: 'CART - AddProductCart', payload: updatedQuantity });
    };

    const updateCartQuantity = (product: ICartProduct) => {
        dispatch({ type: 'Cart - ChangeCartQuantity', payload: product });
    }

    const deleteProductCart = (product: ICartProduct) => {
        const newProducts = state.cart.filter((p: { _id: string; sizes: string | undefined; }) => !(p._id === product._id && p.sizes === product.sizes))
        dispatch({ type: 'CART - deleteProductCart', payload: newProducts });
    }

    const updateAddress = (address: ShippingAdrress) => {
        dispatch({ type: 'Cart - UpdateAddressFromCookies', payload: address });
    }

    const createOrder = async () => {
        if (!state.shippingAdrress) throw new Error('No hay dirección de envío');

        const body: IOrder = {
            orderItems: state.cart,
            shippingAddress: state.shippingAdrress,
            numberOfItems: state.numberOfItems,
            subtotal: state.subTotal,
            tax: state.tax,
            total: state.total,
            isPaid: false,
            user: user
        }

        try {
            const { data } = await globalApi.post('/orders', body);
            dispatch({ type: 'CART - OrderComplete' });
            Cookie.remove('cart');
            return { hasError: false, message: data._id };
        } catch (error) {
            console.log(error)
            if (axios.isAxiosError(error)) {
                return { hasError: true, message: error.response?.data.message };
            } else {
                return { hasError: true, message: 'Error desconocido al crear orden' };
            }
        }
    }

    return (
        <CartContext.Provider value={{
            ...state,
            addProductToCart,
            updateCartQuantity,
            deleteProductCart,
            updateAddress,
            createOrder
        }}>
            {children}
        </CartContext.Provider>
    );
};

