import { useContext, useState, useEffect } from "react";
import {toast} from "react-toastify";
import { collection, addDoc, getDoc, doc, updateDoc } from "firebase/firestore"; 
import {db} from "firebaseApp";
import AuthContext from "context/AuthContext";
import { useNavigate, useParams } from "react-router";
import { CATEGORIES, CategoryType, PostProps } from "./PostList";

export default function PostForm() {
    const params = useParams();
    const [post, setPost] = useState<PostProps | null>(null);
    const [title, setTitle] = useState<string>("");
    const [category, setCategory] = useState<CategoryType>("Frontend");
    const [summary, setSummary] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();

    const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if(post && post.id){
                //if there's post data then update data using firestore
                const postRef = doc(db, "posts", post?.id);
                await updateDoc(postRef, {
                    title: title,
                    summary: summary,
                    content: content,
                    updatedAt: new Date()?.toLocaleString(),
                    category: category,
                });
                toast.success("Successfully editted.");
                navigate(`/posts/${post.id}`); 

            }else{
                //create data using firestore
                await addDoc(collection(db, "posts"),{
                    title: title,
                    summary: summary,
                    content: content,
                    createdAt: new Date()?.toLocaleString(),
                    email: user?.email,
                    uid : user?.uid,
                    category: category,
                });
                toast.success("Successfully posted.");
                navigate("/");  
            }
        } catch (error:any) {
            toast.error(error?.code)
        }

    }

    const onChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement >) => {
        const {
            target:{name, value}
        } = e;

        if( name === "title" ){
            setTitle(value);

        }
        if( name === "summary" ){
            setSummary(value);

        }
        if( name === "content" ){
            setContent(value);

        }
        if( name === "category" ){
            setCategory(value as CategoryType);

        }
    };

    const getPost = async ( id:string ) => {
        if (id) {
            const docRef = doc(db, "posts", id);
            const docSnap = await getDoc(docRef);

            setPost({id: docSnap.id, ...(docSnap.data() as PostProps) });
        }
    };

    useEffect( () => {
        if (params?.id) getPost(params?.id);

    },[params?.id]);

    useEffect ( () => {
        if (post) {
            setTitle(post?.title);
            setSummary(post?.summary);
            setContent(post?.content);
            setCategory(post?.category as CategoryType);
        }
    },[post]);
 

    return(
        <form onSubmit={onSubmit} className="form">
            <div className="form__block">
                <label htmlFor="title">Title</label>
                <input 
                    type="text" 
                    name="title" 
                    id="title"
                    value={title} 
                    required
                    onChange={onChange}
                />
            </div>
            <div className="form__block">
                <label htmlFor="category">Category</label>
                <select name="category" id="category" onChange={onChange} defaultValue={category}>
                    <option value="">Choose the Category</option>
                    {CATEGORIES?.map( (category) => 
                        (<option value={category} key={category}>
                            {category}
                        </option>)
                    )}
                </select>
            </div>
            <div className="form__block">
                <label htmlFor="summary">Summary</label>
                <input 
                    type="text" 
                    name="summary" 
                    id="summary" 
                    value={summary}
                    required
                    onChange={onChange}
                />
            </div>
            <div className="form__block">
                <label htmlFor="content">Content</label>
                <textarea 
                    name="content" 
                    id="content" 
                    value={content}
                    required
                    onChange={onChange}
                >
                </textarea>
            </div>
            <div className="form__block">
                <input 
                    type="submit" 
                    value={ post ? "Edit" : "Submit"} 
                    className="form__btn--submit"
                />
            </div>
        </form>
    );
};
