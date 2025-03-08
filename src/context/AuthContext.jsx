import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({children}) =>{
    const [user, setUser] = useState(null);

    useEffect(() => {       
           console.log(getCurrentUser());
    },[])
    const getCurrentUser = async () =>{
        const authorization = localStorage.getItem('user') !== null?JSON.parse(localStorage.getItem('user')).token:'21'
            console.log(authorization);
            return await axios.get(`${process.env.REACT_APP_BASE_URL}/autenticacao/${authorization}`).then(
            (response) => {
                console.log(response.data);
                return response.data               
            }
            ).catch((erro) => console.log(erro))
        }


    return(
        <AuthContext.Provider value={{
            signed:true
        }}>
           {children}
        </AuthContext.Provider>
    )
}