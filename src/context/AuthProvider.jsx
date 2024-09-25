import React from 'react'
import { createContext, useEffect, useState } from 'react'
import { Global } from '../helpers/global';

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    
    const [auth, setAuth] = useState({});
    const [registrado, setRegistrado] = useState();

    useEffect(() => {
        authUser();
    }, [registrado]);

    const authUser = async () => {
        // Sacar datos usuario identificado del localStorage
        const token = localStorage.getItem("token");
        setRegistrado(token);

        // Comprobar si tengo el token y el user
        if (!token) {
            return false;
        }

        // Petición ajax al backend que compruebe el token y que me devuelva todos los datos del usuario
        const bearer = 'Bearer ' + token;
        const request = await fetch(Global.url + "Usuario", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": bearer
            }
        });

        if (request.ok) {
            const data = await request.json();
            // Setear el estado de auth
            setAuth(data);
        } else {
            console.error("No se pudo obtener el perfil del usuario");
        }
    }

    return ( 
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
            }}
        >
            {/* Componente hijo que cargará */}
            {children}
        </AuthContext.Provider>  
    )
}

export default AuthContext;
