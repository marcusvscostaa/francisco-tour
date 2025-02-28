import '../sb-admin-2.css';
import '../App.css';
import React, { useEffect, useState } from 'react';
import AuthService from '../AuthService';


export default function Login(){
    const [username, setUsername] = useState(JSON.parse(localStorage.getItem("myapp-username")) || "");
    const [password, setPassword] = useState(JSON.parse(localStorage.getItem("myapp-password")) || "");
    const [remember, setRemember] = useState(localStorage.getItem("myapp-password") !== null?true:false);

    useEffect(()=>{
    },[])
    
    const rememberCheck = (e) => {
        e.preventDefault();
        setRemember(!remember);
        if(remember === false){
            localStorage.removeItem('myapp-username')
            localStorage.removeItem('myapp-password')
        }
        
    }

    const handleLogin = (e) => {
        e.preventDefault(); 
        AuthService.login(username, password).then((user) => {
        window.location.href = '/';
        });
    };

    document.body.classList.add('bg-gradient-primary');
    return(
    <div class="container ">
            
        <div class="row justify-content-center align-items-center vh-100 positonItems">          
            <div class="col-xl-4 col-lg-6 col-md-6 align-self-center m-auto">
                <div className="sidebar-brand d-flex m-0 justify-content-center" href="/">
                            <div className="sidebar-brand-icon rotate-n-15">
                                <img src="./img/travel-svgrepo-com.svg" width="50px"/>
                            </div>
                            <div className="sidebar-brand-text mx-3">Francisco Tour</div>
                </div>
                <div class="card o-hidden border-0 shadow-lg ">
                    
                    <div class="card-body p-0">
                        <div class="">
                            <div class="">
                                
                                <div class="p-5">

                                    <form class="user" onSubmit={handleLogin}>
                                        <div class="form-group">
                                            <input type="text" class="form-control form-control-user"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder="Usuário"/>
                                        </div>
                                        <div class="form-group">
                                            <input type="password" class="form-control form-control-user"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="Senha"/>
                                        </div>
                                        <div class="form-group">
                                            <div class="custom-control custom-checkbox small">
                                                <input checked={remember} onChange={rememberCheck}  type="checkbox" class="custom-control-input" id="customCheck"/>
                                                <label class="custom-control-label" for="customCheck">Remember
                                                    Me</label>
                                            </div>
                                        </div>
                                        <button type="submit" class="btn btn-primary btn-user btn-block">
                                            Login
                                        </button>
                                    </form>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    </div>
    )
}