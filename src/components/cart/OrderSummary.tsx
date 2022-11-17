import { Divider, Grid, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { CartContext } from '../../context'
import { currency } from '../../utils'


interface Props {
    numberOfItemsOrder?: number;
    subTotalOrder?: number;
    taxOrder?: number;
    totalOrder?: number;
}

export const OrderSummary = ({ numberOfItemsOrder, subTotalOrder, taxOrder, totalOrder }: Props) => {
    const { numberOfItems, subTotal, total, tax } = useContext(CartContext);

    const numberOfItemsOrderValue = numberOfItemsOrder ? numberOfItemsOrder : numberOfItems;
    const subtotalValue = subTotalOrder ? subTotalOrder : subTotal;
    const taxValue = taxOrder ? taxOrder : tax;
    const totalValue = totalOrder ? totalOrder : total;

    return (
        <Grid container>
            <Grid item xs={6}>
                <Typography># productos.</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{numberOfItemsOrderValue} {numberOfItemsOrderValue > 1 ? 'productos' : 'producto'}</Typography>
            </Grid>
            <Grid item xs={6} display='flex'>
                <Typography>Subtotal.</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{currency.format(subtotalValue)}</Typography>
            </Grid>

            <Grid item xs={6} display='flex'>
                <Typography>Impuestos {Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100}%.</Typography>
            </Grid>
            <Grid item xs={6} display='flex' justifyContent='end'>
                <Typography>{currency.format(taxValue)}</Typography>
            </Grid>
            <Grid item xs={6} display='flex' sx={{ mt: 2 }}>
                <Typography variant='subtitle1'>Total.</Typography>
            </Grid>
            <Grid item xs={6} display='flex' sx={{ mt: 2 }} justifyContent='end'>
                <Typography variant='subtitle1'>{currency.format(totalValue)}</Typography>
            </Grid>
        </Grid>
    )
}
