import React from 'react'
import NextLink from 'next/link'
import { Chip, Divider, Grid, Link, Typography } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import ShopLayout from '../../../src/components/layouts/ShopLayout'
import { GetServerSideProps } from 'next'
import dbOrders from '../../../src/db/orders'
import { IOrder } from '../../../src/interfaces'

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'fullname', headerName: 'First name', width: 300 },
    {
        field: 'paid',
        headerName: 'Pagada',
        description: 'Muestra si la orden ha sido pagada',
        width: 300,
        renderCell: (params) => {
            return params.row.paid
                ? <Chip color='success' label='Pagada' variant='outlined' />
                : <Chip color='error' label='No pagada' variant='outlined' />

        }
    },
    {
        field: 'order', headerName: '# Orden',
        sortable: false,
        renderCell: (params) => {
            return <NextLink href={`/orders/${params.row.order}`} passHref legacyBehavior>
                <Link underline='always'>Ver orden</Link>
            </NextLink>

        }
    },
]

interface Props {
    orders: IOrder[]
}
const HistoryPage = ({ orders }: Props) => {
    const rows = orders.map((order, idx) => ({
        id: idx + 1,
        fullname: order.shippingAddress.firstName + ' ' + order.shippingAddress.lastName,
        paid: order.isPaid,
        order: order._id
    }));

    return (
        <ShopLayout title={'Historial de ordenes'} pageDescription={'Historial de ordenes'} >
            <Typography variant='h1' component='h1'>Historial de ordenes</Typography>
            <Divider />
            {
                rows.length > 0
                    ? <Grid container className='fadeIn'>
                        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                            <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} autoHeight />
                        </Grid>
                    </Grid>
                    :
                    <>
                        <h2>No tiene pedidos</h2>
                    </>
            }
        </ShopLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const { id = '' } = query

    if (!id) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false
            }
        }
    }

    const orders = await dbOrders.getAllOrdersByUser(id.toString());
    if (!orders) {
        return {
            redirect: {
                destination: `/orders/history`,
                permanent: false
            }
        }
    }

    return {
        props: {
            orders
        }
    }
}

export default HistoryPage