import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle,
  Typography
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import {Box} from '@mui/material';
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/global';
import { AddCircleOutline} from "@mui/icons-material";

const Proveedor = () => {
  const [proveedores, setProveedores] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ RazonSocial: '', RUC: '', NumeroCelular: '' });
  const [editing, setEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const { auth } = useAuth();
  const barear = 'Bearer ' + auth.token;


  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const elementsPerPage = 5;

  useEffect(() => {
    fetchProveedores();
  }, [currentPage]);

  const fetchProveedores = async () => {
    try {
      const requestData = {
        RazonSocial: '',
        NumeroPagina: currentPage,
        CantidadElementos: elementsPerPage
      };
      const response = await axios.post(Global.url + 'proveedor/report', requestData, {headers: { Authorization: `Bearer ${auth.token}` }});
      const data = response.data;
      setProveedores(data.listaRecords || []);
      setTotalElements(data.numeroPaginas || 0);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ RazonSocial: '', RUC: '', NumeroCelular: '' });
    setEditing(false);
    setCurrentId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(Global.url +'Proveedor', formData, {headers: { Authorization: `Bearer ${auth.token}` }});
      if (response.status === 201 || response.status === 200) {
        fetchProveedores();
        handleClose();
      } else {
        console.error('Error al registrar el proveedor:', response.statusText);
      }
    } catch (error) {
      console.error('Error al registrar el proveedor:', error);
    }
  };

  const handleEdit = async () => {
    try {
      const response = await axios.put(Global.url +`proveedor/${currentId}`, formData, {headers: { Authorization: `Bearer ${auth.token}` }});
      if (response.status === 200) {
        fetchProveedores();
        handleClose();
      } else {
        console.error('Error al editar el proveedor:', response.statusText);
      }
    } catch (error) {
      console.error('Error al editar el proveedor:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(Global.url +`proveedor/${id}`, {headers: { Authorization: `Bearer ${auth.token}` }});
      if (response.status === 200) {
        setProveedores(proveedores.filter(p => p.ProveedorId !== id));
      } else {
        console.error('Error al eliminar el proveedor:', response.statusText);
      }
    } catch (error) {
      console.error('Error al eliminar el proveedor:', error);
    }
  };

  const startEdit = (proveedor) => {
    setFormData({
      RazonSocial: proveedor.RazonSocial,
      RUC: proveedor.RUC,
      NumeroCelular: proveedor.NumeroCelular
    });
    setEditing(true);
    setCurrentId(proveedor.ProveedorId);
    handleClickOpen();
  };

  return (
    <div>
      <Typography variant='h4' component='h4' sx={{color:'#666', letterSpacing: '3px' }}>Gestión de Proveedores</Typography>
      <Button sx={{mb:2, mt:2}} variant="contained" color="primary" startIcon={<AddCircleOutline />} onClick={handleClickOpen}>
        Agregar Proveedor
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editing ? "Editar Proveedor" : "Agregar Proveedor"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Por favor, ingresa los detalles del {editing ? "proveedor a editar" : "nuevo proveedor"}.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="RazonSocial"
            name="RazonSocial"
            label="Razón Social"
            fullWidth
            value={formData.RazonSocial}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="RUC"
            name="RUC"
            label="RUC"
            fullWidth
            value={formData.RUC}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="NumeroCelular"
            name="NumeroCelular"
            label="Número de Celular"
            fullWidth
            value={formData.NumeroCelular}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          {editing ?
            <Button onClick={handleEdit} color="primary">Actualizar</Button> :
            <Button onClick={handleRegister} color="primary">Agregar</Button>
          }
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table sx={{minWidth:650}} aria-label="simple table">
          <TableHead>
            <TableRow sx={{backgroundColor: '#5a1acb'}}>
              <TableCell sx={{color: 'white'}} align="center">Razón Social</TableCell>
              <TableCell sx={{color: 'white'}} align="center">RUC</TableCell>
              <TableCell sx={{color: 'white'}} align="center">Número de Celular</TableCell>
              <TableCell sx={{color: 'white'}} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {proveedores.length > 0 ? (
              proveedores.map((proveedor) => (
                <TableRow key={proveedor.ProveedorId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell align="center">{proveedor.RazonSocial}</TableCell>
                  <TableCell align="center">{proveedor.RUC}</TableCell>
                  <TableCell align="center">{proveedor.NumeroCelular}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => startEdit(proveedor)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(proveedor.ProveedorId)}>
                      <Delete />
                    </IconButton>
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

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Button sx={{ m: 0, p: 0 }} disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Anterior</Button>
        <Typography variant="span" sx={{ ml: 2, mr: 2, p: 0 }}>{currentPage}</Typography>
        <Button sx={{ m: 0, p: 0 }} disabled={currentPage === totalElements} onClick={() => setCurrentPage(currentPage + 1)}>Siguiente</Button>
      </Box>
    </div>
  );
};

export default Proveedor;
