import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Typography, Grid, Card, CardActionArea, CardMedia, IconButton, Box,
  Pagination, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite'; // Importa el icono de corazón
import SampleImage from '../../assets/imagenes/producto-default.png'; // Imagen de prueba
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/global';
import { Snackbar, Alert } from '@mui/material';
import { AddCircleOutline} from "@mui/icons-material";


const Compras = () => {
  const { auth } = useAuth();
  const [compras, setCompras] = useState([]);
  const [productos, setProductos] = useState([]);
  const [openCompraDialog, setOpenCompraDialog] = useState(false);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [formData, setFormData] = useState({ Cantidad: '', ListaProducto: [], MetodoPago: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageProductos, setCurrentPageProductos] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [totalElementsProductos, setTotalElementsProductos] = useState(0);
  const elementsPerPage = 5;
  const elementsPerPageProductos = 2;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const metodoPagoOptions = [
    { value: 1, label: 'Efectivo' },
    { value: 2, label: 'Tarjeta' },
    { value: 3, label: 'Yape' },
    { value: 4, label: 'Plin' },
    { value: 5, label: 'Transferencia' },
  ];

  useEffect(() => {
    fetchCompras();
    fetchProductos();
  }, [currentPage, currentPageProductos]);

  const fetchCompras = async () => {
    try {
      const requestData = {
        Cantidad: '',
        NumeroPagina: currentPage,
        CantidadElementos: elementsPerPage,
      };
      const response = await axios.post(Global.url + 'Compra/report', requestData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const data = response.data;
      setCompras(data.listaRecords || []);
      setTotalElements(data.numeroPaginas || 0);
    } catch (error) {
      console.error('Error al obtener compras:', error);
    }
  };

  const fetchProductos = async () => {
    try {
      const requestData = {
        Nombre: "",
        NumeroPagina: currentPageProductos,
        CantidadElementos: elementsPerPageProductos
      };
      const response = await axios.post(Global.url + 'producto/report', requestData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const data = response.data;
      setProductos(data.listaRecords || []);
      setTotalElementsProductos(data.numeroPaginas || 0);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const handleOpenCompraDialog = () => {
    setOpenCompraDialog(true);
  };

  const handleCloseCompraDialog = () => {
    setOpenCompraDialog(false);
    setFormData({ Cantidad: '', ListaProducto: [], MetodoPago: '' });
    setEditing(false);
    setCurrentId(null);
    setSelectedProduct("");
  };

  const handleOpenProductDialog = () => {
    setOpenProductDialog(true);
  };

  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product.Nombre);
    setFormData({ ...formData, ListaProducto: [product.Productoid] });
    handleCloseProductDialog();
    setOpenCompraDialog(true);
  };

  const getMetodoPagoLabel = (value) => {
    const option = metodoPagoOptions.find(opt => opt.value === value);
    return option ? option.label : '';
  };

  const handleRegister = async () => {

    if (formData.Cantidad >= 1000) {
      setSnackbarMessage('Compra muy alta, no puedes comprar');
      setSnackbarOpen(true);
      return;
    }



    const nuevaCompra = { 
      Cantidad: parseInt(formData.Cantidad), 
      ListaProducto: formData.ListaProducto, 
      MetodoPago: getMetodoPagoLabel(formData.MetodoPago) 
    };
    try {
      const response = await axios.post(Global.url + 'compra', nuevaCompra, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (response.status === 201 || response.status === 200) {
        fetchCompras();
        handleCloseCompraDialog();
        setSelectedProduct("");
      } else {
        console.error('Error al registrar la compra:', response.statusText);
      }
    } catch (error) {
      console.error('Error al registrar la compra:', error);
    }
  };

  const handleEdit = async () => {
    const compraEditada = { 
      Cantidad: parseInt(formData.Cantidad), 
      ListaProducto: formData.ListaProducto, 
      MetodoPago: getMetodoPagoLabel(formData.MetodoPago) 
    };
    try {
      const response = await axios.put(Global.url + `compra/${currentId}`, compraEditada, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (response.status === 200) {
        fetchCompras();
        handleCloseCompraDialog();
        setSelectedProduct("");
      } else {
        console.error('Error al editar la compra:', response.statusText);
      }
    } catch (error) {
      console.error('Error al editar la compra:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(Global.url + `compra/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (response.status === 200) {
        fetchCompras();
      } else {
        console.error('Error al eliminar la compra:', response.statusText);
      }
    } catch (error) {
      console.error('Error al eliminar la compra:', error);
    }
  };

  const handleProductosPageChange = (event, page) => {
    setCurrentPageProductos(page);
  };

  const startEdit = (compra) => {
    const metodoPagoValue = metodoPagoOptions.find(opt => opt.label === compra.MetodoPago)?.value || '';
    setFormData({ 
      Cantidad: compra.Cantidad, 
      ListaProducto: compra.ListaProducto, 
      MetodoPago: metodoPagoValue 
    });
    setEditing(true);
    setCurrentId(compra.CompraId);
    handleOpenCompraDialog();
  };


  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  

  return (
    <div>
      <Typography variant='h4' component='h4' sx={{ color: '#666', letterSpacing: '3px' }}>Gestión de Compras</Typography>
      <Button sx={{ mb: 2, mt: 2 }} variant="contained" color="primary" startIcon={<AddCircleOutline />} onClick={handleOpenCompraDialog}>
        Agregar Compra
      </Button>

      <Dialog open={openCompraDialog} onClose={handleCloseCompraDialog}>
        <DialogTitle>{editing ? "Editar Compra" : "Agregar Compra"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Por favor, ingresa los detalles de la {editing ? "compra a editar" : "nueva compra"}.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="Cantidad"
            name="Cantidad"
            label="Cantidad"
            fullWidth
            value={formData.Cantidad}
            onChange={handleInputChange}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="MetodoPago-label">Método de Pago</InputLabel>
            <Select
              labelId="MetodoPago-label"
              id="MetodoPago"
              name="MetodoPago"
              value={formData.MetodoPago}
              label="Método de Pago"
              onChange={handleInputChange}
            >
              {metodoPagoOptions.map(option => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button sx={{ mt: 2 }} variant="outlined" color="primary" onClick={handleOpenProductDialog}>
            Seleccionar Producto
          </Button>
          {selectedProduct && (
            <Typography sx={{ mt: 2 }}>
              Producto Seleccionado: {selectedProduct}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCompraDialog}>Cancelar</Button>
          <Button onClick={editing ? handleEdit : handleRegister}>
            {editing ? "Guardar Cambios" : "Registrar Compra"}
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: '#5a1acb' }}>
            <TableRow>
              <TableCell sx={{ color: 'white' }} align="center">Nombre</TableCell>
              <TableCell sx={{ color: 'white' }} align="center">Cantidad</TableCell>
              <TableCell sx={{ color: 'white' }} align="center">Precio</TableCell>
              <TableCell sx={{ color: 'white' }} align="center">Categoría</TableCell>
              <TableCell sx={{ color: 'white' }} align="center">Stock Valido</TableCell>
              <TableCell sx={{ color: 'white' }} align="center">Fecha de Creación</TableCell>
              <TableCell sx={{ color: 'white' }} align="center">Método de Pago</TableCell>
              <TableCell sx={{ color: 'white' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {compras.length > 0 ? (
              compras.map((compra) => (
                <TableRow key={compra.CompraId}>
                  <TableCell align="center">{compra.Nombre}</TableCell>
                  <TableCell align="center">{compra.Cantidad}</TableCell>
                  <TableCell align="center">{compra.Precio}</TableCell>
                  <TableCell align="center">{compra.Categoria}</TableCell>
                  <TableCell align="center">{compra.CantidadInventario}</TableCell>
                  <TableCell align="center">{new Date(compra.FechaCreacion).toLocaleDateString()}</TableCell>
                  <TableCell align="center">{compra.MetodoPago}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" aria-label="edit" onClick={() => startEdit(compra)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" aria-label="delete" onClick={() => handleDelete(compra.CompraId)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">No hay compras disponibles</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
        <Button sx={{ m: 0, p: 0 }} disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
          Anterior
        </Button>
        <Typography sx={{ mx: 2 }}>{currentPage}</Typography>
        <Button sx={{ m: 0, p: 0 }} disabled={currentPage === totalElements} onClick={() => setCurrentPage(currentPage + 1)}>
          Siguiente
        </Button>
      </Box>

      <Dialog open={openProductDialog} onClose={handleCloseProductDialog}>
        <DialogTitle sx={{ color: '#5a1acb' }}>Seleccionar Producto</DialogTitle>
        <DialogContent>
          <Grid sx={{ mb: 6 }} container spacing={8} alignContent="center" alignItems="center" justifyContent="center">
            {/* Mostrar solo los productos de la página actual */}
            {productos.map((item, index) => (
              <Grid item key={index}>
                <Card className="card" onClick={() => handleProductSelect(item)}>
                  {/* Contenido de cada tarjeta de producto... */}
                  <CardActionArea>
                    <CardMedia
                      component="img"
                      height="200"
                      image={item.Imagen ? `data:image/jpeg;base64,${item.Imagen}` : SampleImage}
                      alt="Producto"
                      sx={{
                        objectFit: 'cover',         // Ajusta el tamaño de la imagen para cubrir todo el contenedor
                        objectPosition: 'center'   // Centra la imagen dentro del contenedor
                      }}
                    />
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Agregar paginación para los productos */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
            <Pagination
              count={Math.ceil(totalElementsProductos / elementsPerPageProductos)} // Calcular el número total de páginas
              page={currentPageProductos}
              onChange={handleProductosPageChange}
            />
          </Box>
        </DialogContent>
      </Dialog>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Compras;
