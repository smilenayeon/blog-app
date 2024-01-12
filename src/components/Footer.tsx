import {Link} from 'react-router-dom';
import  {useContext} from 'react';
import ThemeContext from 'context/ThemeContext';
import {BsSun, BsMoonFill} from 'react-icons/bs';

export default function Footer(){
    const context = useContext(ThemeContext);

    return <>
  
       <footer>
            <div>
                <Link to="/posts/new">Compose</Link>
                <Link to="/posts">Posts</Link>
                <Link to="/profile">Profile</Link>
            </div>
            <>
                {context.theme === "light" ? (
                    <BsSun onClick={context.toggleMode} className="footer__theme-btn"/> 
                ) : (
                    <BsMoonFill onClick={context.toggleMode} className="footer__theme-btn"/>
                )}
            </>
        </footer>
        
    </>
}