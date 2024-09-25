import {Routes, Route, BrowserRouter, Link} from 'react-router-dom';
import { PublicLayout } from '../components/Layout/PublicLayout';
import { Home } from '../components/Home/Home';
import { NavBar } from '../components/Layout/NavBar';
import Producto from '../components/Usuarios/Producto';
import Categoria  from '../components/Usuarios/Categoria';
import Ventas from '../components/Usuarios/Ventas';
import Compras from '../components/Usuarios/Compras';
import Proveedor from '../components/Usuarios/Proveedor';
import Favoritos from '../components/Usuarios/Favoritos';
import Informes from '../components/Usuarios/Informes';
import Login from '../components/Usuarios/Login';
import Registro from '../components/Usuarios/Registro';
import { AuthProvider } from '../context/AuthProvider';
import { PrivateLayout } from '../components/Layout/PrivateLayout';
import UserProfileActualizar from '../components/Usuarios/UserProfileActualizar';
import Predicciones from '../components/Usuarios/Predicciones';
import { HashRouter } from 'react-router-dom';

export const Routing = () => {
    return (
        <HashRouter>
        <AuthProvider>
                <Routes>
                    
                    <Route path='/' element={<PublicLayout></PublicLayout>}>
                        <Route path='/login' element={<Login></Login>}></Route>
                        <Route path='/registro' element={<Registro></Registro>}></Route>
                    </Route>

                    <Route path="/inventory" element={<PrivateLayout></PrivateLayout>}>
                        <Route path='actualizar' element={<UserProfileActualizar></UserProfileActualizar>}></Route>
                        <Route path='dashboard' element={<Home></Home>}></Route>
                        <Route path='products' element={<Producto></Producto>}></Route>
                        <Route path='categories' element={<Categoria></Categoria>}></Route>
                        <Route path='suppliers' element={<Proveedor></Proveedor>}></Route>
                        <Route path='sales' element={<Ventas></Ventas>}></Route>
                        <Route path='sales/orders' element={<Compras></Compras>}></Route>
                        <Route path='favorites' element={<Favoritos></Favoritos>}></Route>
                        <Route path='reports' element={<Informes></Informes>}></Route>
                        <Route path='predicciones' element={<Predicciones></Predicciones>}></Route>
                    </Route>

                    <Route path="*" element={
                        <>
                            <p>
                                <h1>Error 404</h1>
                                <Link to="/">Volver al inicio</Link>
                            </p>
                        </>
                    }>                        
                    </Route>                
                </Routes>
            </AuthProvider>
        </HashRouter>
    )
}