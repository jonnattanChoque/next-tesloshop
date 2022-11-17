
import useRWR, {SWRConfiguration} from 'swr';
import { IProduct } from '../interfaces';


const fetcher = (...arg: [key: string]) => fetch(...arg).then(res => res.json())

export const useProducts = (url: string, config: SWRConfiguration = {}) => {
    const { data, error } = useRWR<IProduct[]>(`/api/${url}`, fetcher, config);

    return {
        products: data || [],
        isLoading: !error && !data,
        isError: error
    }
}
