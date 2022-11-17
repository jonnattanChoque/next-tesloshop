import React from 'react'
import { Grid, Card, CardContent, Typography } from '@mui/material';
import { useRouter } from 'next/router';

interface Props {
    title: number;
    subtitle: string;
    icon: JSX.Element;
    redirect?: string;
}

export const SummaryTile = ({ title, subtitle, icon, redirect = '' }: Props) => {
    const router = useRouter()

    const navigateTo = (path: string) => {
        if (path !== '') {
            router.push(path)
        }
    }

    return (
        <Grid item xs={12} sm={4} md={3}>
            <Card sx={{ display: 'flex', cursor: redirect.length > 0 ? 'pointer' : 'normal' }} onClick={() => navigateTo(redirect)}>
                <CardContent sx={{ width: 50, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {icon}
                </CardContent>
                <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='h3'>{title}</Typography>
                    <Typography variant='h6'>{subtitle}</Typography>
                </CardContent>
            </Card>
        </Grid>
    )
}