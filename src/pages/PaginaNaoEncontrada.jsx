import Sidebar from "../components/Sidebar";

export default function PaginaNaoEncontrada(){
    return (       
        <div id="wrapper">
        <Sidebar 
        painel="nav-item" 
        reservas="nav-item"  
        agendaReserva="nav-item" 
        reservasShow="collapse" 
        novaReserva="collapse-item" 
        minhaReserva="collapse-item"
        comissoes="collapse-item" 
        tabelaCliente="nav-item"
        componente={                
            <div class="container-fluid">
                <div class="text-center">
                    <div class="error mx-auto" data-text="404">404</div>
                    <p class="lead text-gray-800 mb-5">Página não encontrada</p>
                    <p class="text-gray-500 mb-0">Parece que você encontrou uma falha na matriz... </p>
                    <a href="/">&larr; Voltar para o painel</a>
                </div>
            </div>}
        />
        </div>
    )
}