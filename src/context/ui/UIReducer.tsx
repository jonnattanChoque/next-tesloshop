import { UIState } from './UIProvider';

type UIActionType = {
    type: 'UI - toggleMenu';
}

export const UIReducer = (state: UIState, action: any) => {
    switch (action.type) {
        case 'UI - toggleMenu':
            return {
                ...state,
                isMenuOpen: !state.isMenuOpen,
            }
        default:
            return state;
    }
}