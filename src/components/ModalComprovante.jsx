export default function ModalComprovanre(props) {
    return (
    <div class="modal" tabindex="-1" id={`modalPag${props.id}`}>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Comprovate</h5>
                    <button type="button" class="close" data-dismiss={`modalPag${props.id}`} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <img class="img-thumbnail" src={`http://127.0.0.1:8800/imagem/${props.idPagamento}`}/>
                </div>
            </div>
        </div>
    </div>
    )
}