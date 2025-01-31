
import './modal.css'
import { FiX } from 'react-icons/fi'

export default function ModalContratante({conteudo, close}) {
    console.log(conteudo)
    return(
        <div className='modal'>
        <div className='container'>
            <button className='close' onClick={close}>
                <FiX size={25} color='#FFF'/>
                Fechar
            </button>

            <main>
                <h2>Detalhes do show</h2>

                <div className='row'>
                    <span>
                        Contratante: <i>{conteudo.contratante}</i>
                    </span>
                </div>

                <div className='row'>
                    <span>
                        Projeto: <i>{conteudo.projeto}</i>
                    </span>
                    <span>
                        Data do show: <i>{conteudo.dataformat}</i>
                    </span>
                </div>

                <div className='row'>
                    <span>
                        Valor: <i>{"R$ " + conteudo.valor + ",00"}</i> 
                    </span>
                    <span>
                        Valor Recebido:
                        {conteudo.valorRecebido && (
                            <>
                               <i>{"R$ " + conteudo.valorRecebido + ",00"}</i> 
                            </>
                        )}
                    </span>
                </div>

                <div>
                <span className='row'>
                        Status: 
                        <i className='status-badge' style={{color: "#FFF", backgroundColor: conteudo.status === 'Aberto' ? '#5cb85c' : '#999'}}>
                            {conteudo.status}
                        </i> 
                    </span>
                </div>

                {conteudo.observacoes !== '' && (
                        <>
                            <h3>Observaçoes</h3>
                            <p>
                                {conteudo.observacoes}
                            </p>
                        </>
                    )}
            </main>
        </div>
    </div>
)  
}

