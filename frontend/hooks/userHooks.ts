import { useSelector } from 'react-redux';
import { RootState } from '../state/store';

// exports the full user data
export function useUserData() {
    return useSelector((state: RootState) => state.user);
}

// exports parts of the user data (not sure if needed, but good practice if only some parts of user data are needed)
export function useUserName() {
    return useSelector((state: RootState) => state.user.name);
}

export function useUserEmail() {
    return useSelector((state: RootState) => state.user.email);
}