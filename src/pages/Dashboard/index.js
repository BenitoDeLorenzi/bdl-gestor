import Header from "../../components/Header";
import Title from '../../components/Title'

import { FiHome } from 'react-icons/fi'

import './dashboard.css'

export default function Dashboard() {
    return(
        <div>
            <Header />
            <div className="content">
                <Title name="Home">
                    <FiHome size={25} />
                </Title>
            </div>
        </div>
    )
}