import { useContext, useState } from "react";
import { CommentsInterface, PostProps } from "./PostList";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import AuthContext from "context/AuthContext";
import { db } from "firebaseApp";
import { toast } from "react-toastify";

interface CommentsProps {
    post: PostProps;
    getPost: (id: string) => Promise<void>;
}

export default function Comments({post, getPost}:CommentsProps) {
    const [comment, setComment]= useState("");
    const {user} = useContext(AuthContext);
    

    const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>) =>{
        const {target:{name, value}} = e;
        if(name==="comment") { 
            setComment(value)
        };
    };

    const onSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (post && post?.id) {
                const postRef=doc(db, "posts", post.id);
                if (user?.uid) {
                    const commentObj = {
                        content:comment,
                        uid: user.uid,
                        email: user.email,
                        createdAt: new Date()?.toLocaleString(),
                    };
                
                await updateDoc(postRef, {
                    comments : arrayUnion(commentObj),
                    updatedDate : new Date()?.toLocaleString(),
                });
                //rerender to update the document
                await getPost(post.id);
                }
            }
            toast.success("Comment Successfully Posted.");
            setComment("");
        } catch (error:any) {
            console.log(error);
            toast.error(error?.code);
        }
    };

    const handleDeleteComment = async(data:CommentsInterface) => {
        const confirm = window.confirm("Do you want to delete the comment?");
        if(confirm && post.id){
            const postRef = doc(db, "posts", post?.id);
            await updateDoc(postRef, {comments: arrayRemove(data),
            });
            toast.success("Successfully deleted.")
            //rerender to update the document
            await getPost(post.id);

        }
    };
    return(
        <div className="comments">
            <form className="comments__form"  onSubmit={onSubmit}>
                <div className="form__block">
                    <label htmlFor="comment">Comment</label>
                    <textarea name="comment" id="comment" required value={comment} onChange={onChange}/>
                </div>
                <div className="form__block">
                    <input type="submit" value="Submit" className="form__btn-submit"/>
                </div>
            </form>

            <div className="comments__list">
                {post?.comments?.slice(0)?.reverse()?.map(
                    (comment) => (
                        <div key={comment.createdAt} className="comment__box"> 
                            <div className="comment__profile-box">
                                <div className="comment__email">{comment.email}</div>
                                <div className="comment__date">{comment.createdAt}</div>
                                { (user?.uid === comment?.uid) && (
                                     <div className="comment__delete" onClick={()=> handleDeleteComment(comment)}> 
                                        Delete
                                     </div>
                                )}
                               
                            </div>
                            <div className="comment__text">{comment?.content}</div>
                        </div>
                    )
                )}
            </div>
        </div>
    )};
