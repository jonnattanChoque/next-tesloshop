import { Typography } from '@mui/material'
import React from 'react'
import ShopLayout from '../../src/components/layouts/ShopLayout'
import ProductList from '../../src/components/products/ProductList'
import { GetServerSideProps } from 'next'
import dbProducts from '../../src/db/products'
import { IProduct } from '../../src/interfaces'

interface Props {
    products: IProduct[],
    foundProducts: boolean,
    query: string
}

const SearchPage = ({ products, foundProducts, query }: Props) => {

    return (
        <ShopLayout title={'Teslo-shop - home'} pageDescription={'Encuentra los mejores productos'}>
            <Typography variant='h1'>Buscar producto</Typography>
            {
                foundProducts
                    ? <Typography variant='h2' sx={{ marginBottom: 1 }}>Búsqueda: {query}</Typography>
                    : <Typography variant='h2' sx={{ marginBottom: 1 }}>No encontramos productos con <strong>{query}</strong>, pero tenemos estos productos</Typography>
            }
            <ProductList products={products} />
        </ShopLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { query = '' } = ctx.params as { query: string };

    if (query.length === 0) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    let products = await dbProducts.getProductsByTerm(query);
    const foundProducts = products.length > 0;

    if (!foundProducts) {
        products = await dbProducts.getAllProducts();
    }
    return {
        props: {
            products,
            foundProducts,
            query
        }
    }
}

export default SearchPage