import { createContext } from 'react'
import { IUser } from '../../interfaces/User';

interface ContextProps {
    isLoggedIn: boolean;
    user?: IUser;
    loginUser: (email: string, password: string) => Promise<boolean>;
    registerUser: (name: string, email: string, password: string) => Promise<{ hasError: boolean; message?: string | undefined }>;
    logoutUser: () => void
}

export const AuthContext = createContext({} as ContextProps);