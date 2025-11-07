import { useEffect, useState } from "react"
import decodeJwtPayload from "../decodeJwtPayload";
import { useAuth } from '../context/AuthContext.jsx';

export  default function Sidebar(props){
    const { user, userRole, logout } = useAuth();
    const [useName, setUsername] =  useState('USER')
    const [toggle, setToggle] = useState("navbar-nav bg-gradient-primary sidebar sidebar-dark accordion")
    
    useEffect(()=>{
        if(user && user.username){
            setUsername(user.username); 
        } else {
            setUsername('USER');
        }
        const handleResize = () => {
            const width = window.innerWidth;
            const sidebarElement = document.getElementById('accordionSidebar');

            if (width < 768) {

            }
            
            if (width < 480 && !sidebarElement.classList.contains("toggled")) {
                document.body.classList.add("sidebar-toggled");
                sidebarElement.classList.add("toggled");
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    },[user])

    const sidebarToggle = () => {
        setToggle(prevToggle => {
            if (prevToggle.includes("toggled")) {
                document.body.classList.remove("sidebar-toggled"); 
                return "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion";
            } else {
                document.body.classList.add("sidebar-toggled"); 
                return "navbar-nav bg-gradient-primary sidebar sidebar-dark accordion toggled";
            }
        });
    }
    
    const handleLogout = () => {
        logout();
    };

    const isAdmin = userRole === "ADMIN";

    return(
        <>
        <ul className={toggle} id="accordionSidebar">

        <a className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
            <div className="sidebar-brand-icon rotate-n-15">
                <img src="./img/travel-svgrepo-com.svg" width="40px"/>
            </div>
            <div className="sidebar-brand-text mx-3">Francisco Tour</div>
        </a>

        <hr className="sidebar-divider my-0" />

        <li className={props.painel}>
            <a className="nav-link" href="/">
                <i className="fas fa-fw fa-tachometer-alt"></i>
                <span>Painel</span></a>
        </li>
        
        {isAdmin && <li className={props.financeiro}>
            <a className="nav-link" href="/financeiro">
                <i className="fas fa-money-bill-wave"></i>
                <span>Financeiro</span></a>
        </li>}
        <li className={props.agendaReserva}>
            <a className="nav-link" href="agendaReservas">
                <i className="far fa-calendar-alt"></i>
                <span>Agenda de Reservas</span></a>
        </li>
        <li className={props.reservas}>
            <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseReservas"
                aria-expanded="true" aria-controls="collapseReservas">
                <i className="fas fa-hot-tub"></i>
                <span>Reservas</span>
            </a>
            <div id="collapseReservas" className={props.reservasShow} style={{zIndex:2000}} aria-labelledby="headingUtilities"
                data-parent="#accordionSidebar">
                <div className="bg-white py-2 collapse-inner rounded">
                    <h6 className="collapse-header">Opções:</h6>
                    <a className={props.novaReserva} href="novaReserva"><i className="fas fa-plus-circle"></i><span> &nbsp; Nova Reseva</span></a>
                    <a className={props.minhaReserva} href="minhasReservas"><i className="far fa-file-alt"></i><span> &nbsp; Minhas Resevas</span></a>
                    <a className={props.comissoes} href="comissoes"><i className="fas fa-money-bill-wave"></i><span> &nbsp; Comissões</span></a>
                </div>
            </div>
        </li>
        <li className={props.tabelaCliente}>
            <a className="nav-link" href="tabelaCliente">
                <i className="fas fa-fw fa-table"></i>
                <span>Tabela de Clientes</span></a>
        </li>
        {isAdmin && <li className={props.usuarios}>
            <a className="nav-link" href="usuarios">
                <i className="fas fa-user-alt"></i>
                <span>Usuários</span></a>
        </li>}
        {isAdmin && <li className={props.configuracoes}>
            <a className="nav-link" href="configuracoes">
                <i className="fa fa-cogs"></i>
                <span>Configurações</span></a>
        </li>}

        <hr className="sidebar-divider" />
        <li className="nav-item">
            <a className="nav-link" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt	"></i>
                <span>Sair</span></a>
        </li>

        <hr className="sidebar-divider d-none d-md-block" />

        <div className="text-center d-none d-md-inline">
            <button className="rounded-circle border-0" id="sidebarToggle" onClick={sidebarToggle}></button>
        </div>

        </ul>
        <div id="content-wrapper" className="d-flex flex-column">

            {/* Main Content */}
            <div id="content">
                
                {/* Topbar */}
                <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                    {/* Sidebar Toggle (Topbar) */}
                    <button id="sidebarToggleTop" onClick={sidebarToggle} className="btn btn-link d-md-none rounded-circle mr-3">
                        <i className="fa fa-bars"></i>
                    </button>

                    {/* Topbar Search */}
                    

                    {/* Topbar Navbar */}
                    <ul className="navbar-nav ml-auto">

                        {/* Nav Item - Search Dropdown (Visible Only XS) */}
                  

                        {/* Nav Item - Alerts */}
                        <span className={user.acesso === 'ADMIN'?'badge badge-dark text-white-600 m-auto p-1':'badge badge-info text-white-600 m-auto p-1'}>{decodeJwtPayload(JSON.parse(localStorage.getItem('user')).token).acesso}</span>
                        <div className="topbar-divider d-none d-sm-block"></div>

                        {/* Nav Item - User Information */}
                        <li className="nav-item dropdown no-arrow">
                            <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span className="mr-2 d-none d-lg-inline text-gray-600 small">{useName}</span>
                                <img className="img-profile rounded-circle"
                                    src="img/undraw_profile.svg"/>
                            </a>
                            {/* Dropdown - User Information */}
                            <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                aria-labelledby="userDropdown">
                                <a className="dropdown-item" onClick={handleLogout} data-toggle="modal" data-target="#logoutModal">
                                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
                                    Sair
                                </a>
                            </div>
                        </li>

                    </ul>

                </nav>
                {/* End of Topbar */}

                {/* Begin Page Content */}
                <div className="container-fluid">

                    {/* Page Heading */}
                    <div className="d-sm-flex align-items-center justify-content-between mb-4">
                        <h1 className="h3 mb-0 text-gray-800">{props.nomePagina}</h1>
                    </div>
                    {props.componente}

                    {/* Content Row */}
                  

                    {/* Content Row */}

                    {/* Content Row */}

                </div>
                {/* /.container-fluid */}

            </div>
            {/* End of Main Content */}

            {/* Footer */}
            <footer className="sticky-footer bg-white">
                <div className="container my-auto">
                    <div className="copyright text-center my-auto">
                        <span>Copyright &copy; Francisco Tour 2025</span>
                    </div>
                </div>
            </footer>
            {/* End of Footer */}

        </div>
        </>
    )
}