import { useContext } from 'react';
import avatarImg from '../../assets/avatar.png';
import { Link } from 'react-router-dom'

import { AuthContexts } from '../../contexts/auth';
import { FiHome, FiUser, FiSettings, FiMusic } from "react-icons/fi";

import './header.css'

export default function Header() {
    const { user } = useContext(AuthContexts);

    return(
        <div className="sidebar">
            <div>
                <img src={user.avatarUrl === null ? avatarImg : user.avatarUrl} alt="Foto do usuario"/>
            </div>

            <Link to="/dashboard">
                <FiHome color='#FFF' size={24}/>
                Home
            </Link>

            <Link to="/shows">
                <FiMusic color='#FFF' size={24}/>
                Shows
            </Link>
           
            <Link to="/customers">
                <FiUser color='#FFF' size={24}/>
                Contratantes
            </Link>
           
            <Link to="/profile">
                <FiSettings color='#FFF' size={24}/>
                Perfil
            </Link>
        </div>
    )
}