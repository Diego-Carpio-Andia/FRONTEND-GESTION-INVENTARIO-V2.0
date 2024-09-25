import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import { AddCircleOutline, Delete, Edit, Favorite, FavoriteBorder } from "@mui/icons-material";
import useAuth from "../../hooks/useAuth";
import { Global } from "../../helpers/global";
import axios from 'axios';

const Producto = () => {
    const [products, setProducts] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [open, setOpen] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [formData, setFormData] = useState({ Nombre: "", Precio: "", Categoria: "", ProveedorId: "", CantidadInventario: 0, Imagen: null, PrecioProveedor: "", DolarActual: "", Frecuencia: "" });
    const [searchText, setSearchText] = useState('');
    const [DolarActual, setDolarActual] = useState();
    const [openProveedor, setOpenProveedor] = useState(false);
    const [proveedores, setProveedores] = useState([]);
    const [currentProveedorPage, setCurrentProveedorPage] = useState(1);
    const [totalProveedorPages, setTotalProveedorPages] = useState(1);
    const [formErrors, setFormErrors] = useState({});
    const [editProductImage, setEditProductImage] = useState(null);

    const { auth } = useAuth();
    const barear = 'Bearer ' + auth.token;

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const elementsPerPage = 5;
    const [Imagen, setImagen] = useState();


    const FrecuenciaOptions = [
        { value: 1, label: 'muy bajo' },
        { value: 2, label: 'bajo' },
        { value: 3, label: 'medio' },
        { value: 4, label: 'alto' },
        { value: 5, label: 'muy alto' },
      ];


    useEffect(() => {
        fetchProducts();
        fetchFavorites();
        fetchExchangeRate();
    }, [currentPage]);

    useEffect(() => {
        fetchProveedores();
    }, [currentProveedorPage]);


    const fetchExchangeRate = async () => {
        try {
            const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
            const rate = response.data.rates.PEN;
            setDolarActual(rate);
        } catch (err) {
            console.error("hubo un error: " + err);
        }
    }; 


    const getFrecuencia = (value) => {
        const option = FrecuenciaOptions.find(opt => opt.value === value);
        return option ? option.label : '';
    };

    const fetchProducts = async () => {
        try {
            const requestData = {
                Nombre: "",
                NumeroPagina: currentPage,
                CantidadElementos: elementsPerPage
            };
            const response = await fetch(Global.url + "producto/report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": barear
                },
                body: JSON.stringify(requestData)
            });
            const data = await response.json();
            setProducts(data.listaRecords || []);
            setTotalPages(data.numeroPaginas || 1);
        } catch (error) {
            console.error('Error al obtener productos:', error);
        }
    };

    const fetchFavorites = async () => {
        try {
            const response = await fetch(Global.url + "favoritos/report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": barear
                },
                body: JSON.stringify({ NumeroPagina: 1, CantidadElementos: 10000 })
            });
            const data = await response.json();
            setFavorites(data.listaRecords);
        } catch (error) {
            console.error('Error al obtener favoritos:', error);
        }
    };

    const fetchProveedores = async () => {
        try {
            const response = await fetch(Global.url + "proveedor/report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": barear
                },
                body: JSON.stringify({ NumeroPagina: currentProveedorPage, CantidadElementos: elementsPerPage })
            });
            const data = await response.json();
            setProveedores(data.listaRecords || []);
            setTotalProveedorPages(data.numeroPaginas || 1);
        } catch (error) {
            console.error('Error al obtener proveedores:', error);
        }
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditProductId(null);
        setFormData({ Nombre: "", Precio: "", Categoria: "", ProveedorId: "", CantidadInventario: 0, Imagen: null, PrecioProveedor: "", Frecuencia: "", DolarActual: ""});
        setFormErrors({});
    };

    const handleInputChange = (event) => {
        const { name, value, type, files } = event.target;
        const parsedValue = type === "file" ? files[0] : name === "Precio" || name === "CantidadInventario" || name === "PrecioProveedor" || name === "DolarActual" ? parseFloat(value) : value;
        setFormData({ ...formData, [name]: parsedValue });
    };

    const validateFormData = () => {
        let errors = {};

        if (!formData.Nombre) {
            errors.Nombre = "El nombre del producto es requerido";
        }

        if (!formData.Precio || isNaN(formData.Precio)) {
            errors.Precio = "El precio debe ser un número válido";
        }

        if (!formData.Categoria) {
            errors.Categoria = "La categoría del producto es requerida";
        }

        if (!formData.CantidadInventario || isNaN(formData.CantidadInventario)) {
            errors.CantidadInventario = "La cantidad en inventario debe ser un número válido";
        }

        if (!formData.PrecioProveedor || isNaN(formData.Precio)) {
            errors.PrecioProveedor = "El precio del proveedor debe ser un número válido";
        }


        if (!formData.Frecuencia) {
            errors.Frecuencia = "La Frecuencia del producto es requerida";
        }


      
        
        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleAddProduct = async () => {
        if (!validateFormData()) {
            return;
        }
    
        try {
            if (formData.Imagen) {
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const base64Data = reader.result.split(',')[1];
                    formData.Imagen = base64Data;
                    
                    try {
                        const response = await fetch(Global.url + "producto", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": barear
                            },
                            body: JSON.stringify({
                                Nombre: formData.Nombre,
                                Precio: formData.Precio,
                                Categoria: formData.Categoria,
                                ProveedorId: formData.ProveedorId,
                                CantidadInventario: formData.CantidadInventario,
                                Imagen: formData.Imagen,
                                PrecioProveedor: formData.PrecioProveedor,
                                DolarActual: parseFloat(DolarActual),
                                Frecuencia: getFrecuencia(formData.Frecuencia)
                            })
                        });
                        if (response.ok) {
                            const newProduct = await response.json();
                            fetchProducts();
                            handleClose();
                        } else {
                            console.error('Error al agregar producto:', response.statusText);
                        }
                    } catch (error) {
                        console.error('Error al agregar producto:', error);
                    }
                };
                reader.readAsDataURL(formData.Imagen);
            } else {
                // Si no hay imagen, enviar la solicitud sin imagen
                const response = await fetch(Global.url + "producto", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": barear
                    },
                    body: JSON.stringify({
                        Nombre: formData.Nombre,
                        Precio: formData.Precio,
                        Categoria: formData.Categoria,
                        ProveedorId: formData.ProveedorId,
                        CantidadInventario: formData.CantidadInventario,                        
                        PrecioProveedor: formData.PrecioProveedor,
                        DolarActual: parseFloat(DolarActual),
                        Frecuencia: getFrecuencia(formData.Frecuencia)
                    })
                });
                if (response.ok) {
                    const newProduct = await response.json();
                    fetchProducts();
                    handleClose();
                } else {
                    console.error('Error al agregar producto:', response.statusText);
                }
            }
        } catch (error) {
            console.error('Error al agregar producto:', error);
        }
    };
    
    const handleEditProduct = (Productoid) => {
        const productToEdit = products.find(product => product.Productoid === Productoid);
        if (productToEdit) {
            setEditProductId(Productoid);
            setEditProductImage(productToEdit.Imagen); // Establece la imagen actual del producto
            setFormData({
                Nombre: productToEdit.Nombre,
                Precio: productToEdit.Precio,
                Categoria: productToEdit.Categoria,
                ProveedorId: productToEdit.ProveedorId,
                CantidadInventario: productToEdit.CantidadInventario,
                PrecioProveedor: productToEdit.PrecioProveedor,
                DolarActual: productToEdit.DolarActual,
                Frecuencia: productToEdit.Frecuencia
            });
            setOpen(true);
        }
    };
    

    const handleUpdateProduct = async () => {
        if (!validateFormData()) {
            return;
        }

        try {
            const response = await fetch(Global.url + `producto/${editProductId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": barear
                },
                body: JSON.stringify(formData)
            });
            console.log(response);
            console.log(formData);
            if (response.ok) {
                fetchProducts();
                handleClose();
            } else {
                console.error('Error al actualizar producto:', response.statusText);
            }
        } catch (error) {
            console.error('Error al actualizar producto:', error);
        }
    };

    const handleDeleteProduct = async (Productoid) => {
        try {
            const response = await fetch(Global.url + `producto/${Productoid}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": barear
                }
            });
            if (response.ok) {
                const updatedProducts = products.filter(product => product.Productoid !== Productoid);
                setProducts(updatedProducts);
            } else {
                console.error('Error al eliminar producto:', response.statusText);
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
        }
    };

    const handleToggleFavorite = async (Productoid) => {
        const isFavorite = favorites.some(fav => fav.ProductoId === Productoid);
    
        try {
            if (isFavorite) {
                const favorito = favorites.find(fav => fav.ProductoId === Productoid);
                const response = await fetch(Global.url + `favoritos/${favorito.FavoritosId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": barear
                    }
                });
                if (response.ok) {
                    // Eliminar el favorito localmente
                    const updatedFavorites = favorites.filter(fav => fav.ProductoId !== Productoid);
                    setFavorites(updatedFavorites);
                    fetchFavorites();
                } else {
                    console.error('Error al eliminar favorito:', response.statusText);
                }
            } else {
                const response = await fetch(Global.url + "favoritos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": barear
                    },
                    body: JSON.stringify({ ProductoId: Productoid })
                });
                if (response.ok) {
                    // Agregar el favorito localmente
                    const newFavorite = await response.json();
                    setFavorites([...favorites, newFavorite]);
                    fetchFavorites();
                } else {
                    console.error('Error al agregar favorito:', response.statusText);
                }
            }
        } catch (error) {
            console.error('Error al manejar favorito:', error);
        }
    };
    

    const handleOpenProveedor = () => {
        setOpenProveedor(true);
    };

    const handleCloseProveedor = () => {
        setOpenProveedor(false);
    };

    const handleSelectProveedor = (ProveedorId) => {
        setFormData({ ...formData, ProveedorId });
        handleCloseProveedor();
    };

    return (
        <Box sx={{ mt: 4, mb: 6 }}>
            <Typography sx={{ mb: 2, color: '#666', letterSpacing: '3px' }} variant="h4">
                Gestión de Productos
            </Typography>
            <Button variant="contained" color="primary" startIcon={<AddCircleOutline />} onClick={handleOpen}>
                Agregar Producto
            </Button>
            <TableContainer sx={{ mt: 2 }} component={Paper}>
                <Table sx={{ minWidth: 450 }} aria-label="simple table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#5a1acb' }}>
                            <TableCell sx={{ color: 'white' }} align="center">Nombre</TableCell>
                            <TableCell sx={{ color: 'white' }} align="center">Categoría</TableCell>
                            <TableCell sx={{ color: 'white' }} align="center">Precio Venta</TableCell>
                            <TableCell sx={{ color: 'white' }} align="center">Precio Proveedor</TableCell>
                            <TableCell sx={{ color: 'white' }} align="center">Precio Dolar</TableCell>
                            <TableCell sx={{ color: 'white' }} align="center">Stock Valido</TableCell>
                            <TableCell sx={{ color: 'white' }} align="center">Fecha</TableCell>
                            <TableCell sx={{ color: 'white' }} align="center">Utilidades</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <TableRow
                                    key={product.Productoid}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="center">{product.Nombre}</TableCell>
                                    <TableCell align="center">{product.Categoria}</TableCell>
                                    <TableCell align="center">{product.Precio}</TableCell>
                                    <TableCell align="center">{product.PrecioProveedor}</TableCell>
                                    <TableCell align="center">{product.DolarActual}</TableCell>
                                    <TableCell align="center">{product.CantidadInventario}</TableCell>
                                    <TableCell align="center">{new Date(product.FechaCreacion).toLocaleDateString()}</TableCell>
                                    <TableCell align="center">
                                        <IconButton color="primary" onClick={() => handleEditProduct(product.Productoid)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton color="error" onClick={() => handleDeleteProduct(product.Productoid)}>
                                            <Delete />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            onClick={() => handleToggleFavorite(product.Productoid)}
                                        >
                                            {favorites.map(fav => fav.ProductoId).includes(product.Productoid) ? <Favorite sx={{ color: 'red' }} /> : <FavoriteBorder />}
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} align="center">No hay productos disponibles</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editProductId ? "Editar Producto" : "Agregar Producto"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Por favor, ingresa los detalles del {editProductId ? "producto a editar" : "nuevo producto"}.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="Nombre"
                        name="Nombre"
                        label="Nombre"
                        fullWidth
                        value={formData.Nombre}
                        onChange={handleInputChange}
                        error={!!formErrors.Nombre}
                        helperText={formErrors.Nombre}
                    />
                    <TextField
                        margin="dense"
                        id="Precio"
                        name="Precio"
                        label="Precio"
                        type="number"
                        fullWidth
                        value={formData.Precio}
                        onChange={handleInputChange}
                        error={!!formErrors.Precio}
                        helperText={formErrors.Precio}
                    />
                    <TextField
                        margin="dense"
                        id="Categoria"
                        name="Categoria"
                        label="Categoria"
                        fullWidth
                        value={formData.Categoria}
                        onChange={handleInputChange}
                        error={!!formErrors.Categoria}
                        helperText={formErrors.Categoria}
                    />
                    <TextField
                        margin="dense"
                        id="CantidadInventario"
                        name="CantidadInventario"
                        label="Cantidad Inventario"
                        type="number"
                        fullWidth
                        value={formData.CantidadInventario}
                        onChange={handleInputChange}
                        error={!!formErrors.CantidadInventario}
                        helperText={formErrors.CantidadInventario}
                    />
                    <TextField
                        margin="dense"
                        id="PrecioProveedor"
                        name="PrecioProveedor"
                        label="Precio Proveedor"
                        type="number"
                        fullWidth
                        value={formData.PrecioProveedor}
                        onChange={handleInputChange}
                    />
                    {/* <TextField
                        margin="dense"
                        id="Frecuencia"
                        name="Frecuencia"
                        label="Frecuencia"
                        fullWidth
                        value={formData.Frecuencia}
                        onChange={handleInputChange}
                    /> */}
                    {!editProductId || editProductImage ? (
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="Frecuencia-label">Frecuencia de venta</InputLabel>
                        <Select
                        labelId="Frecuencia-label"
                        id="Frecuencia"
                        name="Frecuencia"
                        value={formData.Frecuencia}
                        label="Frecuencia de Venta"
                        onChange={handleInputChange}
                        >
                        {FrecuenciaOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                    ) : null}

                    {!editProductId || editProductImage ? (
                        <TextField
                            margin="dense"
                            id="Imagen"
                            name="Imagen"
                            type="file"
                            fullWidth
                            style={{ marginTop: '10px' }}
                            onChange={handleInputChange}
                        />
                    ) : null}

                    <Button sx={{mt: 2, mb: 2}} variant="contained" color="primary" onClick={handleOpenProveedor}>
                        Seleccionar Proveedor
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    {editProductId ? (
                        <Button onClick={handleUpdateProduct} color="primary">Actualizar</Button>
                    ) : (
                        <Button onClick={handleAddProduct} color="primary">Agregar</Button>
                    )}
                </DialogActions>
            </Dialog>

            <Dialog open={openProveedor} onClose={handleCloseProveedor}>
                <DialogTitle>Selecciona a tu proveedor</DialogTitle>
                <DialogContent>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 450 }} aria-label="simple table">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#5a1acb' }}>
                                    <TableCell sx={{ color: 'white' }}>RUC</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Razon Social</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Numero Celular</TableCell>
                                    <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {proveedores.length > 0 ? (
                                    proveedores.map((proveedor) => (
                                        <TableRow key={proveedor.ProveedorId}>
                                            <TableCell>{proveedor.RUC}</TableCell>
                                            <TableCell>{proveedor.RazonSocial}</TableCell>
                                            <TableCell>{proveedor.NumeroCelular}</TableCell>
                                            <TableCell>
                                                <Button variant="contained" color="primary" onClick={() => handleSelectProveedor(proveedor.ProveedorId)}>
                                                    Seleccionar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">No hay proveedores disponibles</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button disabled={currentProveedorPage === 1} onClick={() => setCurrentProveedorPage(currentProveedorPage - 1)}>Anterior</Button>
                    <Button disabled={currentProveedorPage === totalProveedorPages} onClick={() => setCurrentProveedorPage(currentProveedorPage + 1)}>Siguiente</Button>
                </DialogActions>
            </Dialog>

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button sx={{ m: 0, p: 0 }} disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Anterior</Button>
                <Typography variant="span" sx={{ ml: 2, mr: 2, p: 0 }}>{currentPage}</Typography>
                <Button sx={{ m: 0, p: 0 }} disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Siguiente</Button>
            </Box>
        </Box>
    );
};

export default Producto;


