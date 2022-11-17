import { Box, Button, FormControl, Grid, MenuItem, Select, TextField, Typography } from '@mui/material'
import React, { useEffect, useState, useContext } from 'react'
import ShopLayout from '../../src/components/layouts/ShopLayout'
import { countries } from '../../src/utils'
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { CartContext } from '../../src/context';

type FormData = {
    firstName: string
    lastName: string
    address: string
    address2: string
    country: string
    phone: string
}

const getInfoAddress = (): FormData => {
    const cookies = Cookies.get('address');
    if (cookies) {
        const infoParse: FormData = JSON.parse(cookies);
        const address = {
            firstName: infoParse.lastName || '',
            lastName: infoParse.lastName || '',
            address: infoParse.address || '',
            address2: infoParse.address2 || '',
            country: infoParse.country || '',
            phone: infoParse.phone || '',
        }
        return address;
    } else {
        return {
            firstName: '',
            lastName: '',
            address: '',
            address2: '',
            country: '',
            phone: '',
        }
    }

}

const AddressPage = () => {
    const { updateAddress } = useContext(CartContext)
    const [hidrated, setHidrated] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ defaultValues: getInfoAddress() });

    const router = useRouter();

    const onLogin = async (dataForm: FormData) => {
        Cookies.set('address', JSON.stringify(dataForm));
        updateAddress(dataForm);
        router.push('/checkout/summary');
    }

    useEffect(() => {
        setHidrated(true);
    }, []);

    return (
        <ShopLayout title={'Dirección'} pageDescription={'Confirmar dirección del destino'}>
            {
                hidrated && (
                    <form onSubmit={handleSubmit(onLogin)} noValidate>
                        <Typography variant='h1' component='h1'>Dirección</Typography>
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label='Nombre' variant='filled'
                                    {...register('firstName', {
                                        required: 'Este campo es obligatorio',
                                    })}
                                    error={!!errors.firstName} helperText={errors.firstName?.message} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label='Apellido' variant='filled'
                                    {...register('lastName', {
                                        required: 'Este campo es obligatorio',
                                    })}
                                    error={!!errors.lastName} helperText={errors.lastName?.message} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label='Dirección' variant='filled'
                                    {...register('address', {
                                        required: 'Este campo es obligatorio',
                                    })}
                                    error={!!errors.address} helperText={errors.address?.message} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label='Dirección alterna' variant='filled'
                                    {...register('address2')} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant='filled'>
                                    <TextField
                                        defaultValue={getInfoAddress().country}
                                        select variant='filled' label='País'
                                        {...register('country', {
                                            required: 'Este campo es obligatorio',
                                        })}
                                        error={!!errors.country}
                                    >
                                        {
                                            countries.map((country, index) => (
                                                <MenuItem key={index} value={country.code}>{country.name}</MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField fullWidth label='Teléfono' variant='filled'
                                    {...register('phone', {
                                        required: 'Este campo es obligatorio',
                                    })}
                                    error={!!errors.phone} helperText={errors.phone?.message} />
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
                            <Button type='submit' color='secondary' className='circular-btn' size='large'>Revisar pedido</Button>
                        </Box>
                    </form>
                )
            }
        </ShopLayout>
    )
}

//Asi se usaba antes del middleware

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//     const { tokenAuth = '' } = req.cookies;
//     let isValidToken = false;

//     try {
//         await jwt.verifyToken(tokenAuth);
//         isValidToken = true;
//     } catch (error) {
//         isValidToken = false;
//     }

//     if (!isValidToken) {
//         return {
//             redirect: {
//                 destination: '/auth/login?p=/checkout/address',
//                 permanent: false
//             }
//         }
//     }

//     return {
//         props: {

//         }
//     }
// }

export default AddressPage