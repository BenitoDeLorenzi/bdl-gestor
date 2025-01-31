import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InputMask  from 'react-input-mask';
import Header from '../../components/Header'
import Title from '../../components/Title'
import { FiPlusCircle } from 'react-icons/fi';

import { db } from '../../services/firebaseConnection';
import { collection, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore';

import { toast } from 'react-toastify';

export default function NewCustomers() {
    const { id } = useParams();

    const [nome, setNome] = useState('');
    const [whatsApp, setWhatsApp] = useState('');
    const [tipo, setTipo] = useState('Casa noturna');
    const [contato, setContato] = useState('');
    const [endereco, setEndereco] = useState('');
    const [idCustomer, setIdCustomer] = useState(false)

    const navigate = useNavigate();

    useEffect(()=>{
        if (id) {
            loadId();
        }
    }, [id])

    async function loadId() {
        const docRef = doc(db, "customers", id);
        await getDoc(docRef)
        .then((snapshot)=>{
            setNome(snapshot.data().nome);
            setWhatsApp(snapshot.data().whatsApp);
            setContato(snapshot.data().contato);
            setEndereco(snapshot.data().endereco);
            setTipo(snapshot.data().tipo)
            setIdCustomer(true)
        })
        .catch((error)=>{
            console.log(error)
            toast.error(error.message)
            setIdCustomer(false)
        })

        return;
    }

    async function handleRegister(e) {
        e.preventDefault();

        if (idCustomer) {
            const docRef = doc(db, "customers", id);
            await updateDoc(docRef,{
                nome: nome,
                whatsApp: whatsApp,
                tipo: tipo,
                contato: contato,
                endereco: endereco
            })
            .then(()=>{
                setNome('')
                setWhatsApp('')
                setContato('')
                setEndereco('')
                toast.info("Atualizado com sucesso!")
                navigate("/customers");
            })
            .catch((error)=>{
                console.log(error);
                toast.error(error.message)
            })

            return;
        }

        if (nome !== '' && whatsApp !== '' && contato !== '' && endereco !== '') {
           await addDoc(collection(db,"customers"), {
            nome: nome,
            whatsApp: whatsApp,
            tipo: tipo,
            contato: contato,
            endereco: endereco
           })
           .then(()=>{
            setNome('')
            setWhatsApp('')
            setContato('')
            setEndereco('')
            toast.success("Salvo com sucesso!")
            navigate("/customers");
           })
           .catch((error)=>{
            console.log(error)
            toast.error(error.message)
           })
        } else {
            toast.error("Preencha todos os campos")
            return;
        }
    }

    function handleChangeTipo(e) {
        setTipo(e.target.value)
    }

    return(
        <div>
            <Header />
            <div className='content'>
                <Title name="Novo contratante">
                    <FiPlusCircle size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>
                        <label>Nome contratante</label>
                        <input
                            type='text'
                            placeholder='Nome do contratante'
                            value={nome}
                            onChange={(e)=>setNome(e.target.value)}
                        />

                        <label>WhatsApp</label>
                        <InputMask
                            mask="(99) 99999-9999"
                            placeholder='WhatsApp'
                            value={whatsApp}
                            onChange={(e) => setWhatsApp(e.target.value)}
                        />

                        <label>Tipo de contratante</label>
                        <select value={tipo} onChange={handleChangeTipo}>
                            <option value="Casa noturna">Casa noturna</option>
                            <option value="Particular" >Particular</option>
                        </select>

                        <label>Pessoa de contato</label>
                        <input
                            type='text'
                            placeholder='Nome da pessoa'
                            value={contato}
                            onChange={(e)=>setContato(e.target.value)}
                        />

                        <label>Endereço</label>
                        <input
                            type='text'
                            placeholder='Endereço da empresa'
                            value={endereco}
                            onChange={(e)=>setEndereco(e.target.value)}
                        />

                        <button type='submit'>Salvar</button>
                    </form>

                </div>
            </div>


          
        </div>
    )
}