import React, { useState } from 'react'
import { Box, Card, CardActionArea, CardMedia, Chip, Grid, Link, Typography } from "@mui/material";
import NextLink from 'next/link';
import { IProduct } from '../../interfaces';

interface Props {
    product: IProduct;
}

export const ProductCard = ({ product }: Props) => {
    const [isHovered, setIsHovered] = useState(false);
    const [onloadImage, setOnloadImage] = useState(false)

    return (
        <Grid item xs={6} sm={4} key={product.slug}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Card>
                <NextLink href={`/products/${product.slug}`} passHref legacyBehavior prefetch={false}>
                    <Link underline="none">
                        <CardActionArea>
                            {
                                (product.inStock === 0) && (
                                    <Chip color='primary' label='No dispooble'
                                        sx={{ position: 'absolute', zIndex: 99, top: '10px', left: '10px' }} />
                                )
                            }
                            <CardMedia className='fadeIn' component='img' alt={product.slug}
                                image={isHovered
                                    ? product.images[1].includes('http') ? product.images[1] : `/products/${product.images[1]}`
                                    : product.images[0].includes('http') ? product.images[1] : `/products/${product.images[0]}`
                                }
                                onLoad={() => setOnloadImage(true)} />
                        </CardActionArea>
                    </Link>
                </NextLink>
            </Card>

            <Box sx={{ mt: 1, display: onloadImage ? 'block' : 'none' }} className='fadeIn'>
                <Typography fontWeight={700}>{product.title}</Typography>
                <Typography fontWeight={500}>{`$${product.price}`}</Typography>
            </Box>
        </Grid>
    )
}
