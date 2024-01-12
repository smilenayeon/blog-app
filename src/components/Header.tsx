import {Link} from 'react-router-dom';
export default function Header(){
    return<>
        <header className="header">
            <Link to="/" className="header__logo ">React Blog</Link>
            <div>
                <Link to="/posts/new">Compose</Link>
                <Link to="/posts">Posts</Link>
                <Link to="/profile">Profile</Link>
            </div>
        </header>
    </>
}