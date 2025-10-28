export default function ModalAlert(props){
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
            <div className="toast-body text-dark">
           {dado.message}
            </div>
        </div>)
        })}        
        </div>
    </>
    )
}