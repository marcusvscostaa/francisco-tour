import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
class AuthService {
    login(username, password) {
        return axios.post(`${process.env.REACT_APP_BASE_URL}/login`, { username, password })
            .then((response) => {
                if (response.data.token) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                return response.data; 
            });
    }

    logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('myapp-username');
        localStorage.removeItem('myapp-password');
    }
    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
    validateToken(token) {
        if (!token) {
            console.warn("Token não encontrado no storage. Não autenticado.");
            return Promise.resolve(false);
        }

        return axios.get(`${process.env.REACT_APP_BASE_URL}/autenticacao/validar`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            return response.data.auth === true || response.status === 200;
        })
        .catch(error => {
            console.error("Validação de Token Falhou:", error.response || error);
            if (error.response && error.response.status === 401) {
                 this.logout(); 
            }
            return false;
        });
    }
}

export default new AuthService();