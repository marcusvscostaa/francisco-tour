export default function ModalComprovanre(props) {
    return (
    <div className="modal" tabindex="-1" id={`modalPag${props.id}`}>
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Comprovate</h5>
                    <button type="button" className="close" data-dismiss={`modalPag${props.id}`} aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <img className="img-thumbnail" src={`${process.env.REACT_APP_BASE_URL}/imagem/${props.idPagamento}`}/>
                </div>
            </div>
        </div>
    </div>
    )
}