import ReactDOM from 'react-dom/client'
import App from './App.jsx'
//FUENTE ROBOTO DE MATERIAL DESING 
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

//IMPORTAR ASSETS
import './assets/css/styles.css'
import './assets/js/script.js'

//RESETEO DE LOS ESTILOS GENERALES
import { CssBaseline, createTheme } from '@mui/material';
import { ThemeProvider } from '@emotion/react';

//PERSONALIZACION DE LA PALETA DE COLORES AUTOMATICA SIGUIENDO MATERIAL DESING
const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
          main: '#5a1acb',
        },
        secondary: {
          main: '#f50057',
        },
    },
}) 

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={theme}>
      <CssBaseline/>
      <App/>
  </ThemeProvider>
)