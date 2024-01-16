
import './modal.css'
import { FiX } from 'react-icons/fi'

export default function ModalContratante({conteudo, close}) {
    return(
        <div className='modal'>
        <div className='container'>
            <button className='close' onClick={close}>
                <FiX size={25} color='#FFF'/>
                Fechar
            </button>

            <main>
                <h2>Detalhes do contratante</h2>

                <div className='row'>
                    <span>
                        Contratante: <i>{conteudo.nome}</i>
                    </span>
                </div>

                <div className='row'>
                    <span>
                        Tipo: <i>{conteudo.tipo}</i>
                    </span>
                    <span>
                        Contato em: <i>{conteudo.contato}</i>
                    </span>
                </div>

                <div className='row'>
                    <span>
                        WhatsApp: <i>{conteudo.whatsapp}</i> 
                    </span>
                    <span>
                        Endereço: <i>{conteudo.endereco}</i> 
                    </span>
                </div>
            </main>
        </div>
    </div>
)  
}

