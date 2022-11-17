import { Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'
import ShopLayout from '../src/components/layouts/ShopLayout'

function Custom404() {
    return (
        <ShopLayout title='page not found' pageDescription='No hay nada que mostrar'>
            <Box display='flex' sx={{ flexDirection: { xs: 'column', sm: 'row' } }} justifyContent='center' alignItems='center' height='calc(100vh - 200px)' >
                <Typography variant='h1' component='h1' fontSize={80} fontWeight={150}>400 |</Typography>
                <Typography marginLeft={2}>No encontramos páginas</Typography>
            </Box>
        </ShopLayout>
    )
}

export default Custom404