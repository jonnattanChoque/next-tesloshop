import React, { useState, useContext } from 'react'
import NextLink from 'next/link'
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material'
import { AuthLayout } from '../../src/components/layouts';
import { useForm } from 'react-hook-form';
import { validations } from '../../src/utils';
import { AuthContext } from '../../src/context';
import { useRouter } from 'next/router';

type FormData = {
    email: string,
    password: string
}

const LoginPage = () => {
    const { loginUser } = useContext(AuthContext)
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false)

    const onLogin = async ({ email, password }: FormData) => {
        const isValidLogin = await loginUser(email, password);

        if (!isValidLogin) {
            setShowError(true);
            setTimeout(() => {
                setShowError(false);
            }, 2000);
            return;
        }

        const destination = router.query.p?.toString() || '/';
        router.replace(destination)
    }

    return (
        <AuthLayout title={'Ingresar'}>
            <form onSubmit={handleSubmit(onLogin)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1'>Iniciar Sesión</Typography>
                        </Grid>
                        {showError && <Chip label='Correo o contraseña invalidos' color='error' className='fadeIn' icon={<ErrorOutline />} />}
                        <Grid item xs={12}>
                            <TextField label='correo' type='email' variant='filled' fullWidth
                                {...register('email', {
                                    required: 'Este campo es obligatorio',
                                    validate: validations.isEmail
                                })}
                                error={!!errors.email} helperText={errors.email?.message} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField label='contraseña' type='password' variant='filled' fullWidth
                                {...register('password', {
                                    required: 'Este campo es obligatorio',
                                    minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
                                })}
                                error={!!errors.password} helperText={errors.password?.message} />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type='submit' color='secondary' className='circular-btn' size='large' fullWidth>Ingresar</Button>
                        </Grid>
                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <NextLink href={router.query.p ? `/auth/register?p=${router.query.p}` : '/auth/register'} passHref legacyBehavior>
                                <Link underline='always'>No tienes cuenta?</Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export default LoginPage