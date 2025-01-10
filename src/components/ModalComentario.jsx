export default function ModalComentario(props){
    return(
    <div class="modal text-dark" tabindex="-1" id={`comentario${props.id}`}> 
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content bg-light">
            <div class="modal-header">
                <h5 class="modal-title"><i className="far fa-comment-alt"></i>&nbsp;{props.title}</h5>
            </div>
            <div class="modal-body">
                <p>{props.comentario}</p>
            </div>
            </div>
        </div>
    </div>
    )
}