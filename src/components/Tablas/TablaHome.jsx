import React, { useState, useEffect } from 'react';
import { Grid, Typography, Card } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/global';

export default function TablaHome() {
    const [totalVendidoPorMes, setTotalVendidoPorMes] = useState([]);
    const { auth } = useAuth();
    const Bearer = 'Bearer ' + auth.token;

    useEffect(() => {
        const fetchInformesVenta = async () => {
            try {
                const response = await fetch(Global.url + 'Informes/InformeVenta', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': Bearer,
                    },
                    body: JSON.stringify({ Cantidad: 300 })
                });
                const data = await response.json();

                // Procesar los datos para calcular el total vendido por mes
                const totalPorMes = Array(12).fill(0);
                data.forEach(informe => {
                    const fecha = new Date(informe.fechaCreacion);
                    const mes = fecha.getMonth(); // Obtener el índice del mes (0 para enero, 11 para diciembre)
                    totalPorMes[mes] += informe.totalvendido; // Usar totalvendido en lugar de total
                });

                setTotalVendidoPorMes(totalPorMes);
            } catch (error) {
                console.error('Error al obtener informes de venta:', error);
            }
        };

        fetchInformesVenta();
    }, [auth.token]); // Dependencia de auth.token para actualizar cuando cambie

    return (
        <>        
            <Card sx={{ mt: 1.5, border: '2px solid #e6ebf1', boxShadow: '2px 2px 4px #e6ebf1' }}>
                <Grid container spacing={3}> 
                    <Grid item xs={12} xl={12} sx={{ minHeight: 500 }}>                    
                        <Typography sx={{ color: "#5a1acb", margin: 2 }} variant="h5">
                            Ganancias totales por cada mes
                        </Typography>

                        <BarChart
                            series={[
                                { data: totalVendidoPorMes  },
                            ]}
                            height={390}
                            xAxis={[{ data: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'], scaleType: 'band' }]}
                            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
                        />
                    </Grid>                
                </Grid>
            </Card>
        </>
    );
}
