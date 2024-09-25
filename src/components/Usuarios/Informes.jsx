import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import MUIDataTable from 'mui-datatables';
import { Typography, Grid } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/global';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Box } from '@mui/system';

const Informes = () => {
  const [informesCompra, setInformesCompra] = useState([]);
  const [informesVenta, setInformesVenta] = useState([]);
  const [informesTendencia, setInformesTendencia] = useState([]);
  const { auth } = useAuth();
  const Bearer = 'Bearer ' + auth.token;

  useEffect(() => {
    const fetchInformesCompra = async () => {
      try {
        const response = await fetch(Global.url + 'Informes/InformeCompra', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': Bearer,
          },
        });
        const data = await response.json();
        setInformesCompra(data);
      } catch (error) {
        console.error('Error al obtener informes de compra:', error);
      }
    };

    const fetchInformesVenta = async () => {
      try {
        const response = await fetch(Global.url + 'Informes/InformeVenta', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': Bearer,
          },
        });
        const data = await response.json();
        setInformesVenta(data);
      } catch (error) {
        console.error('Error al obtener informes de venta:', error);
      }
    };

    const fetchInformesTendencia = async () => {
      try {
        const response = await fetch(Global.url + 'Informes/InformeTendencia', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': Bearer,
          },
        });
        const data = await response.json();
        setInformesTendencia(data);
      } catch (error) {
        console.error('Error al obtener informes de tendencia:', error);
      }
    };

    fetchInformesCompra();
    fetchInformesVenta();
    fetchInformesTendencia();
  }, [auth.token]);

  const columnsCompra = ["Producto", "Precio", "Categoría", "Cantidad", "Total Comprado"];
  const dataCompra = informesCompra.map(item => [item.producto, item.precio, item.categoria, item.cantidad, item.totalcomprado]);

  const columnsVenta = ["Producto", "Precio", "Categoría", "Cantidad", "Total Vendido"];
  const dataVenta = informesVenta.map(item => [item.producto, item.precio, item.categoria, item.cantidad, item.totalvendido]);

  const columnsTendencia = ["Nombre", "Precio", "Categoría", "Cantidad Pronosticada"];
  const dataTendencia = informesTendencia.map(item => [item.nombre, item.precio, item.categoria, item.cantidadPronosticada]);

  const options = {
    filterType: 'checkbox',
    responsive: 'standard',
    selectableRows: false,
    rowsPerPage: 5,
    rowsPerPageOptions: [5, 10, 15 ],
    textLabels: {
      body: {
        noMatch: "No se encontraron registros",
        toolTip: "Ordenar",
      },
      pagination: {
        next: "Siguiente",
        previous: "Anterior",
        rowsPerPage: "Filas por página:",
        displayRows: "de",
      },
      toolbar: {
        search: "Buscar",
        downloadCsv: "Descargar CSV",
        print: "Imprimir",
        viewColumns: "Ver columnas",
        filterTable: "Filtrar tabla",
      },
      viewColumns: {
        title: "Mostrar columnas",
        titleAria: "Mostrar/Ocultar columnas de tabla",
      },
      selectedRows: {
        text: "fila(s) seleccionada(s)",
        delete: "Eliminar",
        deleteAria: "Eliminar filas seleccionadas",
      },
    }   
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <>
      <Typography variant='h4' component='h4' sx={{ mb: 3, color: '#666', letterSpacing: '3px' }}>
        Reporte de ventas, compras y productos pronosticados para el posterior análisis
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12}>
          <Slider {...settings}>
            <Box
              sx={{p:1}}
            >
              <Typography variant='h6' component='h6' sx={{ mb: 2,color:"#5a1acb" }}>Tendencia</Typography>
              <MUIDataTable
                data={dataTendencia}
                columns={columnsTendencia}
                options={options}
              />
            </Box>
            <Box
              sx={{p:1}}
            >
              <Typography variant='h6' component='h6' sx={{ mb: 2,color:"#5a1acb" }}>Compras</Typography>
              <MUIDataTable
                data={dataCompra}
                columns={columnsCompra}
                options={options}
              />
            </Box>
            <Box
              sx={{p:1}}
            >
              <Typography variant='h6' component='h6' sx={{ mb: 2,color:"#5a1acb" }}>Ventas</Typography>
              <MUIDataTable
                data={dataVenta}
                columns={columnsVenta}
                options={options}
              />
            </Box>
          </Slider>
        </Grid>
      </Grid>
    </>
  );
}

export default Informes;
