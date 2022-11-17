import { ShippingAdrress, ICartProduct } from '../../interfaces';
import { CartState } from './CartProvider';

type CartActionType =
    | { type: 'Cart - LoadCartFromCookies|storage', payload: ICartProduct[]; }
    | { type: 'CART - AddProductCart', payload: ICartProduct[]; }
    | { type: 'CART - ChangeCartQuantity', payload: ICartProduct; }
    | { type: 'CART - deleteProductCart', payload: ICartProduct[]; }
    | { type: 'CART - LoadAddressFromCookies', payload: ShippingAdrress; }
    | { type: 'CART - UpdateAddressFromCookies', payload: ShippingAdrress; }
    | { type: 'CART - OrderComplete' }
    | {
        type: 'CART - UpdateOrder', payload: {
            numberOfItems: number,
            subTotal: number,
            tax: number,
            total: number
        };
    }

export const CartReducer = (state: CartState, action: any) => {
    switch (action.type) {
        case 'CART - AddProductCart':
            return {
                ...state,
                cart: [...action.payload]
            }
        case 'Cart - LoadCartFromCookies|storage':
            return {
                ...state,
                isLoaded: true,
                cart: [...action.payload]
            }
        case 'Cart - UpdateAddressFromCookies':
            return {
                ...state,
                shippingAdrress: action.payload
            }
        case 'Cart - LoadAddressFromCookies':
            return {
                ...state,
                shippingAdrress: action.payload
            }
        case 'Cart - ChangeCartQuantity':
            return {
                ...state,
                cart: state.cart.map((product: ICartProduct) => {
                    if (product._id !== action.payload._id) return product;
                    if (product.sizes !== action.payload.sizes) return product;

                    return action.payload;
                })
            }
        case 'CART - deleteProductCart':
            return {
                ...state,
                cart: [...action.payload]
            }
        case 'CART - UpdateOrder':
            return {
                ...state,
                ...action.payload
            }
        case 'CART - OrderComplete':
            return {
                ...state,
                cart: [],
                numberOfItems: 0,
                subTotal: 0,
                tax: 0,
                total: 0
            }
        default:
            return state;
    }
}