import { Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import ShopLayout from '../../src/components/layouts/ShopLayout'
import ProductList from '../../src/components/products/ProductList'
import { FullScreenLoading } from '../../src/components/ui'
import { useProducts } from '../../src/hooks'
import { useRouter } from 'next/router'

const GenderPage = () => {
    const router = useRouter()
    const { gender } = router.query
    const { products, isLoading } = useProducts(`products?gender=${gender}`);
    const [name, setname] = useState('')

    useEffect(() => {
        switch (gender) {
            case 'kid':
                setname('Niños')
                break;
            case 'man':
                setname('Hombres')
                break;
            case 'woman':
                setname('Mujeres')
                break;
            default:
                break;
        }
    }, [products])

    return (
        <ShopLayout title={`Teslo-shop - ${gender}`} pageDescription={`Encuentra los mejores productos para ${gender}`}>
            <Typography variant='h1'>{name}</Typography>
            <Typography variant='h2' sx={{ marginBottom: 1 }}>Todos los productos</Typography>
            {
                isLoading
                    ? <FullScreenLoading />
                    : <ProductList products={products} />
            }
        </ShopLayout>
    )
}

export default GenderPage