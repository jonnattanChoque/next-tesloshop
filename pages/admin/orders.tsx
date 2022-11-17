import { PeopleOutline } from '@mui/icons-material'
import { Chip, Grid } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import useSWR from 'swr'
import AdminLayout from '../../src/components/layouts/AdminLayout'
import { AuthContext } from '../../src/context'
import { IOrder, IUser } from '../../src/interfaces'

const columns: GridColDef[] = [
    { field: 'id', headerName: 'Order ID', width: 250 },
    { field: 'email', headerName: 'Correo', width: 200 },
    { field: 'name', headerName: 'Nombre', width: 250 },
    { field: 'total', headerName: 'Monto total', width: 200 },
    {
        field: 'isPaid', headerName: 'Es pagado', width: 200,
        renderCell: ({ row }: GridRenderCellParams) => {
            return row.isPaid
                ? <Chip label='Pagado' color='success' variant='outlined' />
                : <Chip label='No pagado' color='error' variant='outlined' />
        }
    },
    { field: 'inStock', headerName: 'N. Productos', width: 100, align: 'center' },
    {
        field: 'check', headerName: 'Ver orden', width: 200,
        renderCell: ({ row }: GridRenderCellParams) => {
            return (
                <a href={`/admin/order/${row.id}`} target='_blank' rel='noreferrer'>Ver orden</a>
            )
        }
    },
]

const OrdersPage = () => {
    const { user } = useContext(AuthContext);
    const router = useRouter();
    const [showPage, setShowPage] = useState(false);

    useEffect(() => {
        if (user !== undefined) {
            if (!user || user.role === 'client') {
                router.replace('/')
            } else {
                setShowPage(true)
            }
        }
    }, [user])

    const { data, error } = useSWR<IOrder[]>('/api/admin/orders')
    if (!error && !data) return <></>
    if (!showPage) return <></>
    if (error) return <div>Error al cargar la información</div>
    console.log(data)
    const rows = data!.map((order) => ({
        id: order._id,
        email: (order.user as IUser)?.email,
        name: (order.user as IUser)?.name,
        total: order.total,
        isPaid: order.isPaid,
        inStock: order.numberOfItems,
    }));

    return (
        <AdminLayout title={`Ordenes (${data?.length})`} subtitle={'Mantenimiento de ordenes'} icon={<PeopleOutline />}>
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
        </AdminLayout>
    )
}

export default OrdersPage