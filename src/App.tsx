import {useState, useEffect, useContext} from 'react';
import Router from './components/Router';
import {app} from 'firebaseApp';
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from 'components/Loader';
import ThemeContext from 'context/ThemeContext';

function App() {
  const context =useContext(ThemeContext);
   const auth = getAuth(app);
  //before checking auth (before initialization) show loader
  const [init, setInit] = useState<boolean>(false);
  //currentUser? then change isAuthenticated to true
   const [isAuthneticated, setIsAuthenticated] = useState<boolean>(
    !!auth?.currentUser
   );
   useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setInit(true);
    });
   }, [auth]);
  return (
   <div className={ context.theme === "light" ? "white" : "dark"}>
    <ToastContainer/>
    {init ? <Router isAuthenticated={isAuthneticated} /> : <Loader/>}
    </div>
  );
}

export default App;
