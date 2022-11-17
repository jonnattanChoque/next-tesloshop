import CategoryOutlined from '@mui/icons-material/CategoryOutlined'
import NextLink from 'next/link'
import { Box, Button, CardMedia, Grid, Link } from '@mui/material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import useSWR from 'swr'
import AdminLayout from '../../src/components/layouts/AdminLayout'
import { AuthContext } from '../../src/context'
import { IProduct } from '../../src/interfaces'
import { AddOutlined } from '@mui/icons-material'


const columns: GridColDef[] = [
    {
        field: 'img', headerName: 'Foto',
        renderCell: (params: GridRenderCellParams) => (
            <a href={`/products/${params.row.slug}`} target="_blank" rel='noreferrer'>
                {
                    params.row.img.includes('http')
                        ? <CardMedia component='img' className='fadeIn' image={params.row.img} alt={params.row.slug} />
                        : <CardMedia component='img' className='fadeIn' image={`/products/${params.row.img}`} alt={params.row.slug} />
                }
            </a>
        )
    },
    {
        field: 'title', headerName: 'Título', width: 400,
        renderCell: (params: GridRenderCellParams) => (
            <NextLink href={`/admin/product/${params.row.slug}`} color='primary' passHref legacyBehavior>
                <Link color='primary' underline='always'>{params.row.title}</Link>
            </NextLink>
        )
    },
    { field: 'gender', headerName: 'Genero', width: 200 },
    { field: 'type', headerName: 'Tipo', width: 200 },
    { field: 'inStock', headerName: 'Cantidad', width: 100 },
    { field: 'price', headerName: 'Precio', width: 100 },
    { field: 'sizes', headerName: 'Tallas', width: 200 },
]

const ProductsPage = () => {
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

    const { data, error } = useSWR<IProduct[]>('/api/admin/products')
    if (!error && !data) return <></>
    if (!showPage) return <></>
    if (error) return <div>Error al cargar la información</div>

    const rows = data!.map((product) => ({
        id: product._id,
        img: product.images[0],
        title: product.title,
        gender: product.gender,
        type: product.type,
        inStock: product.inStock,
        price: product.price,
        sizes: product.sizes.join(', '),
        slug: product.slug
    }));

    return (
        <AdminLayout title={`Productos (${data?.length})`} subtitle={'Mantenimiento de productos'} icon={<CategoryOutlined />}>
            {
                rows.length > 0
                    ?
                    <>
                        <Box display='flex' justifyContent='end' sx={{ mb: 2 }}>
                            <Button startIcon={<AddOutlined />} color='secondary' href='/admin/product/new' />
                        </Box>
                        <Grid container className='fadeIn'>
                            <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                                <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} autoHeight />
                            </Grid>
                        </Grid>
                    </>
                    :
                    <>
                        <h2>No tiene pedidos</h2>
                    </>
            }
        </AdminLayout>
    )
}

export default ProductsPage