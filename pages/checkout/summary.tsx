import { useContext, useState } from "react";
import { Card, Box, CardContent, Divider, Grid, Typography, Button, Link, Chip } from "@mui/material"
import { CardList, OrderSummary } from "../../src/components/cart"
import ShopLayout from "../../src/components/layouts/ShopLayout"
import NextLink from 'next/link';
import { CartContext } from "../../src/context";
import { getCountry } from "../../src/utils";
import { useRouter } from "next/router";

const SummaryPage = () => {
    const { numberOfItems, shippingAdrress, createOrder } = useContext(CartContext);
    const [isCreated, setIsCreated] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    const router = useRouter();

    if (!shippingAdrress?.firstName) return null

    const onCreateOrder = async () => {
        setIsCreated(true);
        const { hasError, message } = await createOrder();
        if (hasError) {
            setIsCreated(false);
            setErrorMessage(message);
            return
        }

        router.replace(`/orders/${message}`);
    }

    return (
        <ShopLayout title='Resumen - orden' pageDescription="Información del carrito de compras en su resumen">
            <Typography variant='h1' component='h1'>Resumen de la orden</Typography>
            <Grid container>
                <Grid item xs={12} sm={7}>
                    <CardList />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className="summary=card">
                        <CardContent>
                            <Typography variant='h2'>Resumen ({numberOfItems} {numberOfItems > 1 ? 'productos' : 'producto'})</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de envío</Typography>
                                <NextLink href='/checkout/address' passHref legacyBehavior>
                                    <Link display='flex' alignItems='center'>
                                        <Button>Editar</Button>
                                    </Link>
                                </NextLink>
                            </Box>

                            <Typography variant='subtitle1'>{`${shippingAdrress.firstName} ${shippingAdrress.lastName}`}</Typography>
                            <Typography variant='subtitle1'>{shippingAdrress.address} {shippingAdrress.address2}</Typography>
                            <Typography variant='subtitle1'>{getCountry(shippingAdrress.country)}</Typography>
                            <Typography variant='subtitle1'>{shippingAdrress.phone}</Typography>

                            <Divider sx={{ my: 1 }} />
                            <Box display='flex' justifyContent='end'>
                                <NextLink href='/cart' passHref legacyBehavior>
                                    <Link display='flex' alignItems='center'>
                                        <Button>Editar</Button>
                                    </Link>
                                </NextLink>
                            </Box>

                            <OrderSummary />

                            <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                                <Button onClick={onCreateOrder} color='secondary' className="circular-btn" fullWidth disabled={isCreated}>Confirmar orden</Button>
                                {errorMessage && <Chip label={errorMessage} color='error' sx={{ mt: 3 }} />}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

export default SummaryPage