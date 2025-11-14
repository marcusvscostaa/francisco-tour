import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import AuthService from '../AuthService';
import { useAuth } from '../context/AuthContext';
import '../sb-admin-2.css';
import '../App.css';

export default function Login() {
    const [username, setUsername] = useState(localStorage.getItem("myapp-username") || "");
    const [password, setPassword] = useState(localStorage.getItem("myapp-password") || "");
    const [remember, setRemember] = useState(!!localStorage.getItem("myapp-password"));
    const [errorLogin, setErrorLogin] = useState('');
    const { login, error } = useAuth();
    
    const navigate = useNavigate();
    
    React.useEffect(() => {
        document.body.classList.add('bg-gradient-primary');
        return () => {
            document.body.classList.remove('bg-gradient-primary');
        };
    }, []);

    const rememberCheck = (e) => {
        setRemember(!remember);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        setErrorLogin(''); 

        AuthService.login(username, password)
            .then((response) => {
                if (remember) {
                    localStorage.setItem('myapp-username', username);
                    localStorage.setItem('myapp-password', password);
                } else {
                    localStorage.removeItem('myapp-username');
                    localStorage.removeItem('myapp-password');
                }
                window.location.reload(); 
                
            })
            .catch((error) => {
                console.error("Erro de Login:", error);
                let errorMessage = "Erro desconhecido. Tente novamente.";
                if (error.response) {
                    errorMessage = error.response.data?.message || `Falha no login: ${error.response.statusText}`;
                } 
                else if (error.request) {
                    errorMessage = "O servidor não está respondendo. Verifique sua conexão ou tente mais tarde.";
                } 
                else {
                    errorMessage = `Ocorreu um erro ao configurar a requisição: ${error.message}`;
                }
                setErrorLogin(errorMessage);
            });
    };

    return (
        <div className="container">
            <div className="row justify-content-center align-items-center vh-100 positonItems">
                <div className="col-xl-4 col-lg-6 col-md-6 align-self-center m-auto">
                    <div className="card o-hidden border-0 shadow-lg">
                        <div className="card-body p-0">
                            <div className="p-5">
                                <form className="user" onSubmit={handleLogin}>
                                    <div className="form-group">
                                        <input type="text" className="form-control form-control-user"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            placeholder="Usuário"
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" className="form-control form-control-user"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Senha"
                                            required 
                                        />
                                    </div>
                                    <div className="form-group">
                                        <div className="custom-control custom-checkbox small">
                                            <input 
                                                checked={remember} 
                                                onChange={rememberCheck} 
                                                type="checkbox" 
                                                className="custom-control-input" 
                                                id="customCheck"
                                            />
                                            <label className="custom-control-label" htmlFor="customCheck">
                                                Lembrar-me
                                            </label>
                                        </div>
                                    </div>
                                    {errorLogin && <div className="text-danger small mb-3">{errorLogin}</div>}
                                    <button type="submit" className="btn btn-primary btn-user btn-block">
                                        Login
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}