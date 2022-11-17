import { IUser } from '../../interfaces/User';
import { AuthState } from './AuthProvider';

type AuthActionType =
    | { type: 'Auth - login', payload: IUser }
    | { type: 'Auth - logout' }

export const AuthReducer = (state: AuthState, action: any) => {
    switch (action.type) {
        case 'Auth - login':
            return {
                ...state,
                isLoggedIn: true,
                user: action.payload
            }
        case 'Auth - logout':
            return {
                ...state,
                isLoggedIn: false,
                user: undefined
            }
        default:
            return state;
    }
}