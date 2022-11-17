
import { Grid } from "@mui/material";
import { IProduct } from "../../interfaces";
import { ProductCard } from "./ProductCard";

interface Props {
    products: IProduct[];
}

const ProductList = ({ products }: Props) => {

    return (
        <Grid container spacing={4}>
            {
                products.map(product => (
                    <ProductCard product={product} key={product.slug} />
                ))
            }
        </Grid>
    )
}

export default ProductList