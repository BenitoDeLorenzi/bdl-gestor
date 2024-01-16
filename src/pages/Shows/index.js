
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Title from '../../components/Title';

import ModalShows from '../../components/ModalShows';

import { db } from '../../services/firebaseConnection';
import { collection, getDocs, orderBy, limit, query, doc, deleteDoc, startAfter, updateDoc } from 'firebase/firestore'

import { format } from 'date-fns';

import { FiMusic, FiPlus, FiSearch, FiEdit, FiTrash, FiCheck } from 'react-icons/fi';

import { toast } from 'react-toastify';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const listRef = collection(db, "shows");

export default function Shows() {
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDocs, setLastDocs] = useState();
    const [loadingMore, setLoadingMore] = useState(false)
  
    const [showPostModal, setShowPostModal] = useState(false)
    const [detail, setDetail] = useState()

    useEffect(()=>{
        loadShows();
        return ()=>{};
    }, []);

    async function loadShows() {
        const q = query(listRef, orderBy('data', 'desc'), limit(5));
  
        const querySnapshot = await getDocs(q)
        setShows([])
        await updateState(querySnapshot)
  
        setLoading(false)
    }

    async function updateState(querySnapshot) {
        const isCollectionEmpty = querySnapshot.size === 0;
    
        if (!isCollectionEmpty) {
          let lista = [];
    
          querySnapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              contratante: doc.data().contratante,
              created: doc.data().created,
              createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
              data: doc.data().data,
              dataformat: format(doc.data().data.toDate(), 'dd/MM/yyyy'),
              observacoes: doc.data().observacoes,
              projeto: doc.data().projeto,
              status: doc.data().status,
              valor: doc.data().valor ,
              valorRecebido: doc.data()?.valorRecebido       
            })
          });
    
          const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        
          setShows(shows => [...shows, ...lista]);
          setLastDocs(lastDoc)
              
        } else {
          setIsEmpty(true);
        }
    
        setLoadingMore(false)
      }

      async function handleMore() {
        setLoadingMore(true);
    
        const q = query(listRef, orderBy('created', 'desc'), startAfter(lastDocs), limit(5));
    
        const querySnapshot = await getDocs(q);
        await updateState(querySnapshot)
      } 

      async function deleteShow(item) {
        MySwal.fire({
         title:"Deseja deletar?",
         text:"Show vai ser deletado",
         showCancelButton: true,
         confirmButtonText: "Deletar",
         cancelButtonText: "Sair",
         confirmButtonColor: "#c0392b"
        }).then( async (result)=>{
         if (result.isConfirmed) {
             const docRef = doc(db,"shows", item.id);
             await deleteDoc(docRef)
             .then(()=>{
                 toast.success("Show deletado")
                 loadShows();
             })
             .catch((error)=>{
                 console.log(error)
                 toast.error(error.message)
             })
         }
        })
     }

     async function finalizarShow(item) {
        MySwal.fire({
            title:"Deseja finalizar show?",
            text:"O show vai ser finalizado.",
            showCancelButton: true,
            confirmButtonText: "Finalizar",
            cancelButtonText: "Sair",
            confirmButtonColor: "#27ae60",
            input: "text",
            inputLabel: "Insira o valor recebido",
            inputPlaceholder: "R$ 0,00",
            inputAttributes: {
                autocapitalize: "off"
            },
            inputValidator: (value) => {
                if (!value) {
                  return "Insira o valor recebido";
                }
            },
            showLoaderOnConfirm: true,
            preConfirm: async (value)=>{
                let result;
                const docRef = doc(db, "shows", item.id);
                await updateDoc(docRef,{
                    status: "Finalizado",
                    valorRecebido: parseInt(value)
                })
                .then(()=>{
                    return true
                })
                .catch((error)=>{
                    console.log(error)
                    MySwal.showValidationMessage(error.message)
                })
 
            },
            allowOutsideClick: () => !Swal.isLoading()
           }).then( async (result)=>{
            if (result.isConfirmed) {
                if (result.value) {
                    toast.success("Show finalizado");
                    loadShows();
                }      
            }
           })
     }

    function toogleModal(item) {
        setShowPostModal(!showPostModal)
        setDetail(item)
    }

    if (loading) {
        return(
            <div>
                <Header />
                <div className="content">
                    <Title name="Shows">
                        <FiMusic size={25} />
                    </Title>
        
                <div className="container dashboard">
                    <span>Buscando shows...</span>
                </div>
        
                </div>
            </div>
        )
    }

    return(
        <div>
            <Header />
            <div className='content'>
                <Title name="Shows">
                    <FiMusic size={25} />
                </Title>

                {shows.length === 0 ? (
                    <div className="container dashboard">
                        <span>Nenhum show encontrado...</span>
                        <Link to="/newShow" className="new-show">
                            <FiPlus color="#FFF" size={25}/>
                            Novo show
                        </Link>
                    </div>
                ) : (
                    <>
                        <Link to="/newShow" className="new-show">
                            <FiPlus color="#FFF" size={25}/>
                            Novo show
                        </Link>

                        <table>
                            <thead>
                                <tr>
                                <th scope="col">Local</th>
                                <th scope="col">Projeto</th>
                                <th scope="col">Data Show</th>
                                <th scope="col">Valor</th>
                                <th scope="col">Status</th>
                                <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {shows.map((item, index)=>{
                                return(
                                    <tr key={item.id}>
                                    <td data-label="Local">{item.contratante}</td>
                                    <td data-label="Projeto">{item.projeto}</td>
                                    <td data-label="Data show">{item.dataformat}</td>
                                    <td data-label="Valor">{"R$ " + item.valor + ",00"}</td>
                                    <td data-label="Status">
                                        <span className="badge" style={{backgroundColor: item.status === 'Aberto' ? '#5cb85c' : '#999' }}>
                                        {item.status}
                                        </span>
                                    </td>
                                    <td data-label="#">
                                        <button onClick={()=> toogleModal(item)} className="action" style={{backgroundColor: '#3583f6'}}>
                                            <FiSearch color="#FFF" size={17}/>
                                        </button>
                                        <Link to={`/newShow/${item.id}`} className="action" style={{backgroundColor: '#f6a935  '}}>
                                            <FiEdit color="#FFF" size={17}/>
                                        </Link>
                                        <button onClick={()=> deleteShow(item)} className="action" style={{backgroundColor: '#c0392b'}}>
                                            <FiTrash color="#FFF" size={17}/>
                                        </button>

                                        {item.status !== 'Finalizado' && (
                                            <button onClick={()=> finalizarShow(item)} className="action" style={{backgroundColor: '#27ae60'}}>
                                              <FiCheck color="#FFF" size={17}/>
                                            </button>
                                        )}

                                      
                                    </td>
                                    </tr>
                                )
                                })}
                            </tbody>
                        </table>

                        {loadingMore && <h3>Buscando mais shows...</h3>}
                        {!loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore} >Buscar mais</button>}   
                    </>
                )}
            </div>
            {showPostModal && (
                <ModalShows
                    conteudo={detail}
                    close={()=>setShowPostModal(!showPostModal)}
                />
            )}
        </div>
    )
}