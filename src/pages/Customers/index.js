import { useState, useEffect } from "react";
import { db } from '../../services/firebaseConnection';
import { collection, getDocs, orderBy, limit, startAfter, query, deleteDoc, doc } from 'firebase/firestore';
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Title from '../../components/Title'
import ModalContratante from "../../components/ModalContratante";

import { FiUser, FiPlus, FiSearch, FiEdit, FiTrash } from 'react-icons/fi'
import { toast } from "react-toastify";
import './customers.css';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

const listRef = collection(db, "customers");

export default function Customers() {
    const [contratantes, setContratantes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDocs, setLastDocs] = useState();
    const [loadingMore, setLoadingMore] = useState(false);
  
    const [showPostModal, setShowPostModal] = useState(false);
    const [detail, setDetail] = useState();

    useEffect(() => {
        loadContratantes();
        return ()=>{}
    }, [])

    async function loadContratantes() {
        const q = query(listRef, orderBy('nome', 'asc'), limit(5));
  
        const querySnapshot = await getDocs(q)
        setContratantes([])
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
              contato: doc.data().contato,
              tipo: doc.data().tipo,
              endereco: doc.data().endereco,
              nome: doc.data().nome,
              whatsapp: doc.data().whatsApp
            })
          });
    
          const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        
          setContratantes(contratantes => [...contratantes, ...lista]);
          setLastDocs(lastDoc)
        } else {
          setIsEmpty(true);
        }
    
        setLoadingMore(false)
    }

    async function deleteCustomer(item) {
       MySwal.fire({
        title:"Deseja deletar?",
        text:"Contratante vai ser deletado",
        showCancelButton: true,
        confirmButtonText: "Deletar",
        cancelButtonText: "Sair",
        confirmButtonColor: "#c0392b"
       }).then( async (result)=>{
        if (result.isConfirmed) {
            const docRef = doc(db,"customers", item.id);
            await deleteDoc(docRef)
            .then(()=>{
                toast.success("Contratante deletado")
                loadContratantes();
            })
            .catch((error)=>{
                console.log(error)
                toast.error(error.message)
            })
        }
       })
    }

    async function handleMore() {
        setLoadingMore(true);
        const q = query(listRef, orderBy('nome', 'asc'), startAfter(lastDocs), limit(5));
        const querySnapshot = await getDocs(q);
        await updateState(querySnapshot)
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
                <Title name="Contratantes">
                    <FiUser size={25} />
                </Title>
    
              <div className="container dashboard">
                <span>Buscando contratantes...</span>
              </div>
    
            </div>
          </div>
        )
    }

    return(
        <div>
            <Header />
            <div className="content">
                <Title name="Contratantes">
                    <FiUser size={25} />
                </Title>

                {contratantes.length === 0 ? (
                    <div className="container dashboard">
                        <span>Nenhum contratante encontrado...</span>
                        <Link to="/newCustomers" className="new-show">
                            <FiPlus color="#FFF" size={25}/>
                            Novo contratante
                        </Link>
                    </div>
                ) : (
                    <>
                        <Link to="/newCustomers" className="new-show">
                            <FiPlus color="#FFF" size={25}/>
                            Novo contratante
                        </Link>

                        <table>
                            <thead>
                                <tr>
                                <th scope="col">Nome</th>
                                <th scope="col">Tipo</th>
                                <th scope="col">Contato</th>
                                <th scope="col">WhatsApp</th>
                                <th scope="col"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {contratantes.map((item, index)=>{
                                return(
                                    <tr key={item.id}>
                                    <td data-label="Nome">{item.nome}</td>
                                    <td data-label="Tipo">{item.tipo}</td>
                                    <td data-label="Contato">{item.contato}</td>
                                    <td data-label="WhatsApp">{item.whatsapp}</td>
                                    <td data-label="">
                                        <button onClick={()=> toogleModal(item)} className="action" style={{backgroundColor: '#3583f6'}}>
                                            <FiSearch color="#FFF" size={17}/>
                                        </button>
                                        <Link to={`/newCustomers/${item.id}`} className="action" style={{backgroundColor: '#f6a935'}}>
                                            <FiEdit color="#FFF" size={17} style={{margin: 0}}/>
                                        </Link>
                                        <button onClick={()=> deleteCustomer(item)} className="action" style={{backgroundColor: '#c0392b'}}>
                                            <FiTrash color="#FFF" size={17}/>
                                        </button>
                                    </td>
                                    </tr>
                                )
                                })}
                            </tbody>
                        </table>

                        {loadingMore && <h3>Buscando mais chamados...</h3>}
                        {!loadingMore && !isEmpty && <button className="btn-more" onClick={handleMore} >Buscar mais</button>}       
                    </>
                )}
            </div>
        {showPostModal && (
            <ModalContratante
                conteudo={detail}
                close={()=>setShowPostModal(!showPostModal)}
            />
        )}
        </div>
    )
}