import ClearOutlined from "@mui/icons-material/ClearOutlined"
import SearchOutlined from "@mui/icons-material/SearchOutlined"
import ShoppingCartOutlined from "@mui/icons-material/ShoppingCartOutlined"
import { AppBar, Link, Typography, Toolbar, Button, Box, IconButton, Badge, Input, InputAdornment } from "@mui/material"
import NextLink from "next/link"
import { useRouter } from 'next/router'
import { CartContext, UIContext } from '../../context'
import { useContext, useState } from "react"

export const Navbar = () => {
    const { toggleSideMenu } = useContext(UIContext);
    const { numberOfItems } = useContext(CartContext);
    const { asPath, push } = useRouter()
    const [searchTerm, setSearchTerm] = useState('')
    const [isSearchVisible, setIsSearchVisible] = useState(false)

    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return;
        push(`/search/${searchTerm}`)
    }

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
                <Box className='fadeIn' sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'flex' } }}>
                    <NextLink href='/category/man' passHref legacyBehavior>
                        <Link display='flex' alignItems='center'>
                            <Button color={asPath === '/category/man' ? 'primary' : 'info'}>Hombres</Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/category/woman' passHref legacyBehavior>
                        <Link display='flex' alignItems='center'>
                            <Button color={asPath === '/category/woman' ? 'primary' : 'info'}>Mujeres</Button>
                        </Link>
                    </NextLink>
                    <NextLink href='/category/kid' passHref legacyBehavior>
                        <Link display='flex' alignItems='center'>
                            <Button color={asPath === '/category/kid' ? 'primary' : 'info'}>Niños</Button>
                        </Link>
                    </NextLink>
                </Box>
                <Box flex={1} />

                {
                    isSearchVisible
                        ?
                        <Input
                            sx={{ display: { xs: 'none', sm: 'flex' } }}
                            className='fadeIn'
                            autoFocus
                            type='text'
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onSearchTerm()}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setIsSearchVisible(false)} >
                                        <ClearOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        :
                        <IconButton sx={{ display: { xs: 'none', sm: 'flex' } }}
                            className='fadeIn' onClick={() => setIsSearchVisible(true)}>
                            <SearchOutlined />
                        </IconButton>
                }

                <IconButton sx={{ display: { xs: 'flex', sm: 'none' } }}
                    onClick={toggleSideMenu}>
                    <SearchOutlined />
                </IconButton>
                <NextLink href='/cart' passHref legacyBehavior>
                    <Link display='flex' alignItems='center'>
                        <IconButton>
                            <Badge badgeContent={numberOfItems > 9 ? '+9' : numberOfItems} color='secondary' >
                                <ShoppingCartOutlined />
                            </Badge>
                        </IconButton>
                    </Link>
                </NextLink>
                <Button onClick={toggleSideMenu}>Menú</Button>
            </Toolbar>
        </AppBar>
    )
}