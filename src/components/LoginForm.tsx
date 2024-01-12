import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {app} from 'firebaseApp';
import { getAuth, signInWithEmailAndPassword } from '@firebase/auth';

export default function LoginForm() {
    const[error, setError] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const[password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const auth = getAuth(app);
            await signInWithEmailAndPassword(auth, email, password)

            toast.success("Successfully logged in.");
            navigate("/");
        } catch (error:any) {
            toast.error(error?.code);
        }
    }

    const onChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const {
            target:{ name, value },
        } = e;

        if(name === "email"){
            setEmail(value);
            const validRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

            if( !value?.match(validRegex) ){
                setError("Incorrect email format.");
            }else{
                setError("");
            }   

        } 
        if(name === "password"){
            setPassword(value);

            if(value?.length < 8){
                setError("Please enter a password with 8 or more characters.");
            }else{
                setError("");
            }
            
        } 

    }

    return(
        <form onSubmit={onSubmit} className="form form--lg">
            <h1 className="form__title">Login</h1>
            <div className="form__block">
                <label htmlFor="email">E-mail</label>
                <input 
                    type="email" 
                    name="email" 
                    id="email" 
                    value={email}
                    required
                    onChange={onChange}
                />
            </div>
            <div className="form__block">
                <label htmlFor="password">Password</label>
                <input 
                    type="password" 
                    name="password" 
                    id="password" 
                    value={password}
                    required
                    onChange={onChange}
                />
            </div>
            {error && error.length >0 && (
                <div className="form__block">
                    <div className="form__error">
                        {error}
                    </div>
                </div>   
            )}
            <div className="form__block">
                No Account? 
                <Link className="form__link" to="/signup"> 
                    Sign up
                </Link>
            </div>
            <div className="form__block">
                <input 
                    type="submit" 
                    value="Login" 
                    className="form__btn--submit"
                    disabled = {error?.length>0}
                />
            </div>
        </form>
    );
};
