import { Typography } from '@mui/material'
import { GetServerSideProps } from 'next'
import React from 'react'
import ShopLayout from '../src/components/layouts/ShopLayout'
import ProductList from '../src/components/products/ProductList'
import dbProducts from '../src/db/products'
import { IProduct } from '../src/interfaces'

interface Props {
  products: IProduct[]
}

const HomePage = ({ products }: Props) => {

  return (
    <ShopLayout title={'Teslo-shop - home'} pageDescription={'Encuentra los mejores productos'}>
      <Typography variant='h1'>Tienda</Typography>
      <Typography variant='h2' sx={{ marginBottom: 1 }}>Todos los productos</Typography>
      <ProductList products={products} />
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const products = await dbProducts.getAllProducts();
  return {
    props: {
      products
    }
  }
}

export default HomePage