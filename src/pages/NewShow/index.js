import { useState, useEffect, useContext } from 'react';

import './newShow.css'

import Header from '../../components/Header';
import Title from '../../components/Title';
import { NumericFormat } from 'react-number-format';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ptBR from 'date-fns/locale/pt-BR';

import { FiMusic, FiPlusCircle } from 'react-icons/fi';

import { AuthContexts } from '../../contexts/auth';
import { db } from '../../services/firebaseConnection';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore';

import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';

import { format } from 'date-fns';

const listRef = collection(db, "customers")

export default function NewShow() {
    const { user } = useContext(AuthContexts);
    const { id } = useParams();
    const navigate = useNavigate();

    const [contratante, setContratante] = useState([])
    const [loadContratantes, setLoadContratantes] = useState(true);
    const [contratanteSelected, setContratanteSelected] = useState(0)
    const [projeto, setProjeto] = useState('Banda completa')
    const [valor, setValor] = useState("");
    const [status, setStatus] = useState('Aberto');
    const [data, setData] = useState(new Date());
    const [observacoes, setObservacoes] = useState("");
    const [idShow, setIdShow] = useState(false)

    useEffect(()=>{
        async function loadContratante() {
            const querySnapshot = getDocs(listRef)
            .then((snapshot)=>{
                let lista = [];
                snapshot.forEach((doc)=>{
                    lista.push({
                        id: doc.id,
                        nome: doc.data().nome
                    })
                })

                if (snapshot.docs.length === 0) {
                    console.log("Contratante encontrado")
                    setContratante([{ id: 1, nome: "Generico"}])
                    setLoadContratantes(false)
                    return;
                }

                if (id) {
                    loadId(lista);
                }

                setContratante(lista);
                setLoadContratantes(false)

            })
            .catch((error)=>{
                console.log(error)
                setContratante([{ id: 1, nome: "Generico"}])
                setLoadContratantes(false)
            })
        }

        loadContratante();
        return ()=>{}
    }, [id])

    async function loadId(lista) {
        const docRef = doc(db, "shows", id);
        await getDoc(docRef)
        .then((snapshot)=>{
            setProjeto(snapshot.data().projeto)
            setValor(snapshot.data().valor);
            setData(snapshot.data().data.toDate());
            setStatus(snapshot.data().status)
            setObservacoes(snapshot.data().observacoes)

            let index = lista.findIndex(item => item.nome === snapshot.data().contratante);
            setContratanteSelected(index)
            setIdShow(true)
        })
        .catch((error)=>{
            console.log(error)
            toast.error(error.message)
            setIdShow(false)
        })
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (idShow) {
            const docRef = doc(db, "shows", id);
            await updateDoc(docRef,{
                contratante: contratante[contratanteSelected].nome,
                projeto: projeto,
                valor: valor,
                data: data,
                status: status,
                observacoes: observacoes,
                userId: user.uid
            })
            .then(()=>{
                toast.info("Show atualizado com sucesso!")
                setValor('');
                setData(new Date())
                setContratanteSelected(0)
                setObservacoes('');

                navigate("/shows");

            })
            .catch((error)=>{
                console.log(error);
                toast.error(error.message)
            })

            return;
        }

        if (valor !== '') {
            await addDoc(collection(db, "shows"), {
                created: new Date(),
                contratante: contratante[contratanteSelected].nome,
                projeto: projeto,
                valor: parseFloat(valor.replace(/[^\d,]/g, '').replace(',', '.')),
                data: data,
                status: status,
                observacoes: observacoes,
                userId: user.uid
            })
            .then(()=>{
                toast.success("Show salvo com sucesso!");
                setValor('');
                setData(new Date())
                setContratanteSelected(0)
                setObservacoes('');
                //navigate("/shows")
            })   
            .catch((error)=>{
                console.log(error);
                console.log(error.message)
                toast.error(error.message)
            })
            
        } else {
            toast.error("Favor preencher o valor")
        }
    }

    function handleChangeContratante(e) {
        setContratanteSelected(e.target.value);
    }

    function handleSelectProjeto(e) {
        setProjeto(e.target.value);
    }

    function handleOptionChange(e) {
        setStatus(e.target.value)
    }

    return(
        <div>
            <Header />
            <div className='content'>
                <Title name="Novo show">
                    <FiPlusCircle size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleSubmit}>
                        <label>Contratante</label>
                        {
                            loadContratantes ? (
                                <input type='text' disabled={true} value="Carregando..." />
                            ) : (
                                <select value={contratanteSelected} onChange={handleChangeContratante}>
                                    {
                                        contratante.map((item, index)=>{
                                            return(
                                                <option key={index} value={index}>
                                                    {item.nome}
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                            )
                        }

                        <label>Projeto</label>
                        <select value={projeto} onChange={handleSelectProjeto}>
                            <option value="Banda completa">Banda completa</option>
                            <option value="Banda reduzida">Banda reduzida</option>
                            <option value="Conjunto">Conjunto</option>
                        </select>

                        <label>Valor</label>
                        <NumericFormat 
                            value={valor}
                            prefix='R$ '
                            thousandSeparator="."
                            decimalSeparator=","
                            fixedDecimalScale={2}
                            decimalScale={2}
                            thousandsGroupStyle='brl'
                            onChange={(e)=> setValor(e.target.value)}
                            placeholder='R$ 0,00'
                        />

                        <label>Data</label>
                        <DatePicker
                            
                            selected={data}
                            onChange={(date)=>{setData(date)}}
                            dateFormat="dd/MM/yyyy"
                            dropdownMode="select"
                            locale={ptBR}
                         
                        />
                        
                        
                        <label>Status</label>
                        <div className='status'>
                            <input
                                type='radio'
                                name='radio'
                                value='Aberto'
                                onChange={handleOptionChange}
                                checked={status === 'Aberto'}
                            />
                            <span>Em aberto</span>
                            
                            <input
                                type='radio'
                                name='radio'
                                value='Finalizado'
                                onChange={handleOptionChange}
                                checked={status === 'Finalizado'}
                            />
                            <span>Finalizado</span>
                        </div>

                        <label>Observaçoes</label>
                        <textarea
                            type='text'
                            placeholder='Descreva as observaçoes (opcional)'
                            value={observacoes}
                            onChange={(e)=>setObservacoes(e.target.value)}
                        />

                        <button type='submit'>Salvar</button>
                    </form>

                </div>
            </div>
        </div>
    )
}