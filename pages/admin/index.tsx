import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Grid, Box } from '@mui/material'
import { SummaryTile } from '../../src/components/admin'
import { DashboardSummaryResponse } from '../../src/interfaces'
import { AuthContext } from '../../src/context'
import AdminLayout from '../../src/components/layouts/AdminLayout'

import AttachMoneyOutlined from '@mui/icons-material/AttachMoneyOutlined'
import DashboardOutlined from '@mui/icons-material/DashboardOutlined'
import CreditCardOffOutlined from '@mui/icons-material/CreditCardOffOutlined'
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined'
import CancelPresentationOutlined from '@mui/icons-material/CancelPresentationOutlined'
import CategoryOutlined from '@mui/icons-material/CategoryOutlined'
import GroupOutlined from '@mui/icons-material/GroupOutlined'
import ProductionQuantityLimitsOutlined from '@mui/icons-material/ProductionQuantityLimitsOutlined'
import useSWR from 'swr'

const DashBoardPage = () => {
    const { user } = useContext(AuthContext);
    const router = useRouter();
    const [showPage, setShowPage] = useState(false)

    useEffect(() => {
        if (user !== undefined) {
            console.log(user)
            if (!user || user.role === 'client') {
                router.replace('/')
            } else {
                setShowPage(true)
            }
        }
    }, [user])

    //Se puede utulizar swr o el nextserverprops
    const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard', {
        refreshInterval: 86400
    })


    if (!error && !data) return <></>
    if (!showPage) return <></>
    if (error) return <div>Error al cargar la información</div>

    const {
        numberOfOrders,
        paidOrders,
        notPaidORders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory
    } = data!

    const reloadInfo = () => {
        router.reload();
    }

    return (
        <AdminLayout title={'Dashboard'} subtitle={'Estadísticas generales'} icon={<DashboardOutlined />}>
            {showPage &&
                <>
                    <Box>
                        <Button color='secondary' onClick={() => reloadInfo}>Recargar</Button>
                    </Box>
                    <Grid container spacing={2}>
                        <SummaryTile title={numberOfOrders} subtitle={'Ordenes totales'} icon={<CreditCardOutlined color='secondary' sx={{ fontSize: 40 }} />} redirect='/admin/orders' />
                        <SummaryTile title={paidOrders} subtitle={'Ordenes pagadas'} icon={<AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} />} />
                        <SummaryTile title={notPaidORders} subtitle={'Ordenes pendientes'} icon={<CreditCardOffOutlined color='primary' sx={{ fontSize: 40 }} />} />
                        <SummaryTile title={numberOfClients} subtitle={'Clientes'} icon={<GroupOutlined color='success' sx={{ fontSize: 40 }} />} redirect='/admin/users' />
                        <SummaryTile title={numberOfProducts} subtitle={'Productos'} icon={<CategoryOutlined color='warning' sx={{ fontSize: 40 }} />} redirect='/admin/products' />
                        <SummaryTile title={productsWithNoInventory} subtitle={'Sin existencias'} icon={<CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} />} />
                        <SummaryTile title={lowInventory} subtitle={'Bajo Inventario'} icon={<ProductionQuantityLimitsOutlined color='secondary' sx={{ fontSize: 40 }} />} />
                    </Grid></>
            }
        </AdminLayout>
    )
}

export default DashBoardPage