import { AppBar, Badge, Box, Button, Container, Drawer, FormControlLabel, FormGroup, IconButton, Switch, Toolbar, Typography, Menu, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import { NavLink } from "react-router-dom";
import { NavBarList } from "./NavBarList";
import NightlightIcon from '@mui/icons-material/Nightlight';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Outlet, Navigate } from "react-router-dom";
import { UserProfilePopover } from "../Usuarios/UserProfilePopover";
import useAuth from "../../hooks/useAuth";
import { Global } from "../../helpers/global";
import SampleImage from '../../assets/imagenes/producto-default.png';

export const NavBar = () => {
    const { auth } = useAuth();
    const [perfil, setPerfil] = useState();
    const Bearer = 'Bearer ' + auth.token;
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [productos, setProductos] = useState([]);
    const [productosPronosticados, setProductosPronosticados] = useState([]);
    const [productosBajoStock, setProductosBajoStock] = useState([]);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        fetchPerfil();
        fetchProductos();
        fetchProductosPronosticados();
    }, []);

    const fetchProductos = async () => {
        try {
            const requestData = {
                NumeroPagina: 1,
                CantidadElementos: 8
            };
            const response = await fetch(Global.url + "producto/report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": Bearer
                },
                body: JSON.stringify(requestData)
            });
            const data = await response.json();
            setProductos(data.listaRecords || []);
            setProductosBajoStock(data.listaRecords.filter(producto => producto.CantidadInventario < 10));
        } catch (error) {
            console.error("Error al obtener productos:", error);
        }
    };

    const fetchProductosPronosticados = async () => {
        try {
            const requestData = {
                NumeroPagina: 1,
                CantidadElementos: 8
            };
            const response = await fetch(Global.url + "PronosticoDemanda/report", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": Bearer
                },
                body: JSON.stringify(requestData)
            });
            const data = await response.json();
            setProductosPronosticados(data.listaRecords || []);
        } catch (error) {
            console.error("Error al obtener productos pronosticados:", error);
        }
    };

    const fetchPerfil = async () => {
        try {
            const response = await fetch(Global.url + "Usuario", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": Bearer
                }
            });
            const data = await response.json();
            setPerfil(data);

        } catch (error) {
            console.error("No se pudo obtener el perfil del usuario");
        }
    };

    return (
        <>
            <AppBar>
                <Toolbar>
                    <IconButton 
                        color="inherit" 
                        size="large"
                        onClick={() => setOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
    
                    <Typography sx={{ flexGrow: 1 }}></Typography>
    
                    <Box>
                        <Badge color="warning" sx={{ mr: 1 }}>
                            <NotificationsIcon color="inherit" onClick={handleMenuOpen} />
                        </Badge>
                        <UserProfilePopover />
    
                        <Menu
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            {/*
                            <Typography variant="h6" sx={{ p: 2 }}>Productos</Typography>
                            {productos.length > 0 ? (
                                <>
                                {productos.map((producto) => (
                                    <MenuItem key={producto.Productoid} onClick={handleMenuClose}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <img
                                                src={producto.Imagen ? `data:image/jpeg;base64,${producto.Imagen}` : SampleImage}
                                                alt={producto.Nombre}
                                                style={{ width: 50, height: 50, marginRight: 10 }}
                                            />
                                            <Typography variant="body2">
                                                {producto.Nombre} - Stock: {producto.CantidadInventario}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                                </>
                            ) : (
                                <Typography variant="body1" sx={{ p: 2 }}>No hay Productos</Typography>
                            )}*/}
    
                            <Typography variant="h6" sx={{ p: 2 }}>Productos Pronosticados</Typography>
                            {productosPronosticados.length > 0 ? (
                                <>
                                {productosPronosticados.map((producto) => (
                                    <MenuItem key={producto.Nombre} onClick={handleMenuClose}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <img
                                                src={producto.Imagen ? `data:image/jpeg;base64,${producto.Imagen}` : SampleImage}
                                                alt={producto.Nombre}
                                                style={{ width: 50, height: 50, marginRight: 10 }}
                                            />
                                            <Typography variant="body2">
                                                {producto.Nombre} - Pronosticado: {producto.CantidadPronosticada}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                                </>
                            ) : (
                                <Typography variant="body1" sx={{ p: 2 }}>No hay productos Pronosticados</Typography>
                            )}
    
                            <Typography variant="h6" sx={{ p: 2 }}>Productos con Bajo Stock</Typography>
                            {productosBajoStock.length > 0 ? (
                                <>
                                {productosBajoStock.map((producto) => (
                                    <MenuItem key={producto.Productoid} onClick={handleMenuClose}>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <img
                                                src={producto.Imagen ? `data:image/jpeg;base64,${producto.Imagen}` : SampleImage}
                                                alt={producto.Nombre}
                                                style={{ width: 50, height: 50, marginRight: 10 }}
                                            />
                                            <Typography variant="body2">
                                                {producto.Nombre} - Stock: {producto.CantidadInventario}
                                            </Typography>
                                        </Box>
                                    </MenuItem>
                                ))}
                                </>
                            ) : (
                                <Typography variant="body1" sx={{ p: 2 }}>No se encontraron productos con bajo Stock</Typography>
                            )}
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
    
            <Drawer
                open={open}
                anchor="left"
                onClose={() => setOpen(false)}
            >
                <NavBarList onClose={() => setOpen(false)} />
            </Drawer>
        </>
    );
};