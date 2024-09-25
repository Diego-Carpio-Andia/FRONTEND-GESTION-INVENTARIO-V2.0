import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/global';

const barChartOptions = {
  chart: {
    type: 'bar',
    height: 365,
    toolbar: {
      show: false
    }
  },
  plotOptions: {
    bar: {
      columnWidth: '45%',
      borderRadius: 4
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: [],
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  },
  yaxis: {
    show: false
  },
  grid: {
    show: false
  }
};

const diasDeLaSemana = {
  Mon: 'Lun',
  Tue: 'Mar',
  Wed: 'Mié',
  Thu: 'Jue',
  Fri: 'Vie',
  Sat: 'Sáb',
  Sun: 'Dom'
};

const ordenarDias = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export default function ChartNumeroVentas() {
  const theme = useTheme();
  const { primary, secondary } = theme.palette.text;
  const info = "#5a1acb";

  const [series, setSeries] = useState([{ name: 'Cantidad Vendida', data: [] }]);
  const [options, setOptions] = useState(barChartOptions);
  const { auth } = useAuth();

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [info],
      xaxis: {
        labels: {
          style: {
            colors: [secondary, secondary, secondary, secondary, secondary, secondary, secondary]
          }
        }
      }
    }));
  }, [primary, info, secondary]);

  const fetchInformesVenta = async () => {
    try {
      const response = await fetch(Global.url + 'Informes/InformeVenta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ Cantidad: 300 })
      });
      console.log(response);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener informes de venta:', error);
      return [];
    }
  };

  useEffect(() => {
    const getData = async () => {
      const data = await fetchInformesVenta();
      if (data && data.length > 0) {
        const today = dayjs();
        const salesData = Array(7).fill(0);
        const categories = [];

        for (let i = 6; i >= 0; i--) {
          const currentDay = today.subtract(i, 'day').format('ddd');
          categories.push(diasDeLaSemana[currentDay]);
        }

        data.forEach(item => {
          const itemDay = dayjs(item.fechaCreacion).format('ddd');
          const dayInSpanish = diasDeLaSemana[itemDay];
          const index = categories.indexOf(dayInSpanish);
          if (index !== -1) {
            salesData[index] += item.cantidad;
          }
        });

        // Ordenar las categorías para que empiece con Lunes
        const orderedSalesData = [];
        ordenarDias.forEach(day => {
          const index = categories.indexOf(day);
          if (index !== -1) {
            orderedSalesData.push(salesData[index]);
          }
        });

        setOptions((prevState) => ({
          ...prevState,
          xaxis: {
            ...prevState.xaxis,
            categories: ordenarDias
          }
        }));
        setSeries([{ name: 'Cantidad Vendida', data: orderedSalesData }]);
      } else {
        const categories = ordenarDias;
        const salesData = Array(7).fill(0);
        setOptions((prevState) => ({
          ...prevState,
          xaxis: {
            ...prevState.xaxis,
            categories: categories
          }
        }));
        setSeries([{ name: 'Cantidad Vendida', data: salesData }]);
      }
    };

    getData();
  }, []);

  return (
    <Box id="chart" sx={{ bgcolor: 'transparent' }}>
      <ReactApexChart options={options} series={series} type="bar" height={365} />
    </Box>
  );
}
