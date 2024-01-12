import { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {app} from 'firebaseApp';
import {getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import {toast} from 'react-toastify';

export default function SignupForm() {
    const [error, setError] =useState<string>("");
    const [email,setEmail] =useState<string>("");
    const [password,setPassword] =useState<string>("");
    const [passwordConfirm,setPasswordConfirm] =useState<string>("");
    const navigate = useNavigate();

    const onSubmit =  async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const auth=getAuth(app);
            await createUserWithEmailAndPassword( auth, email, password );
            
            toast.success("Successfully signed up.");
            navigate("/");
        } catch (error:any) {
            toast.error(error?.code)
        }
    }

    const onChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const{
            target:{ name, value },
        } = e;   
        if( name === 'email'){
            setEmail(value);
            const validRegex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

            if( !value?.match(validRegex) ){
                setError("Incorrect email format.");
            }else{
                setError("");
            }
        }
        if( name === 'password'){
            setPassword(value);

            if(value?.length < 8){
                setError("Please enter a password with 8 or more characters.");
            } else if( passwordConfirm.length > 0 && passwordConfirm !== value ){
                setError("Password and confirm password should match.");
            }
            else{
                setError("");
            }
        }
        if( name === 'password_confirm'){
            setPasswordConfirm(value);

            if(value?.length < 8){
                setError("Please enter a password with 8 or more characters.");
            } else if( value !== password){
                setError("Please enter the same password from above.");
            } 
            else{
                setError("");
            }
        }
    }
    return(
        <form onSubmit={onSubmit} className="form form--lg">
            <h1 className="form__title">Signup</h1>
            <div className="form__block">
                <label htmlFor="email">E-mail</label>
                <input 
                    type="email" 
                    name="email" 
                    id="email" 
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
                    required
                    onChange={onChange}
                />
            </div>
            <div className="form__block">
                <label htmlFor="password_confirm">Password Confirm</label>
                <input 
                    type="password" 
                    name="password_confirm" 
                    id="password_confirm" 
                    required
                    onChange={onChange}
                />
            </div>
            { error && error?.length > 0 && (
                <div className="form__block">
                    <div className="form__error">{error}</div>
                </div>
            ) }
            <div className="form__block">
                Already have an Account? 
                <Link className="form__link" to="/login"> 
                    Log In
                </Link>
            </div>
            <div className="form__block">
                <input 
                    type="submit" 
                    value="Sign Up" 
                    className="form__btn--submit" 
                    disabled={(error?.length > 0)}
                />
            </div>
        </form>
    );
};
