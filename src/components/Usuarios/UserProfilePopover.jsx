import { Avatar, Box, IconButton, Popover, Typography, List, ListItem, ListItemIcon, ListItemText, Divider, ListItemButton, Button, Grid } from "@mui/material";
import { HelpOutline, Settings } from "@mui/icons-material";
import React, { useEffect, useState } from "react";
import AvatarImage from "../../assets/imagenes/avatar.png"; // Asegúrate de tener una imagen de avatar
import { NavLink } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import useAuth from "../../hooks/useAuth";
import { Global } from "../../helpers/global";
import { useNavigate } from "react-router-dom";

export const UserProfilePopover = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const {auth} = useAuth();
    const [perfil, setPerfil] = useState();
    const Bearer = 'Bearer ' + auth.token;

    useEffect(()=>{
        fetchPerfil();
    }, [])

    const fetchPerfil = async () => {
        try {
            const response = await fetch(Global.url + "Usuario",{
                method: "GET",
                headers: {
                    "Content-Type" : "application/json",
                    "Authorization" : Bearer
                } 
            });

            const data = await response.json();
            setPerfil(data);

        } catch (error) {
          console.error("no se pudo obtener el perfil del usuario");
        }
    }

    const logOut = () => {      
        localStorage.removeItem("token");
        window.location.href = '/#/login';
        window.location.reload();           
        
    };
      


    return (
        <>
            <IconButton onClick={handleClick}>
                <Avatar sx={{mr:1,height:40, width:40}} alt="User Name" src={AvatarImage} />
                {perfil && (
                    <Typography sx={{color:'white'}} variant="body1">{perfil.nombreCompleto}</Typography>
                )}
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <Grid sx={{m:0, p:0.5}} container alignContent="center" alignItems="center" justifyContent="space-between">
                    <Grid item>
                        {perfil &&(

                        <Typography sx={{m:1}} variant="subtitle1">{perfil.username}</Typography>
                        )}
                    </Grid>
                    <Grid item>
                        <IconButton
                            onClick={logOut}
                            >                                
                            <LogoutIcon></LogoutIcon>
                        </IconButton>
                    </Grid>
                </Grid>
                    <Divider sx={{bgcolor:"#5a1acb"}}></Divider>
                <Box sx={{ p: 0 }}>
                    <List sx={{pb:0,pt:0}}>
                        <ListItem disablePadding sx={{'&:hover':{backgroundColor:'#f0f0f0'}}}>
                            <ListItemButton
                                component={NavLink} to={"actualizar"}
                            >
                                <ListItemIcon sx={{m:0,p:0}}>
                                    <Settings/>
                                </ListItemIcon>
                                <ListItemText>Configuracion</ListItemText>
                            </ListItemButton>
                        </ListItem>

                        {/* <ListItem disablePadding sx={{'&:hover':{backgroundColor:'#f0f0f0'}}}>
                            <ListItemButton component={NavLink} to={"#"}>
                                <ListItemIcon>
                                    <HelpOutline />
                                </ListItemIcon>
                                <ListItemText primary="Ayuda" />
                            </ListItemButton>
                        </ListItem> */}

                    </List>
                </Box>
            </Popover>
        </>
    );
};
