import { use, useEffect, useState } from "react"
import $ from "jquery"
import { redirect } from "react-router";

export default function ModalAlert(props){
        const [show, setShow] = useState({
            classNameName: "modal fade show",
            style: {display: 'block', backgroundColor: "rgba(0, 0, 0, 0.5)", transition: '.15s linear'},
            dialog: {transition: 'none'}
        })

        useEffect(()=>{
/*             window.onload = function(){
                document.getElementById("meuElemento").click();
            }
           
            setTimeout(()=>{document.getElementById("modalAlert").click(); 
                if(props.dados.status){window.location="/minhasReservas"};}, 4000) */
        })   
    return (    
    <>  
        <div className="position-fixed bottom-0 right-0 p-3" style={{zIndex: 5, right: 0, bottom: 0}}>
        
        {props.dados.map((dado)=>{
            return(
            dado.mostrar&& 
            <div id="liveToast" className="toast show" role="alert" aria-live="assertive" aria-atomic="true" data-delay="2000">           
            <div className={`toast-header ${dado.status?"bg-success":"bg-danger"} text-white`}>
            <strong className="mr-auto">{dado.status?"Sucesso " + dado.titulo:"Erro " + dado.titulo}</strong>
            </div>
            <div className="toast-body">
           {dado.message}
            </div>
        </div>)
        })}        
        </div>
    </>
    )
}