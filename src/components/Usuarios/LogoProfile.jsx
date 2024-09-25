import { Image } from "@mui/icons-material";
import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import LogoTipo from "../../assets/imagenes/Logo.jpg"
import LogoTipoCarrito from "../../assets/imagenes/carrito-de-compras.png"

export default function LogoProfile(){
    return(
        <>
            <Box
            sx={{m:2}}
            >
                    <Grid container spacing={3} alignItems="center">
                        <Grid item >
                            <img src={LogoTipoCarrito} 
                            style={{objectFit:"cover",width:50, height:50}}
                            ></img>
                        </Grid>
                        <Grid item>
                          <Typography variant="h6">PredIQ</Typography>             
                        </Grid>
                    </Grid>                                  
            </Box>
            <Divider sx={{ bgcolor: 'white' }} />
        </>
    )
}