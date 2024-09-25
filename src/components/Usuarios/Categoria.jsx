import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardMedia, Grid, TextField, Pagination, Box } from '@mui/material';
import axios from 'axios';
import { Global } from '../../helpers/global';
import useAuth from '../../hooks/useAuth';
import SampleImage from '../../assets/imagenes/producto-default.png';

export default function Categoria() {
    const [productos, setProductos] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { auth } = useAuth();

    useEffect(() => {
        fetchProductos(currentPage);
    }, [currentPage]);

    const fetchProductos = async (page) => {
        try {
            const requestData = {
                Nombre: "",
                NumeroPagina: page,
                CantidadElementos: 9
            };
            const response = await axios.post(Global.url + 'producto/report', requestData, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            const data = response.data;
            setProductos(data.listaRecords || []);
            setTotalPages(data.numeroPaginas || 1);
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const filteredProductos = productos.filter(producto =>
        producto.Categoria.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Grid sx={{ mb: 6 }} container spacing={1} alignContent='center' alignItems='center'>
                <Grid item>
                    <TextField
                        label="Busqueda por categoria"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </Grid>
            </Grid>
            {filteredProductos.length > 0 ? (
                <Grid container spacing={4} alignContent="center" alignItems="center" justifyContent="center">
                    {filteredProductos.map((producto) => (
                        <Grid item key={producto.Productoid}>
                            <Card className="card">
                                <div className="cardInner">
                                    <div className="cardFace frontFace">
                                        <CardMedia
                                            component="img"
                                            height="180"
                                            image={producto.Imagen ? `data:image/jpeg;base64,${producto.Imagen}` : SampleImage}
                                            alt="Producto"
                                            sx={{
                                                objectFit: 'cover',         // Ajusta el tamaño de la imagen para cubrir todo el contenedor
                                                objectPosition: 'center'   // Centra la imagen dentro del contenedor
                                            }}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {producto.Nombre}
                                            </Typography>
                                            {/* <Typography variant="body2" color="text.secondary" sx={{ color: '#5a1acb' }}>
                                                {producto.Categoria}
                                            </Typography> */}
                                            <Typography variant="body2" color="text.secondary">
                                                S/. {producto.Precio}
                                            </Typography>
                                        </CardContent>
                                    </div>
                                    <div className="cardFace backFace">
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                Categoria
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" component="div">
                                                {producto.Categoria}
                                            </Typography>
                                        </CardContent>
                                    </div>
                                </div>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="h6" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
                    No se encontró producto
                </Typography>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </>
    )
}
