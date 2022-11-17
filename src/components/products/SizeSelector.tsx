import { Box, Button } from "@mui/material";
import { ISize } from "../../interfaces";

interface Props {
    selectedSize?: ISize;
    sizes: ISize[];
    onSelectedSize: (size: ISize) => void;
}

export const SizeSelector = ({ selectedSize, sizes, onSelectedSize }: Props) => {
    return (
        <Box>
            {
                sizes.map((size) => (
                    <Button key={size} size='small' color={selectedSize === size ? 'primary' : 'info'}
                        onClick={() => onSelectedSize(size)}>
                        {size}
                    </Button>
                ))
            }
        </Box>
    )
}
