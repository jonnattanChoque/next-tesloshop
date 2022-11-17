import React, { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../src/components/layouts/AdminLayout'
import PeopleOutline from '@mui/icons-material/PeopleOutline'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import useSWR from 'swr'
import { AuthContext } from '../../src/context'
import { Grid, MenuItem, Select } from '@mui/material'
import { globalApi } from '../../src/api'
import { IUser } from '../../src/interfaces'

const UsersPage = () => {
    const { user } = useContext(AuthContext);
    const router = useRouter();
    const [showPage, setShowPage] = useState(false);
    const [users, setUsers] = useState<IUser[]>([])

    const onRoleUpdate = async (id: string, newRole: string) => {
        const updated = users.map(usr => ({
            ...usr,
            role: id === usr._id ? newRole : usr.role
        }));
        setUsers(updated);

        try {
            await globalApi.put(`/admin/users/`, { userId: id, role: newRole })
        } catch (error) {
            alert('erorors')
        }
    }

    const { data, error } = useSWR('/api/admin/users')

    useEffect(() => {
        if (user !== undefined) {
            console.log(user)
            if (!user || user.role === 'client') {
                router.replace('/')
            } else {
                if (data) {
                    setUsers(data)
                }
                setShowPage(true)
            }
        }
    }, [user, data])

    if (!error && !data) return <></>
    if (!showPage) return <></>
    if (error) return <div>Error al cargar la información</div>

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Correo', width: 450 },
        { field: 'name', headerName: 'Nombre', width: 450 },
        {
            field: 'role',
            headerName: 'Rol',
            width: 600,
            renderCell: ({ row }: GridRenderCellParams) => {
                return (
                    <Select value={row.role} label='Rol' sx={{ width: '470px' }}
                        onChange={(event) => onRoleUpdate(row.id, event.target.value)} >
                        <MenuItem value="admin">Administrador</MenuItem>
                        <MenuItem value="client">Cliente</MenuItem>
                    </Select >
                )
            }
        },
    ]

    const rows = users.map((user) => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
    }));

    return (
        <AdminLayout title={`Usuarios (${data?.length})`} subtitle={'Mantenimiento de usuarios'} icon={<PeopleOutline />}>
            {
                rows.length > 0
                    ? <Grid container className='fadeIn'>
                        <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                            <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[10]} autoHeight />
                        </Grid>
                    </Grid>
                    :
                    <>
                        <h2>No tiene pedidos</h2>
                    </>
            }
        </AdminLayout>
    )
}

export default UsersPage