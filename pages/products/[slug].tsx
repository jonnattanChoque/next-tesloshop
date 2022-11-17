import React, { useState, useContext } from 'react'
import { GetStaticProps, GetStaticPaths } from 'next'
import { Button, Chip, Grid, Typography, Box } from '@mui/material';
import ShopLayout from '../../src/components/layouts/ShopLayout';
import { ProductSlideshow, SizeSelector } from '../../src/components/products';
import { ItemCounter } from '../../src/components/ui';
import { IProduct, ISize } from '../../src/interfaces';
import dbProducts from '../../src/db/products';
import { ICartProduct } from '../../src/interfaces/Cart';
import { CartContext } from '../../src/context';


interface Props {
    product: IProduct;
}

const ProductPage = ({ product }: Props) => {
    const { addProductToCart } = useContext(CartContext);

    const [tempCardProduct, setTempCardProduct] = useState<ICartProduct>({
        _id: product._id,
        images: product.images[0],
        price: product.price,
        sizes: undefined,
        slug: product.slug,
        title: product.title,
        gender: product.gender,
        quantity: 1
    });

    const onSelectedSize = (size: ISize) => {
        setTempCardProduct(currentProduct => ({
            ...currentProduct,
            sizes: size
        }))
    }

    const onQuantityChange = (quantity: number) => {
        setTempCardProduct(currentProduct => ({
            ...currentProduct,
            quantity
        }))
    }

    const onAddToCart = () => {
        addProductToCart(tempCardProduct);
    }

    return (
        <ShopLayout title={product.title} pageDescription={product.description}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={7}>
                    <ProductSlideshow images={product.images} />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Box display='flex' flexDirection='column'>
                        <Typography variant='h1' component='h1'>{product.title}</Typography>
                        <Typography variant='h1' component='h1'>{`$${product.price}`}</Typography>
                        <Box sx={{ my: 2 }}>
                            <Typography variant='subtitle2'>Cantidad</Typography>
                            <ItemCounter currentValue={tempCardProduct.quantity} maxValue={product.inStock} updateValue={(value) => onQuantityChange(value)} />
                            <SizeSelector sizes={product.sizes} selectedSize={tempCardProduct.sizes} onSelectedSize={onSelectedSize} />
                        </Box>

                        {
                            (product.inStock === 0)
                                ? <Chip label='No hay disponibles' color='error' variant='outlined' />
                                : <Button color='secondary' disabled={tempCardProduct.sizes === undefined}
                                    onClick={onAddToCart} className='circular-btn'>
                                    {tempCardProduct.sizes ? 'Agregar al carrito' : 'Selecciona una talla'}
                                </Button>
                        }
                        <Box sx={{ mt: 3 }}>
                            <Typography variant='subtitle2'>Descripción</Typography>
                            <Typography variant='body2'>{product.description}</Typography>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export const getStaticPaths: GetStaticPaths = async (ctx) => {
    const productSlugs = await dbProducts.getAllProductsSlug();
    const slugs = productSlugs.map(({ slug }) => ({
        params: { slug }
    }))

    return {
        paths: slugs,
        fallback: 'blocking',
    };
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug = '' } = ctx.params as { slug: string };
    const product = await dbProducts.getProductBySlug(slug);
    if (!product) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            product
        },
        revalidate: 186480
    };
}

export default ProductPage
