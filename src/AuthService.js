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
            return Promise.resolve(false);
        }

        return axios.post(`${process.env.REACT_APP_BASE_URL}/autenticacao/validar`, null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('user')}` 
            }
        })
        .then(response => {
            // O backend retorna 'true' ou o status 200/204
            // Assumimos que sucesso no status HTTP significa token válido
            return response.data.auth === true; 
        })
        .catch(error => {
            // Se a API retornar 401 (Não Autorizado) ou qualquer erro, o token é inválido
            console.error("Validação de Token Falhou:", error.response || error);
            return false;
        });
    }
}

export default new AuthService();