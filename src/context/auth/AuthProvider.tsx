import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { FC, ReactNode, useEffect, useReducer } from 'react';
import { globalApi } from '../../api';
import { IUser } from '../../interfaces/User';
import { AuthContext, AuthReducer } from './';

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined
};

interface Props {
    children: ReactNode
}

export const AuthProvider: FC<Props> = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, AUTH_INITIAL_STATE)
    const router = useRouter();

    // Efecto
    useEffect(() => {
        validToken();
    }, []);


    const validToken = async () => {
        if (!Cookies.get('tokenAuth')) return;

        try {
            const { data } = await globalApi.get('/user/validateToken');
            const { token, user } = data;
            Cookies.set('tokenAuth', token);
            dispatch({ type: 'Auth - login', payload: user })
            return true
        } catch (error) {
            Cookies.remove('tokenAuth');
            router.reload();
        }
    }

    const loginUser = async (email: string, password: string) => {
        try {
            const { data } = await globalApi.post('/user/login', { email, password });
            const { token, user } = data;
            Cookies.set('tokenAuth', token);
            dispatch({ type: 'Auth - login', payload: user })
            return true
        } catch (error) {
            return false
        }
    }

    const registerUser = async (name: string, email: string, password: string): Promise<{ hasError: boolean; message?: string | undefined }> => {
        try {
            const { data } = await globalApi.post('/user/register', { name, email, password });
            const { token, user } = data;
            Cookies.set('tokenAuth', token);
            dispatch({ type: 'Auth - login', payload: user })
            return {
                hasError: false
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            } else {
                return {
                    hasError: true,
                    message: 'Error al crear ususario'
                }
            }
        }
    }

    const logoutUser = () => {
        Cookies.remove('tokenAuth');
        Cookies.remove('cart');
        Cookies.remove('address');
        Cookies.remove('shippingAdrress');
        router.reload();
    }

    return (
        <AuthContext.Provider value={{
            ...state,
            loginUser,
            registerUser,
            logoutUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};