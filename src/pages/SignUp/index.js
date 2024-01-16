import { useState, useContext } from 'react'
import { Link } from 'react-router-dom';

import logo from '../../assets/logo.png'

import Spinner from '../../components/Spinner';

import { AuthContexts } from '../../contexts/auth';

export default function SignUp() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const { signUp, loadingAuth } = useContext(AuthContexts);

    async function handleSubmit(e) {
        e.preventDefault();

        if (name !== '' && email !== '' && password !== '') {
          await signUp(email, password, name)
        }
    }

    return(
        <div className='container-center'>
            <div className='login'>
                <div className='login-area'>
                    <img src={logo} alt='Logo do sistema BDL Gestor'/>
                </div>

                <form onSubmit={handleSubmit}>
                    <h1>Nova conta</h1>
                    <input 
                        type='text' 
                        placeholder='Nome' 
                        value={name}
                        onChange={(e)=> setName(e.target.value)}
                    />
                    <input 
                        type='email' 
                        placeholder='E-mail' 
                        value={email}
                        onChange={(e)=> setEmail(e.target.value)}
                    />
                    
                    <input 
                        type='password' 
                        placeholder='Senha' 
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                    />

                    <button type='submit'>
                        {loadingAuth ? <Spinner /> : 'Cadastrar' }
                    </button>
                </form>

                <Link to="/">Ja possui uma conta? Faça login</Link>

            </div>
        </div>
    )
}