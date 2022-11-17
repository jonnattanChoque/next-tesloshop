import React, { useState, useContext } from 'react'
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material'
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import { AuthLayout } from '../../src/components/layouts';
import NextLink from 'next/link'
import { validations } from '../../src/utils';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../src/context';
import { useRouter } from 'next/router';

type FormData = {
    email: string,
    password: string,
    name: string
}

const RegisterPage = () => {
    const { registerUser } = useContext(AuthContext)
    const router = useRouter();
    const [showError, setShowError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const onRegister = async (dataRegister: FormData) => {
        const { hasError, message } = await registerUser(dataRegister.name, dataRegister.email, dataRegister.password);

        if (hasError) {
            setErrorMessage(message || 'Error al crear usuario')
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
        <AuthLayout title={'Registro'}>
            <form onSubmit={handleSubmit(onRegister)} noValidate>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography variant='h1' component='h1'>Crear cuenta</Typography>
                        </Grid>
                        {showError && <Chip label={errorMessage} color='error' className='fadeIn' icon={<ErrorOutline />} />}
                        <Grid item xs={12}>
                            <TextField label='nombre' variant='filled' fullWidth
                                {...register('name', {
                                    required: 'Este campo es obligatorio'
                                })}
                                error={!!errors.name} helperText={errors.name?.message} />
                        </Grid>
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
                            <NextLink href={router.query.p ? `/auth/login?p=${router.query.p}` : '/auth/login'} passHref legacyBehavior>
                                <Link underline='always'>Ya tienes cuenta?</Link>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export default RegisterPage