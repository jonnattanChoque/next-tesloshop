import { Card, Box, CardContent, Divider, Grid, Typography, Chip } from "@mui/material"
import { CardList, OrderSummary } from "../../src/components/cart"
import ShopLayout from "../../src/components/layouts/ShopLayout"
import { CreditCardOffOutlined, CreditScoreOutlined } from "@mui/icons-material";
import { GetServerSideProps } from 'next'
import { getCountry, jwt } from "../../src/utils";
import dbOrders from "../../src/db/orders";
import { useContext, useEffect } from 'react'
import { AuthContext } from "../../src/context";
import { useRouter } from "next/router";
import { IOrder } from "../../src/interfaces";

interface Props {
    order: IOrder
}

const OrderPage = ({ order }: Props) => {
    const router = useRouter();
    const { user } = useContext(AuthContext);
    useEffect(() => {
        if (user?._id !== undefined) {
            if (user?._id !== order.user) {
                router.push('/orders/history' + user?._id);
            }
        }

    }, [order, user]);


    return (
        <ShopLayout title='Resumen - orden 123' pageDescription="Información del carrito de compras en su resumen">
            <Typography variant='h1' component='h1'>Orden 123</Typography>

            {
                order.isPaid
                    ? <Chip label="Pagada" variant='outlined' color='success' sx={{ my: 2 }} icon={<CreditScoreOutlined />} />
                    : <Chip label="Pendiente" variant='outlined' color='error' sx={{ my: 2 }} icon={<CreditCardOffOutlined />} />
            }

            <Grid container>
                <Grid item xs={12} sm={7}>
                    <CardList editabled={false} products={order.orderItems} />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className="summary=card">
                        <CardContent>
                            <Typography variant='h2'>Resumen ({order.numberOfItems} {order.numberOfItems > 1 ? 'productos' : 'producto'})</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Typography variant='subtitle1'>{`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}</Typography>
                            <Typography variant='subtitle1'>{order.shippingAddress.address} {order.shippingAddress.address2}</Typography>
                            <Typography variant='subtitle1'>{getCountry(order.shippingAddress.country)}</Typography>
                            <Typography variant='subtitle1'>{order.shippingAddress.phone}</Typography>

                            <Divider sx={{ my: 1 }} />

                            <OrderSummary
                                numberOfItemsOrder={order.numberOfItems}
                                subTotalOrder={order.subtotal}
                                taxOrder={order.tax}
                                totalOrder={order.total}
                            />

                            <Box sx={{ mt: 3 }} display='flex' flexDirection='column'>
                                {
                                    order.isPaid
                                        ? <Chip label="Orden pagada" variant='outlined' color='success' sx={{ my: 2 }} icon={<CreditScoreOutlined />} />
                                        : <h1>Pagar orden</h1>
                                }
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time


export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const { id = '' } = query

    const { tokenAuth = '' } = req.cookies;
    let isValidToken = false;

    try {
        await jwt.verifyToken(tokenAuth);
        isValidToken = true;
    } catch (error) {
        isValidToken = false;
    }

    if (!isValidToken) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${id}`,
                permanent: false
            }
        }
    }
    const order = await dbOrders.getOrderById(id.toString());
    if (!order) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false
            }
        }
    }

    return {
        props: {
            order
        }
    }
}

export default OrderPage