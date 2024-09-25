import { Box, Card, Grid, Stack, Typography } from "@mui/material";
import ChartNumeroVentas from "./ChartNumeroVentas";

export default function VistaChartNumeroVentas(){
    return(
        <>
            
            <Card  sx={{mt:1.5,border: '2px solid #e6ebf1', boxShadow: '2px 2px 4px #e6ebf1'}}>
                <Box sx={{p:3, pb: 0}}>
                    <Stack spacing={2}>
                    <Typography sx={{color:"#5a1acb"}} variant="h5">Ventas</Typography>
                        <Typography variant="body1" color="black">
                            Numero de ventas realizadas en la semana
                        </Typography>
                    </Stack>
                </Box>
                <ChartNumeroVentas></ChartNumeroVentas>
            </Card>
        </>
    )
}