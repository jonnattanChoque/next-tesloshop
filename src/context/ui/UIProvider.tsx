import { FC, ReactNode, useReducer } from 'react';
import { UIContext, UIReducer } from './';

export interface UIState {
    isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UIState = {
    isMenuOpen: false,
};

interface Props {
    children: ReactNode
}

export const UIProvider: FC<Props> = ({ children }) => {
    const [state, dispatch] = useReducer(UIReducer, UI_INITIAL_STATE);

    const toggleSideMenu = () => {
        dispatch({ type: 'UI - toggleMenu' });
    };

    return (
        <UIContext.Provider value={{
            ...state,
            toggleSideMenu
        }}>
            {children}
        </UIContext.Provider>
    );
};