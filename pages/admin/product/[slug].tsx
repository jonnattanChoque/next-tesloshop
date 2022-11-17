import React, { useEffect, useState, useContext, useRef, ChangeEvent } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, ListItem, Paper, Radio, RadioGroup, TextField } from '@mui/material';
import AdminLayout from '../../../src/components/layouts/AdminLayout';
import { IGender, IProduct, ISize, IType } from '../../../src/interfaces';
import dbProducts from '../../../src/db/products';
import { useForm } from 'react-hook-form'
import { AuthContext } from '../../../src/context';
import { globalApi } from '../../../src/api';
import { ProductModel } from '../../../src/models';


const validTypes = ['shirts', 'pants', 'hoodies', 'hats']
const validGender = ['men', 'women', 'kid', 'unisex']
const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']

interface FormData {
    _id?: string;
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: string[];
    slug: string;
    tags: string[];
    title: string;
    type: string;
    gender: 'men' | 'women' | 'kid' | 'unisex'
}

interface Props {
    product: IProduct;
}

const ProductAdminPage = ({ product }: Props) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { user } = useContext(AuthContext);
    const [newTagValue, setNewTagValue] = useState('');
    const [showPage, setShowPage] = useState(false);
    const [isSaving, setisSaving] = useState(false)
    const router = useRouter();

    const { register, handleSubmit, formState: { errors }, getValues, setValue, watch } = useForm({
        defaultValues: product
    })

    useEffect(() => {
        if (user !== undefined) {
            if (!user || user.role === 'client') {
                router.replace('/')
            } else {
                setShowPage(true)
            }
        }
        const subscription = watch((value, { name, type }) => {
            if (name === 'title') {
                const newSlug = value.title?.trim()
                    .replaceAll(' ', '_')
                    .replaceAll("'", '')
                    .toLocaleLowerCase() || '';

                setValue('slug', newSlug);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch, user])

    const onNewTag = () => {
        const newTag = newTagValue.trim().toLocaleLowerCase();
        setNewTagValue('');
        const currentTags = getValues('tags');

        if (currentTags.includes(newTag)) return;
        currentTags.push(newTag);
    }

    const onDeleteTag = (tag: string) => {
        const currentTags = getValues('tags').filter((t: string) => t !== tag);
        setValue('tags', currentTags, { shouldValidate: true });
    }

    const onDeleteImage = (image: string) => {
        setValue('images', getValues('images').filter((i: string) => i !== image), { shouldValidate: true });
    }

    const onChangeSize = (size: ISize) => {
        const currentSizes = getValues('sizes');
        if (currentSizes.includes(size)) {
            return setValue('sizes', currentSizes.filter(s => s !== size), { shouldValidate: true })
        }
        setValue('sizes', [...currentSizes, size], { shouldValidate: true })
    }

    const onFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;

        try {
            for (const file of event.target.files) {
                const formData = new FormData();
                formData.append('file', file);
                const { data } = await globalApi.post('/admin/upload', formData)
                setValue('images', [...getValues('images'), data.message], { shouldValidate: true })
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onHandleSubmit = async (form: FormData) => {
        if (form.images.length < 2) return alert('Please add two images');
        setisSaving(true);

        try {
            const { data } = await globalApi({
                url: '/admin/products',
                method: form._id ? 'PUT' : 'POST',
                data: form
            })
            console.log(data);

            if (!form._id) {
                router.replace(`/admin/product/${data.slug}`)
            } else {
                setisSaving(false);
            }

        } catch (error) {
            console.log(error);
        }

    }

    if (!showPage) return <></>

    return (
        <AdminLayout title={'Producto'} subtitle={`Editando: ${product.title}`} icon={<DriveFileRenameOutline />}>
            <form onSubmit={handleSubmit(onHandleSubmit)}>
                <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
                    <Button disabled={isSaving} color="secondary" startIcon={<SaveOutlined />} sx={{ width: '150px' }} type="submit"> Guardar</Button>
                </Box>

                <Grid container spacing={2}>
                    {/* Data */}
                    <Grid item xs={12} sm={6}>
                        <TextField label="Título" variant="filled" fullWidth sx={{ mb: 1 }}
                            {...register('title', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'Mínimo 2 caracteres' }
                            })}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                        />

                        <TextField label="Descripción" variant="filled" fullWidth sx={{ mb: 1 }}
                            {...register('description', {
                                required: 'Este campo es requerido'
                            })}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />

                        <TextField label="Inventario" type='number' variant="filled" fullWidth sx={{ mb: 1 }}
                            {...register('inStock', {
                                required: 'Este campo es requerido',
                                min: { value: 0, message: 'Mínimo 0' }
                            })}
                            error={!!errors.inStock}
                            helperText={errors.inStock?.message}
                        />

                        <TextField label="Precio" type='number' variant="filled" fullWidth sx={{ mb: 1 }}
                            {...register('price', {
                                required: 'Este campo es requerido',
                                min: { value: 0, message: 'Mínimo 0' }
                            })}
                            error={!!errors.price}
                            helperText={errors.price?.message}
                        />

                        <Divider sx={{ my: 1 }} />

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Tipo</FormLabel>
                            <RadioGroup
                                row
                                value={getValues('type')}
                                onChange={(e) => setValue('type', e.target.value as IType, { shouldValidate: true })}
                            >
                                {
                                    validTypes.map(option => (
                                        <FormControlLabel
                                            key={option}
                                            value={option}
                                            control={<Radio color='secondary' />}
                                            label={capitalize(option)}
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Género</FormLabel>
                            <RadioGroup
                                row
                                value={getValues('gender')}
                                onChange={(e) => setValue('gender', e.target.value as IGender, { shouldValidate: true })}
                            >
                                {
                                    validGender.map(option => (
                                        <FormControlLabel
                                            key={option}
                                            value={option}
                                            control={<Radio color='secondary' />}
                                            label={capitalize(option)}
                                        />
                                    ))
                                }
                            </RadioGroup>
                        </FormControl>

                        <FormGroup>
                            <FormLabel>Tallas</FormLabel>
                            {
                                validSizes.map(size => (
                                    <FormControlLabel key={size} control={<Checkbox checked={getValues('sizes').includes(size as ISize)} />}
                                        label={size} onChange={() => onChangeSize(size as ISize)} />
                                ))
                            }
                        </FormGroup>

                    </Grid>

                    {/* Tags e imagenes */}
                    <Grid item xs={12} sm={6}>
                        <TextField label="Slug - URL" variant="filled" fullWidth sx={{ mb: 1 }}
                            {...register('slug', {
                                required: 'Este campo es requerido',
                                validate: (val) => val.trim().includes(' ') ? 'No puede contener espacios' : undefined
                            })}
                            error={!!errors.slug}
                            helperText={errors.slug?.message}
                        />

                        <TextField label="Etiquetas" variant="filled" fullWidth sx={{ mb: 1 }} helperText="Presiona [spacebar] para agregar"
                            value={newTagValue} onChange={(e) => setNewTagValue(e.target.value)} onKeyUp={({ code }) => code === 'Space' ? onNewTag() : undefined}
                        />

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', listStyle: 'none', p: 0, m: 0, }}
                            component="ul">
                            {
                                getValues('tags').map((tag) => {
                                    return (
                                        <Chip key={tag} label={tag} onDelete={() => onDeleteTag(tag)} color="primary" size='small' sx={{ ml: 1, mt: 1 }} />
                                    );
                                })}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box display='flex' flexDirection="column">
                            <FormLabel sx={{ mb: 1 }}>Imágenes</FormLabel>
                            <Button
                                color="secondary"
                                fullWidth
                                startIcon={<UploadOutlined />}
                                sx={{ mb: 3 }}
                                onClick={() => fileInputRef.current?.click()}
                                disabled={getValues('images').length == 2}
                            >
                                Cargar imagen
                            </Button>
                            <input ref={fileInputRef} type='file' multiple accept='image/png, image/gif, image/jpg'
                                style={{ display: 'none' }} onChange={onFileSelected} />

                            <Chip sx={{ display: getValues('images').length < 2 ? 'flex' : 'none' }} label="Es necesario tener 2 imagenes" color='error' variant='outlined' />

                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                {
                                    getValues('images').map(img => (
                                        <Grid item xs={4} sm={3} key={img}>
                                            <Card>
                                                {
                                                    img.includes('http')
                                                        ? <CardMedia component='img' className='fadeIn' image={img} alt={img} />
                                                        : <CardMedia component='img' className='fadeIn' image={`/products/${img}`} alt={img} />
                                                }
                                                <CardActions>
                                                    <Button fullWidth color="error" onClick={() => onDeleteImage(img)}>Borrar</Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </AdminLayout>
    )
}

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ query }) => {

    const { slug = '' } = query;

    let product: IProduct | null
    if (slug === 'new') {
        const temp = JSON.parse(JSON.stringify(new ProductModel()));
        delete temp._id;
        temp.images = ['images1.jpg', 'images2.jpg'];
        product = temp;
    } else {
        product = await dbProducts.getProductBySlug(slug.toString());
    }

    console.log(product);

    if (!product) {
        return {
            redirect: {
                destination: '/admin/products',
                permanent: false,
            }
        }
    }


    return {
        props: {
            product
        }
    }
}


export default ProductAdminPage