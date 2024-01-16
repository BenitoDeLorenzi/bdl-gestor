import { Routes, Route } from 'react-router-dom';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Dashboard from '../pages/Dashboard';
import Shows from '../pages/Shows';
import NewShow from '../pages/NewShow';
import Profile from '../pages/Profile';
import Customers from '../pages/Customers';
import NewCustomers from '../pages/NewCustomers';
import New from '../pages/New';

import Private from './Private';

function RoutesApp() {
    return(
        <Routes>
            <Route path='/' element={ <SignIn/> } />
            <Route path='/register' element={ <SignUp/> } />

            <Route path='/dashboard' element={ <Private> <Dashboard/> </Private> } />
            <Route path='/shows' element={ <Private> <Shows/> </Private> } />
            <Route path='/newShow' element={ <Private> <NewShow/> </Private> } />
            <Route path='/newShow/:id' element={ <Private> <NewShow/> </Private> } />
            <Route path='/profile' element={ <Private> <Profile/> </Private> } />
            <Route path='/customers' element={ <Private> <Customers/> </Private> } />
            <Route path='/newCustomers' element={ <Private> <NewCustomers/> </Private> } />
            <Route path='/newCustomers/:id' element={ <Private> <NewCustomers/> </Private> } />
            <Route path='/new' element={ <Private> <New/> </Private> } />
            <Route path='/new/:id' element={ <Private> <New/> </Private> } />
            
        </Routes>
    )
}

export default RoutesApp;