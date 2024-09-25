import { Card, Grid, Typography } from "@mui/material";
import Analis from "../Estadisticas/Analis";
import VistaChartNumeroVentas from "../Estadisticas/VistaChartNumeroVentas";
import TablaHome from "../Tablas/TablaHome";
import { useEffect, useState } from "react";
import { Global } from "../../helpers/global";
import useAuth from "../../hooks/useAuth";

export const Home = () => {
    const [dataInfo, setDataInfo] = useState();
    const { auth } = useAuth();
    const Bearer = 'Bearer ' + auth.token;

    useEffect(() => {
        fetchTotales();
    }, []);

    const fetchTotales = async () => {
        try {
            const response = await fetch(Global.url + "Informes/InformeTotal", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": Bearer
                }
            });

            const data = await response.json();
            setDataInfo(data);
        } catch (error) {
            console.error('Error al obtener totales', error);
        }
    }

    return (
        <>
            <Grid sx={{ mb: 5 }} container rowSpacing={4.5} columnSpacing={2.75}>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    {dataInfo && (
                        <Analis
                            title="Total Ventas"
                            count={dataInfo[0].cantidadVendida}
                            extra={["Has tenido un total de ventas de", formatCurrency(dataInfo[0].totalPrecioVendido), "históricamente"]}
                            type="sales"
                        />
                    )}
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                    {dataInfo && (
                        <Analis
                            title="Total Compras"
                            count={dataInfo[0].cantidadComprada}
                            extra={["Has tenido un total de compras de", formatCurrency(dataInfo[0].totalPrecioComprado), "históricamente"]}
                            type="purchases"
                        />
                    )}
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                    <VistaChartNumeroVentas></VistaChartNumeroVentas>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
                    <TablaHome></TablaHome>
                </Grid>
            </Grid>
        </>
    )
}

const formatCurrency = (amount) => {
    const formatter = new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
    });
    return formatter.format(amount);
}
