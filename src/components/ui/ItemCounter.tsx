import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useState } from 'react';

interface Props {
    currentValue: number;
    updateValue: (newValue: number) => void;
    maxValue: number;
}

export const ItemCounter = ({ currentValue, updateValue, maxValue }: Props) => {

    const add = () => {
        if (currentValue < maxValue) {
            updateValue(currentValue + 1);
        }
    }

    const remove = () => {
        if (currentValue > 1) {
            updateValue(currentValue - 1);
        }
    }

    return (
        <Box display='flex' alignItems='center'>
            <IconButton disabled={currentValue <= 1} onClick={remove}>
                <RemoveCircleOutline />
            </IconButton>
            <Typography sx={{ width: 40, textAlign: 'center' }}>{currentValue}</Typography>
            <IconButton disabled={currentValue >= maxValue} onClick={add}>
                <AddCircleOutline />
            </IconButton>
        </Box>
    )
}
