import { Card, Box, CardContent, Divider, Grid, Typography, Button } from "@mui/material"
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { CardList, OrderSummary } from "../../src/components/cart"
import ShopLayout from "../../src/components/layouts/ShopLayout"
import { CartContext } from "../../src/context";


const CartPage = () => {
    const { cart, isLoaded, numberOfItems } = useContext(CartContext);
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && cart.length === 0) {
            router.replace('/cart/empty')
        }
    }, [isLoaded, cart, router])

    if (!isLoaded || cart.length === 0) return <></>

    return (
        <ShopLayout title={`Carrito - ${numberOfItems > 9 ? '+9' : numberOfItems} prod`} pageDescription="Información del carrito de compras">
            <Typography variant='h1' component='h1'>Carrito</Typography>
            <Grid container>
                <Grid item xs={12} sm={7}>
                    <CardList editabled />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className="summary=card">
                        <CardContent>
                            <Typography variant='h2'>Orden</Typography>
                            <Divider sx={{ my: 1 }} />
                            <OrderSummary />
                            <Box sx={{ mt: 3 }}>
                                <Button color='secondary' className="circular-btn" fullWidth href="/checkout/address">Checkout</Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default CartPage