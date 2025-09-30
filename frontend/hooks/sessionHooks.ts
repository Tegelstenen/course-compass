import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../state/store';
import { getSession } from '@/state/session/sessionSlice';
import { type Dispatch, useEffect } from "react";


export function useSessionData() {
    const dispatch = useDispatch<Dispatch>();
    const { userId, isLoading } = useSelector((state: RootState) => state.session);

    useEffect(() => {
        // (optional app logic)
        dispatch(getSession());
    }, [dispatch]);

    return { userId, isLoading }; 
}