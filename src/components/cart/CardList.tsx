import { PrintDisabled } from '@mui/icons-material';
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material'
import NextLink from 'next/link';
import { useContext } from 'react';
import { CartContext } from '../../context';
import { IOrderItem } from '../../interfaces';
import { ICartProduct } from '../../interfaces/Cart';
import { ItemCounter } from '../ui';

interface Props {
    editabled?: boolean;
    products?: IOrderItem[]
}

export const CardList = ({ editabled = false, products }: Props) => {
    const { cart, updateCartQuantity, deleteProductCart } = useContext(CartContext);

    const onNewCartQuantity = (product: ICartProduct, newQuantity: number) => {
        product.quantity = newQuantity;
        updateCartQuantity(product);
    }

    const onDeleteProduct = (product: ICartProduct) => {
        deleteProductCart(product);
    }

    const productsItem = products ? products : cart;

    console.log(productsItem);

    return (
        <>
            {
                productsItem.map(product => (
                    <>
                        < Grid key={product._id ? product._id + product.sizes || '' : product.slug || '' + product.sizes || ''} spacing={2} sx={{ mb: 1 }} container>
                            <Grid item xs={3}>
                                <NextLink href={`/products/${product.slug}`} passHref legacyBehavior>
                                    <Link>
                                        {
                                            product.images!.includes('http')
                                                ? <CardMedia component='img' className='fadeIn' image={product.images} alt={product.slug} />
                                                : <CardMedia component='img' className='fadeIn' image={`/products/${product.images}`} alt={product.slug} />
                                        }
                                    </Link>
                                </NextLink>
                            </Grid>
                            <Grid item xs={7}>
                                <Box display='flex' flexDirection='column'>
                                    <Typography variant='body1'>{product.title}</Typography>
                                    <Typography variant='body1'>Talla: <strong>{product.sizes}</strong></Typography>
                                    {editabled ? <ItemCounter
                                        currentValue={product.quantity}
                                        updateValue={(value) => onNewCartQuantity(product as ICartProduct, value)}
                                        maxValue={10}
                                    /> : <Typography variant='h5'>{product.quantity} {product.quantity > 1 ? 'productos' : 'producto'}</Typography>}
                                </Box>
                            </Grid>
                            <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                                <Typography variant='subtitle1'>${product.price}</Typography>
                                {editabled && <Button variant='text' color='secondary' onClick={() => onDeleteProduct(product as ICartProduct)}>Eliminar</Button>}
                            </Grid>
                        </Grid>
                    </>
                ))
            }
        </>
    )
}
