import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Typography, Grid, Card, CardActionArea, CardMedia, IconButton, Box,
  Pagination, Select, MenuItem
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SampleImage from '../../assets/imagenes/producto-default.png';
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/global';
import { Snackbar, Alert } from '@mui/material';
import { AddCircleOutline} from "@mui/icons-material";

const Ventas = () => {
  const { auth } = useAuth();
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [openVentaDialog, setOpenVentaDialog] = useState(false);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [formData, setFormData] = useState({ Cantidad: '', ListaProducto: [], MetodoPago: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageProductos, setCurrentPageProductos] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [totalElementsProductos, setTotalElementsProductos] = useState(0);
  const elementsPerPage = 6;
  const elementsPerPageProductos = 2;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState('');
const [selectedProductStock, setSelectedProductStock] = useState(null); // Nuevo estado para guardar el stock del producto seleccionado


  useEffect(() => {
    fetchVentas();
    fetchProductos();
  }, [currentPage, currentPageProductos]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };


 
  
  const fetchVentas = async () => {
    try {
      const requestData = {
        NumeroPagina: currentPage,
        CantidadElementos: elementsPerPage,
      };
      const response = await axios.post(Global.url + 'venta/report', requestData, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const data = response.data;
      setVentas(data.listaRecords || []);
      setTotalElements(data.numeroPaginas || 0);
    } catch (error) {
      console.error('Error al obtener ventas:', error);
    }
  };

  const fetchProductos = async () => {
    try {
      const requestData = {
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

  const handleOpenVentaDialog = () => {
    setOpenVentaDialog(true);
  };

  const handleProductosPageChange = (event, page) => {
    setCurrentPageProductos(page);
  };

  const handleCloseVentaDialog = () => {
    setOpenVentaDialog(false);
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
    if (name === "Cantidad" && value > 900) {
      return;
    }
  };

  const handleProductSelect = (product) => {
    setSelectedProduct(product.Nombre);
    setFormData({ ...formData, ListaProducto: [product.Productoid] });
    setSelectedProductStock(product.CantidadInventario);
    handleCloseProductDialog();
    setOpenVentaDialog(true);
  };

  const handleRegister = async () => {
    if (selectedProductStock <= 15) {
      setSnackbarMessage('Stock muy bajo. No puedes vender.');
      setSnackbarOpen(true);
      return;
    }
  
    const nuevaVenta = { 
      Cantidad: parseInt(formData.Cantidad), 
      ListaProducto: formData.ListaProducto,
      MetodoPago: getMetodoPagoLabel(formData.MetodoPago)
    };
  
    try {
      const response = await axios.post(Global.url + 'venta', nuevaVenta, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (response.status === 201 || response.status === 200) {
        fetchVentas();
        handleCloseVentaDialog();
        setSelectedProduct("");
      } else {
        console.error('Error al registrar la venta:', response.statusText);
      }
    } catch (error) {
      console.error('Error al registrar la venta:', error);
    }
  };

  const handleEdit = async () => {
    if (selectedProductStock < 1) {
      setSnackbarMessage('Stock muy bajo. No puedes vender.');
      setSnackbarOpen(true);
      return;
    }
  
    const ventaEditada = { 
      Cantidad: parseInt(formData.Cantidad), 
      ListaProducto: formData.ListaProducto,
      MetodoPago: getMetodoPagoLabel(formData.MetodoPago)
    };
  
    try {
      const response = await axios.put(Global.url + `venta/${currentId}`, ventaEditada, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (response.status === 200) {
        fetchVentas();
        handleCloseVentaDialog();
        setSelectedProduct("");
      } else {
        console.error('Error al editar la venta:', response.statusText);
      }
    } catch (error) {
      console.error('Error al editar la venta:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(Global.url + `venta/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      if (response.status === 200) {
        fetchVentas();
      } else {
        console.error('Error al eliminar la venta:', response.statusText);
      }
    } catch (error) {
      console.error('Error al eliminar la venta:', error);
    }
  };

  const startEdit = (venta) => {
    setFormData({ 
      Cantidad: venta.Cantidad, 
      ListaProducto: venta.ListaProducto,
      MetodoPago: getMetodoPagoValue(venta.MetodoPago)
    });
    setEditing(true);
    setCurrentId(venta.VentaId);
    handleOpenVentaDialog();
  };

  const getMetodoPagoLabel = (value) => {
    switch (value) {
      case 1:
        return "Tarjeta de Crédito";
      case 2:
        return "PayPal";
      case 3:
        return "Transferencia Bancaria";
      case 4:
        return "Efectivo";
      case 5:
        return "Bitcoin";
      default:
        return "";
    }
  };

  const getMetodoPagoValue = (label) => {
    switch (label) {
      case "Efectivo":
        return 1;
      case "Tarjeta":
        return 2;
      case "Yape":
        return 3;
      case "Plin":
        return 4;
      case "Transferencia":
        return 5;
      default:
        return "";
    }
  };


  

  return (
    <div>
      <Typography variant='h4' component='h4' sx={{ color: '#666', letterSpacing: '3px' }}>Gestión de Ventas</Typography>
      <Button variant="contained" color="primary" startIcon={<AddCircleOutline />} sx={{ mb: 2, mt: 2 }} onClick={handleOpenVentaDialog}>
        Agregar Venta
      </Button>

      <Dialog open={openVentaDialog} onClose={handleCloseVentaDialog}>
        <DialogTitle>{editing ? "Editar Venta" : "Agregar Venta"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Por favor, ingresa los detalles de la {editing ? "venta a editar" : "nueva venta"}.
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
            inputProps={{ max: 900 }}
          />
          <Select
            fullWidth
            sx={{ mt: 2 }}
            labelId="metodo-pago-label"
            id="MetodoPago"
            name="MetodoPago"
            value={formData.MetodoPago}
            onChange={handleInputChange}
          >
            <MenuItem value={1}>Efectivo</MenuItem>
            <MenuItem value={2}>Tarjeta</MenuItem>
            <MenuItem value={3}>Yape</MenuItem>
            <MenuItem value={4}>Plin</MenuItem>
            <MenuItem value={5}>Transferencia</MenuItem>
          </Select>
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
          <Button onClick={handleCloseVentaDialog}>Cancelar</Button>
          {editing ?
            <Button onClick={handleEdit} color="primary">Actualizar</Button> :
            <Button onClick={handleRegister} color="primary">Agregar</Button>
          }
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#5a1acb' }}>
              <TableCell sx={{ color: 'white' }} align="center">Producto</TableCell>
              <TableCell sx={{ color: 'white' }} align="center">Cantidad</TableCell>
              <TableCell sx={{ color: 'white' }} align="center">Precio</TableCell>
              <TableCell sx={{ color: 'white' }} align="center">Categoría</TableCell>
              {/* <TableCell sx={{ color: 'white' }} align="center">Stock Valido</TableCell>
              <TableCell sx={{ color: 'white' }} align="left">Producto ID</TableCell> */}
              <TableCell sx={{ color: 'white' }} align="center">Fecha de Creación</TableCell>
              <TableCell sx={{ color: 'white' }} align="center">Método de Pago</TableCell>
              <TableCell sx={{ color: 'white' }} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ventas.length > 0 ? (
              ventas.map((venta) => (
                <TableRow key={venta.VentaId}>
                  <TableCell align="center">{venta.Nombre}</TableCell>
                  <TableCell align="center">{venta.Cantidad}</TableCell>
                  <TableCell align="center">{venta.Precio}</TableCell>
                  <TableCell align="center">{venta.Categoria}</TableCell>
                  {/* <TableCell align="center">{venta.CantidadInventario}</TableCell>
                  <TableCell align="left">{venta.Productoid}</TableCell> */}
                  <TableCell align="center">{venta.FechaCreacion}</TableCell>
                  <TableCell align="center">{venta.MetodoPago}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" aria-label="edit" onClick={() => startEdit(venta)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" aria-label="delete" onClick={() => handleDelete(venta.VentaId)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">No hay Ventas disponibles</TableCell>
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

export default Ventas;



