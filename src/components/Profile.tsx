import { useContext } from 'react';
import {getAuth, signOut} from 'firebase/auth';
import {app} from 'firebaseApp';
import {toast} from 'react-toastify';
import AuthContext from 'context/AuthContext';

const onSignOut =  async()=>{
    try{
        const auth = getAuth(app);
        await signOut(auth);
        toast.success("Successfully logged out!");
    } catch(error:any){
        toast.error(error?.code);
    }

}

export default function Profile() {
    const { user }=useContext(AuthContext);

    return <div className="profile__box">
       <div className="flex__box-lg">
            <div className="profile__img"/>
            <div>
                <div className="profile__email">{user?.email}</div>
                <div className="profile__name">{user?.displayName}</div>
            </div>
        </div> 
        <div 
            role="presentation"
            className="profile__logout" 
            onClick = {onSignOut}
        >
            Log Out
        </div>
    </div>
};
