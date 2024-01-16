import { useState, useEffect, createContext } from 'react';
import { auth, db } from '../services/firebaseConnection';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const AuthContexts = createContext({});

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();

    useEffect(()=>{
        async function loadUser(params) {
            const storageUser = localStorage.getItem("@BDLgestor")

            if (storageUser) {
                setUser(JSON.parse(storageUser))
                setLoading(false)
            }

            setLoading(false)

        }

        loadUser()
    },[])

    async function signIn(email, password) {
        setLoadingAuth(true);

        await signInWithEmailAndPassword(auth, email, password)
        .then( async (value)=>{
            let uid = value.user.uid

            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            let data = {
                uid: uid,
                nome: docSnap.data().nome,
                email: value.user.email,
                avatarUrl: docSnap.data().avatarUrl
            }

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success("Bem-vindo(a) de volta!");
            navigate("/dashboard");
        })
        .catch((error)=>{
            console.log(error.message)
            toast.error(error.message)
            setLoadingAuth(false)
        })
    }

    async function signUp(email, password, name) {
        setLoadingAuth(true)

        await createUserWithEmailAndPassword(auth, email, password)
        .then( async (value)=>{
            let uid = value.user.uid

            await setDoc(doc(db, "users", uid), {
                nome: name,
                avatarUrl: null, 
            })
            .then(()=>{
                let data = {
                    uid: uid,
                    nome: name,
                    email: value.user.email,
                    avatarUrl: null
                }

                setUser(data)
                storageUser(data)
                setLoadingAuth(false)
                toast.success("Seja bem-vindo ao nosso sistema")
                navigate("/dashboard")
            })

        })
        .catch((error)=>{
            console.log(error.message)
            toast.error(error.message)
            setLoadingAuth(false)
        })
    }

    function storageUser(data) {
        localStorage.setItem('@BDLgestor', JSON.stringify(data))
    }

    async function logout() {
        await signOut(auth);
        localStorage.removeItem("@BDLgestor")
        setUser(null)
    }

    return(
        <AuthContexts.Provider
            value={{
                signed: !!user,
                user,
                signIn,
                signUp,
                logout,
                loadingAuth,
                loading, 
                storageUser,
                setUser
            }}
        >
            {children}
        </AuthContexts.Provider>
    )
}

export default AuthProvider;

