
import { AppBar, Link, Typography, Toolbar, Button, Box } from "@mui/material"
import NextLink from "next/link"
import { useRouter } from 'next/router'
import { UIContext } from '../../context'
import { useContext } from "react"

export const AdminNavbar = () => {
    const { toggleSideMenu } = useContext(UIContext);

    return (
        <AppBar>
            <Toolbar>
                <NextLink href='/' passHref legacyBehavior>
                    <Link display='flex' alignItems='center'>
                        <Typography variant='h6'>Teslo |</Typography>
                        <Typography sx={{ marginLeft: 0.5 }}>Shop</Typography>
                    </Link>
                </NextLink>
                <Box flex={1} />

                <Button onClick={toggleSideMenu}>Menú</Button>
            </Toolbar>
        </AppBar>
    )
}