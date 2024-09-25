import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CategoryIcon from '@mui/icons-material/Category';
import SupplierIcon from '@mui/icons-material/LocalShipping';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CustomerIcon from '@mui/icons-material/Group';
import LogoutIcon from '@mui/icons-material/Logout';
import LogoProfile from "../Usuarios/LogoProfile";
import React from "react";
import FavoriteIcon from '@mui/icons-material/Favorite';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

export const NavBarList = ({ onClose }) => {  // Recibimos la función onClose como prop
    const navigate = useNavigate();  // Hook para la navegación

    const navArrayLinks = [
        { title: "Panel de Control", path: "/inventory/dashboard", icon: <DashboardIcon sx={{ color: 'white' }} /> },
        { title: "Ventas", path: "/inventory/sales", icon: <MonetizationOnIcon sx={{ color: 'white' }} /> },
        { title: "Compras", path: "/inventory/sales/orders", icon: <ShoppingCartIcon sx={{ color: 'white' }} /> },
        { title: "Productos", path: "/inventory/products", icon: <LocalOfferIcon sx={{ color: 'white' }} /> },
        { title: "Proveedores", path: "/inventory/suppliers", icon: <SupplierIcon sx={{ color: 'white' }} /> },
        { title: "Favoritos", path: "/inventory/favorites", icon: <FavoriteIcon sx={{ color: 'white' }} /> },
        { title: "Categorías", path: "/inventory/categories", icon: <CategoryIcon sx={{ color: 'white' }} /> },
        { title: "Reportes", path: "/inventory/reports", icon: <AssessmentIcon sx={{ color: 'white' }} /> },
        { title: "Predicciones", path: "/inventory/predicciones", icon: <TrendingUpIcon sx={{ color: 'white' }} /> },
        { title: "Cerrar sesión", path: "#", icon: <LogoutIcon sx={{ color: 'white' }} />, action: 'logout' },
    ];

    const handleItemClick = (action) => {
        if (action === 'logout') {
            localStorage.removeItem("token");
            window.location.href = '/#/login';
            window.location.reload();
        }
        onClose();
    };

    return (
        <Box sx={{ color: 'white', width: '100%', minWidth: 250, background: "#5a1acb" }}>
            <nav>
                <LogoProfile />
                <List sx={{ m: 0, p: 0 }}>
                    {navArrayLinks.map((item, index) => (
                        <React.Fragment key={item.title}>
                            <ListItem disablePadding>
                                <ListItemButton component={item.action === 'logout' ? 'button' : NavLink} to={item.path} onClick={() => handleItemClick(item.action)}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText>{item.title}</ListItemText>
                                </ListItemButton>
                            </ListItem>
                            {(index === 2 || index === 4 || index === 6) && (
                                <Divider sx={{ bgcolor: 'white' }} />
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </nav>
        </Box>
    );
};