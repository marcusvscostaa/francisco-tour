export default function ModalComentario(props){
    return(
    <div className="modal text-dark" tabindex="-1" id={`comentario${props.id}`}> 
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-light">
            <div className="modal-header">
                <h5 className="modal-title"><i className="far fa-comment-alt"></i>&nbsp;{props.title}</h5>
            </div>
            <div className="modal-body">
                <p>{props.comentario}</p>
            </div>
            </div>
        </div>
    </div>
    )
}