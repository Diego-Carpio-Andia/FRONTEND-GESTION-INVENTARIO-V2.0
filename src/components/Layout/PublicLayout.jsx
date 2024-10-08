import { Box, Backdrop, CircularProgress, Grid } from "@mui/material";
import { Outlet, Navigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import useAuth from "../../hooks/useAuth";
import tiendaImagen from '../../assets/imagenes/tienda.jpg'

export const PublicLayout = () => {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular la verificación de autenticación
    const verifyAuth = async () => {
      setLoading(true);
      // Aquí puedes llamar a una función de verificación de autenticación si es necesario
      // Por ejemplo: await auth.verifyToken();
      setTimeout(() => {
        setLoading(false); // Simulación de la verificación
      }, 1); // Puedes ajustar el tiempo según sea necesario
    };

    verifyAuth();
    window.location.href = '/#/login';
  }, [auth]);

  if (loading) {
    return (
      <Backdrop style={{ color: '#fff', zIndex: 1000 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  }

  return (
    <>
      {/* BODY */}
      <img src={tiendaImagen}  
          style={{position: 'absolute', left: 0, top: 0,Width:'2037px',overflow:'hidden', height:'1458px'}}
          alt="Descripción de la imagen"
        />

      <Grid container>    
        <Grid item xs={12} sx={{zIndex:99}}>
          {!auth.token ? <Outlet /> : <Navigate to="/inventory/dashboard" />}
        </Grid>
      </Grid>
    </>
  );
};
