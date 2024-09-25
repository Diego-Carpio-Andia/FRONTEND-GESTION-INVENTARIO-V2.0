import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/global';

const UserProfileActualizar = () => {
    const { auth } = useAuth();
    const Bearer = 'Bearer ' + auth.token;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        Nombre: '',
        Apellidos: '',
        Email: '',
        Password: '',
        UserName: ''
    });

    const [open, setOpen] = useState(false); // Estado para controlar la visibilidad de la notificación

    useEffect(() => {
        fetchPerfil();
    }, []);

    const fetchPerfil = async () => {
        try {
            const response = await fetch(Global.url + 'Usuario', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Bearer
                }
            });

            const data = await response.json();
            // Dividir nombreCompleto en nombres y apellidos
            const nombreCompleto = data.nombreCompleto || '';
            const partesNombre = nombreCompleto.split(' ');
            const nombres = partesNombre.slice(0, -2).join(' '); // Los nombres son todas las partes excepto las dos últimas
            const apellidos = partesNombre.slice(-2).join(' '); // Los apellidos son las dos últimas partes

            setFormData({
                Nombre: nombres || '',
                Apellidos: apellidos || '',
                Email: data.email || '',
                Password: '', // No queremos prellenar el campo de contraseña
                UserName: data.username || ''
            });
        } catch (error) {
            console.error('No se pudo obtener el perfil del usuario');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(Global.url + 'Usuario', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': Bearer
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                setOpen(true); // Abrir la notificación
            } else {
                alert('Hubo un error al actualizar el perfil');
            }
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
        }
    };

    const handleClose = () => {
        setOpen(false); // Cerrar la notificación
        navigate("/inventory/dashboard");
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Actualizar Perfil de Usuario
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Nombre"
                            name="Nombre"
                            value={formData.Nombre}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Apellidos"
                            name="Apellidos"
                            value={formData.Apellidos}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            name="Email"
                            type="email"
                            value={formData.Email}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Contraseña"
                            name="Password"
                            type="password"
                            value={formData.Password}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary">
                            Actualizar
                        </Button>
                    </Grid>
                </Grid>
            </form>

            {/* Notificación de éxito */}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <MuiAlert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    El usuario se actualizó satisfactoriamente.
                </MuiAlert>
            </Snackbar>
        </Box>
    );
};

export default UserProfileActualizar;
