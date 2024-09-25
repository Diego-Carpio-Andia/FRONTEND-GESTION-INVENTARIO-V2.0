import React, { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea, CardMedia, Grid, Dialog, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite'; // Importa el icono de corazón
import SampleImage from '../../assets/imagenes/producto-default.png'; // Imagen de prueba
import { Global } from "../../helpers/global";
import useAuth from '../../hooks/useAuth';

export default function Favoritos() {
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const { auth } = useAuth();
    const Bearer = 'Bearer ' + auth.token;

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const response = await fetch(Global.url + "favoritos/report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": Bearer
                },
                body: JSON.stringify({ NumeroPagina: 1, CantidadElementos: 10000 })
            });
            const data = await response.json();
            setFavorites(data.listaRecords);
        } catch (error) {
            console.error('Error al obtener favoritos:', error);
        }
    };

    const handleClickOpen = async (item) => {
        setSelectedItem(item);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedItem(null);
    };

    const handleRemoveFromFavorites = async (favoritoId) => {
        try {
            const response = await fetch(Global.url + `favoritos/${favoritoId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": Bearer
                }
            });
            if (response.ok) {
                setFavorites(favorites.filter(fav => fav.FavoritosId !== favoritoId));
            } else {
                console.error('Error al eliminar favorito:', response.statusText);
            }
        } catch (error) {
            console.error('Error al eliminar favorito:', error);
        }
    };

    return (
        <>
            <Grid sx={{ mb: 6 }} container spacing={8} alignContent="center" alignItems="center" justifyContent="center">
                {favorites.length > 0 ? (
                    favorites.map((item, index) => (
                        <Grid item key={index}>
                            <Card className="card" onClick={() => handleClickOpen(item)}>
                                <IconButton style={{ position: 'absolute', top: 0, left: 0, color: 'red', zIndex: 1 }} 
                                    onClick={(e) => {
                                        e.stopPropagation(); // Detiene la propagación del evento de clic
                                        handleRemoveFromFavorites(item.FavoritosId); // Llama a la función para eliminar de favoritos
                                    }}
                                >
                                    <FavoriteIcon />
                                </IconButton>
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        sx={{
                                            height: '200px',
                                            objectFit: 'cover',         // Ajusta el tamaño de la imagen para cubrir todo el contenedor
                                            objectPosition: 'center'   // Centra la imagen dentro del contenedor
                                        }}
                                        image={item.Imagen ? `data:image/jpeg;base64,${item.Imagen}` : SampleImage} // Decodifica la imagen base64 si está presente
                                        alt={item.Nombre}
                                    />

                                </CardActionArea>
                            </Card>
                        </Grid>                
                    ))
                ) : (
                    <Typography variant="h6" color="text.secondary" sx={{ mt: 8, textAlign: 'center' }}>
                        No se encontraron favoritos
                    </Typography>
                )}

            </Grid>

            <Dialog open={open} onClose={handleClose}>
                {selectedItem && (
                    <>
                        <DialogTitle  sx={{ color: '#5a1acb' }}>{selectedItem.Nombre}</DialogTitle>
                        <DialogContent>
                            <DialogContentText component='div'>
                                <img src={selectedItem.Imagen ? `data:image/jpeg;base64,${selectedItem.Imagen}` : SampleImage} alt={selectedItem.Nombre} style={{ width: '100%', height: 'auto' }} />
                                <Typography variant="h6" component="div">
                                    Precio: S/. {selectedItem.Precio.toFixed(2)}
                                </Typography>
                                <Typography variant="h6" component="div">
                                    Categoría: {selectedItem.Categoria}
                                </Typography>
                            </DialogContentText>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </>
    );
}
