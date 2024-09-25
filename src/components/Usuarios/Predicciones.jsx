import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, Typography, Box,
  Checkbox, CircularProgress
} from '@mui/material';
import Slider from 'react-slick';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/global';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as XLSX from 'xlsx'; // Importa XLSX para la exportación a Excel

const Predicciones = () => {
  const { auth } = useAuth();
  const [ventas, setVentas] = useState([]);
  const [selectedVentas, setSelectedVentas] = useState([]);
  const [openVentaDialog, setOpenVentaDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogData, setDialogData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [elementsPerPage, setElementsPerPage] = useState(6);
  const [predictionSuccess, setPredictionSuccess] = useState(false);
  const [predictionMessage, setPredictionMessage] = useState("");
  const [prediccion, setPrediccion] = useState();
  const [predictedAmount, setPredictedAmount] = useState(null);
  const [informesTendencia, setInformesTendencia] = useState([]);
  const [selectedTendencias, setSelectedTendencias] = useState([]);

  useEffect(() => {
    fetchVentas();
    fetchInformesTendencia();
    if (prediccion) {
      fetchInformesTendencia();
    }
  }, [currentPage,prediccion]);

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
    } catch (error) {
      console.error('Error al obtener ventas:', error);
    }
  };

  const fetchInformesTendencia = async () => {
    try {
      const response = await fetch(Global.url + 'Informes/InformeTendencia', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
      });
      const data = await response.json();
      setInformesTendencia(data);
    } catch (error) {
      console.error('Error al obtener informes de tendencia:', error);
    }
  };

  const handleCheck = (venta) => {
    setSelectedVentas((prevSelected) =>
      prevSelected.includes(venta)
        ? prevSelected.filter((v) => v !== venta)
        : [...prevSelected, venta]
    );
  };

  const handleCheckTendencia = (tendencia) => {
    setSelectedTendencias((prevSelected) =>
      prevSelected.includes(tendencia)
        ? prevSelected.filter((t) => t !== tendencia)
        : [...prevSelected, tendencia]
    );
  };

  const handleOpenVentaDialog = () => {
    setOpenVentaDialog(true);
  };

  const handleCloseVentaDialog = () => {
    setOpenVentaDialog(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      for (let venta of selectedVentas) {
        const data = {
          Producto: venta.Nombre,
          Metodo_Pago: venta.MetodoPago,
          Categoria: venta.Categoria,
          Proveedor: venta.RazonSocial,
          Frecuencia: venta.Frecuencia,
          PrecioTotal: venta.Precio * venta.Cantidad,
          PrecioDolar: venta.DolarActual || 1.0,
          PrecioUnitario: venta.Precio,
          PrecioProveedor: venta.PrecioProveedor,
          Cantidad: venta.Cantidad,
          Fecha: venta.FechaCreacion,
        };

        const registrarResponse = await axios.post(Global.url2 + 'predict', data);
        const registrarData = registrarResponse.data;

        if (registrarData.mensaje === "Predicción realizada exitosamente") {
          setPredictionSuccess(true);
          setPrediccion(registrarData);
          setPredictionMessage(registrarData.mensaje);
          setPredictedAmount(registrarData.inventario_predicho);
        } else {
          console.error('Error en la predicción:', registrarData.mensaje);
        }

        const pronosticoData = {
          CantidadPronosticada: registrarData.inventario_predicho,
          Productos: [venta.Productoid]
        };

        const pronosticoResponse = await axios.post(Global.url + 'PronosticoDemanda', pronosticoData, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        const pronosticoResult = pronosticoResponse.data;

        setDialogData((prevData) => [
          ...prevData,
          { ...venta, inventario_actual: registrarData.inventario_actual, inventario_predicho: registrarData.inventario_predicho, pronosticoResult }
        ]);
      }
    } catch (error) {
      console.error('Error en el proceso de predicción:', error);
    } finally {
      setLoading(false);
      handleCloseVentaDialog();
    }
  };

 
   // Estado para la paginación
   const [predictionPage, setPredictionPage] = useState(1);
   const predictionsPerPage = 5;
 
   // Calcular el índice de la primera y última predicción en la página actual
   const indexOfLastPrediction = predictionPage * predictionsPerPage;
   const indexOfFirstPrediction = indexOfLastPrediction - predictionsPerPage;
 
   // Obtener las predicciones que se mostrarán en la página actual
   const currentPredictions = informesTendencia.slice(indexOfFirstPrediction, indexOfLastPrediction);
 

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(informesTendencia.map(tendencia => ({
      Nombre: tendencia.nombre,
      Precio: tendencia.precio,
      Categoria: tendencia.categoria,
      CantidadPronosticada: tendencia.cantidadPronosticada,
      FechaCreacion: tendencia.fechaCreacion
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Predicciones");
    XLSX.writeFile(wb, "Predicciones.xlsx");
  };

  return (
    <div>
      <Typography variant='h5' component='h5' sx={{ mb: 4, color: '#666', letterSpacing: '2px' }}>
        MÓDULO PARA EFECTUAR OPERACIONES DE PREDICCIÓN EN BASE A LAS VENTAS Y GENERAR REPORTES
      </Typography>
      <Slider {...{ dots: true, infinite: true, speed: 500, slidesToShow: 1, slidesToScroll: 1 }}>
        <Box sx={{p:1}}>
          <Typography variant='h6' component='h6' sx={{ mb: 2,color:"#5a1acb" }}>Ventas</Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#5a1acb' }}>
                  <TableCell sx={{ color: 'white' }} align="center">Seleccionar</TableCell>
                  <TableCell sx={{ color: 'white' }} align="center">Producto</TableCell>
                  <TableCell sx={{ color: 'white' }} align="center">Cantidad</TableCell>
                  <TableCell sx={{ color: 'white' }} align="center">Precio Unitario</TableCell>
                  <TableCell sx={{ color: 'white' }} align="center">Precio Total</TableCell>
                  <TableCell sx={{ color: 'white' }} align="center">Categoría</TableCell>
                  <TableCell sx={{ color: 'white' }} align="center">Stock Actual</TableCell>
                  <TableCell sx={{ color: 'white' }} align="center">Razon Social</TableCell>
                  <TableCell sx={{ color: 'white' }} align="center">Frecuencia de Venta</TableCell>
                  <TableCell sx={{ color: 'white' }} align="center">Fecha de Creación</TableCell>
                  <TableCell sx={{ color: 'white' }} align="center">Método de Pago</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ventas.length > 0 ? (
                  ventas.map((venta) => (
                    <TableRow key={venta.VentaId}>
                      <TableCell align="center">
                        <Checkbox
                          checked={selectedVentas.includes(venta)}
                          onChange={() => handleCheck(venta)}
                        />
                      </TableCell>
                      <TableCell align="center">{venta.Nombre}</TableCell>
                      <TableCell align="center">{venta.Cantidad}</TableCell>
                      <TableCell align="center">{venta.Precio}</TableCell>
                      <TableCell align="center">{venta.Cantidad * venta.Precio}</TableCell>
                      <TableCell align="center">{venta.Categoria}</TableCell>
                      <TableCell align="center">{venta.CantidadInventario}</TableCell>
                      <TableCell align="center">{venta.RazonSocial}</TableCell>
                      <TableCell align="center">{venta.Frecuencia}</TableCell>
                      <TableCell align="center">{venta.FechaCreacion}</TableCell>
                      <TableCell align="center">{venta.MetodoPago}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} align="center">NO HAY VENTAS DISPONIBLES</TableCell>
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
            <Button sx={{ m: 0, p: 0 }} disabled={ventas.length < elementsPerPage} onClick={() => setCurrentPage(currentPage + 1)}>
              Siguiente
            </Button>
          </Box>
          <Button
            sx={{ mt: 2 }}
            variant="outlined"
            color="primary"
            onClick={handleSubmit}
            disabled={selectedVentas.length === 0 || loading}
          >
            Realizar Predicción
          </Button>
        </Box>
        
        <Box sx={{ p: 1 }}>
      <Typography variant='h6' component='h6' sx={{ mb: 2, color: "#5a1acb" }}>Predicciones</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#5a1acb' }}>
              <TableCell sx={{ color: 'white' }} align="center">Nombre</TableCell>
              <TableCell sx={{ color: 'white' }} align="center">Precio</TableCell>
              <TableCell sx={{ color: 'white' }} align="center">Categoría</TableCell>
              <TableCell sx={{ color: 'white' }} align="center">Cantidad Pronosticada</TableCell>
              <TableCell sx={{ color: 'white' }} align="center">Fecha de Creación</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPredictions.length > 0 ? (
              currentPredictions.map((tendencia) => (
                <TableRow key={tendencia.id}>
                  <TableCell align="center">{tendencia.nombre}</TableCell>
                  <TableCell align="center">{tendencia.precio}</TableCell>
                  <TableCell align="center">{tendencia.categoria}</TableCell>
                  <TableCell align="center">{tendencia.cantidadPronosticada}</TableCell>
                  <TableCell align="center">{new Date(tendencia.fechaCreacion).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">NO HAY PREDICCIONES DISPONIBLES</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Paginación */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
        <Button
          onClick={() => setPredictionPage(predictionPage - 1)}
          disabled={predictionPage === 1}
          sx={{ m: 0, p: 0 }}
        >
          Anterior
        </Button>
        <Typography sx={{ mx: 2 }}>
          {predictionPage}
        </Typography>
        
        <Button
          onClick={() => setPredictionPage(predictionPage + 1)}
          disabled={indexOfLastPrediction >= informesTendencia.length}
          sx={{ m: 0, p: 0 }}
        >
          Siguiente
        </Button>
      </Box>

      {/* Botón para generar Excel */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
        <Button
          sx={{ m: 1 }}
          variant="contained"
          color="secondary"
          onClick={handleExportExcel}
        >
          Generar Excel
        </Button>
      </Box>
    </Box>
      </Slider>
      <Dialog open={predictionSuccess} onClose={() => setPredictionSuccess(false)}>
        <DialogTitle>Predicción Realizada con Éxito</DialogTitle>
        <DialogContent>
          <DialogContentText>{predictionMessage}</DialogContentText>
          {predictedAmount !== null && (
            <DialogContentText>Cantidad Pronosticada: {predictedAmount}</DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPredictionSuccess(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Predicciones;
