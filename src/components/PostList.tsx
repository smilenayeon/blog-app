import {Link} from 'react-router-dom';
import {useState, useEffect,useContext} from 'react';
import { collection, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore";
import {db} from 'firebaseApp';
import AuthContext from 'context/AuthContext';
import { toast } from 'react-toastify';

interface PostListProps {
    hasNavigation?:boolean;
    defaultTab?:TabType | CategoryType;
}
type TabType = "all" | "my";

export interface CommentsInterface{
    content:string;
    uid:string;
    email:string;
    createdAt:string;
}

export interface PostProps{
    id?:string,
    title:string,
    email:string,
    summary:string,
    content:string,
    createdAt:string
    updatedAt:string,
    uid:string,
    category?: CategoryType;
    comments?:CommentsInterface[];
}

export type CategoryType = "Frontend" | "Backend" | "Web" | "Native";
export const CATEGORIES: CategoryType[] = [
  "Frontend",
  "Backend",
  "Web",
  "Native",
];

export default function PostList({ hasNavigation = true, defaultTab = 'all'}:PostListProps) {
    const {user} = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState<TabType | CategoryType>(defaultTab);
    const [posts, setPosts] = useState<PostProps[]>([]);

    const getPosts = async() => {
        setPosts([]); // to prevent updated posts list just being added to previous posts list
        let postsRef = collection (db, "posts");
        let postsQuery;

        if(activeTab === "my" && user){
            //show my posts
            postsQuery = query(
                postsRef, 
                where("uid", "==", user.uid), 
                orderBy("createdAt", "asc")
            );
        } else if (activeTab === "all") {
            //show all the posts
            postsQuery = query(postsRef, orderBy("createdAt", "asc"));
        } else {
            //show posts under the coressponding category
            postsQuery = query(
                postsRef, 
                where("category", "==", activeTab), 
                orderBy("createdAt", "asc")
            );
        }
        const datas = await getDocs(postsQuery);
        datas?.forEach((doc) => {
            const dataObj ={ ...doc.data(), id:doc.id };
            setPosts((prev)=>[...prev, dataObj as PostProps]);
        });
    };

    useEffect(()=>{
        getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[activeTab]);

    const handleDelete = async( id:string) => {
        const confirm = window.confirm("Do you want to delete the post?");
        if(confirm && id){
            await deleteDoc(doc(db, "posts", id));

            toast.success("Successfully deleted");
            getPosts(); //call the updated posts list
        };
        

    };


    return(
        <>
            {hasNavigation &&(
                <div className="post__navigation">
                    <div 
                        role="presentation" 
                        onClick={()=>setActiveTab("all")}
                        className={activeTab === "all" ? "post__navigation--active" : ""}
                    >
                        All Posts
                    </div>
                    <div 
                        role="presentation"
                        onClick={()=>setActiveTab("my")}
                        className={activeTab === "my" ? "post__navigation--active" : ""}
                    >
                        My Posts
                    </div>
                    
                    {CATEGORIES?.map((category)=>(
                        <div 
                            key={category}
                            role="presentation" 
                            onClick={()=>setActiveTab(category)}
                            className={activeTab === category ? "post__navigation--active" : ""}
                        >
                            {category}
                        </div>
                    ))}
                </div>   
            )}
            <div className="post__list">
                    {posts?.length > 0 ? posts?.map((post,index) =>(
                        <div key={post?.id} className="post__box">
                            <Link to={`/posts/${post?.id}`}>
                                <div className="post__profile-box">
                                    <div className="post__profile"/>
                                    <div className="post__author-name">{post?.email}</div>
                                    <div className="post__date">{post?.createdAt}</div>
                                </div>
                                <div className="post__title">{post?.title}</div>
                                <div className="post__text">{post?.summary}</div>
                            </Link>
                                {post?.email === user?.email && (
                                <div className="post__utils-box">
                                    <div 
                                        className="post__delete" 
                                        role="presentation" 
                                        onClick={ () => handleDelete(post.id as string)}
                                    >
                                        Delete
                                    </div>
                                    <div className="post__edit">
                                        <Link to={`/posts/edit/${post?.id}`} className="post__edit">Edit</Link>
                                    </div>
                                </div>  
                                )}
                                
                            
                        </div>
                    ))
                    : <div className="post__no-post"> "There's no post to show."</div>
                    }
                </div>
        </>
    );
};
