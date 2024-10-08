import React, { useState } from 'react';
import { TextField, Button, Container, Typography, List, ListItem, ListItemText, Backdrop, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Global } from '../../helpers/global';
import imagenLogo from '../../assets/imagenes/logo2.png';

const Registro = () => {
  const [formData, setFormData] = useState({
    Nombre: '',
    Apellidos: '',
    Email: '',
    Password: '',
    Username: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordCriteria, setPasswordCriteria] = useState({
    hasLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  const navigate = useNavigate();

  const isValidName = (name) => {
    const nameRegex = /^[a-zA-Z0-9\s]+$/;
    return nameRegex.test(name);
  };

  const validatePassword = (password) => {
    const criteria = {
      hasLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    setPasswordCriteria(criteria);
    return Object.values(criteria).every(value => value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'Nombre' && !isValidName(value)) {
      setError('El nombre solo puede contener letras, números y espacios.');
    } else {
      setError('');
    }

    if (name === 'Password') {
      validatePassword(value);
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    if (!validatePassword(formData.Password)) {
      setError('La contraseña no cumple con los requisitos.');
      return;
    }
    setLoading(true); // Activar la pantalla de carga
    try {
      const response = await fetch(Global.url + 'Usuario/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        navigate('/inventory/dashboard');
      } else {
        if (response.status === 400) {
          setError('El correo electrónico o nombre de usuario ya están registrados.');
        } else {
          setError('Error al registrar usuario: ' + response.statusText);
        }
      }
    } catch (error) {
      setError('Error al registrar usuario: ' + error.message);
    } finally {
      setLoading(false); // Desactivar la pantalla de carga
    }
  };

  return (
    <>
     <img src={imagenLogo}  
          style={{position: 'absolute', left: "42%", top: 8,Width:'20%',overflow:'hidden', height:'20%'}}
          alt="Descripción de la imagen"
      />
    <Container
      sx={{
        p: 3,
        mt: 15,
        border: '2px solid White',
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Fondo blanco semitransparente
        borderRadius: 2
      }}
      maxWidth="xs"
    >
      <Typography sx={{letterSpacing: 3, fontWeight: 'bolder', color: '#666666'}} variant="h5" align="center" gutterBottom>
        CREE UNA CUENTA
      </Typography>
      {error && <Typography color="error" align="center" gutterBottom>{error}</Typography>}
      <form onSubmit={handleRegistro}>
        <TextField
          id="Nombre"
          name="Nombre"
          label="Nombre"
          variant="outlined"
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
          />
        <TextField
          id="Apellidos"
          name="Apellidos"
          label="Apellidos"
          variant="outlined"
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
          />
        <TextField
          id="Email"
          name="Email"
          label="Correo electrónico"
          variant="outlined"
          type="email"
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
          />
        <TextField
          id="Password"
          name="Password"
          label="Contraseña"
          variant="outlined"
          type="password"
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
          />
        <List>
          <ListItem>
            <ListItemText
              primary={`Mínimo 8 caracteres ${passwordCriteria.hasLength ? '✔️' : '❌'}`}
              />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={`Al menos una letra mayúscula ${passwordCriteria.hasUpperCase ? '✔️' : '❌'}`}
              />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={`Al menos una letra minúscula ${passwordCriteria.hasLowerCase ? '✔️' : '❌'}`}
              />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={`Al menos un número ${passwordCriteria.hasNumber ? '✔️' : '❌'}`}
              />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={`Al menos un carácter especial ${passwordCriteria.hasSpecialChar ? '✔️' : '❌'}`}
              />
          </ListItem>
        </List>
        <TextField
          id="Username"
          name="Username"
          label="Nombre de usuario"
          variant="outlined"
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          required
          />
        <Typography sx={{mt:2}}>
          Ya tienes una cuenta ? <Link to="/login">Ingresa aquí</Link>
        </Typography>
        <Button sx={{mt:1}} type="submit" variant="contained" color="primary" fullWidth>
          Registrarse
        </Button>
      </form>
      <Backdrop style={{ color: '#fff', zIndex: 1000 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Container>
    </>
  );
};

export default Registro;
