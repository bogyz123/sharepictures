import { Folder, ThumbDownSharp, ThumbDownTwoTone, ThumbUpSharp, ThumbUpTwoTone } from "@mui/icons-material";
import { getDownloadURL, getMetadata, getStorage, listAll, ref, updateMetadata } from "firebase/storage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styles from "../css/RecentUploads.module.css";
import { storage } from "./fire_connection";
import { shortenSize } from "./ImageTemplate";

export default function RecentUploads() {
    const [downloadLinks, setDownloadLinks] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [metadata, setMetadata] = useState([]);
    const [folders, setFolders] = useState([]);
    const [folderMetadata, setFolderMetadata] = useState({});
    const storage = getStorage();
    const listRef = ref(storage, "/images");
    const nav = useNavigate();
    const navigateFolder = (state) => {
        nav("/folder", { state: state })
    }

    // TODO: napraviti ovaj div relative, i p absolute, napisati unutra info o folderu...
    // Kada se folder klikne uzme path od foldera i navigatea na FolderTemplate i da mu taj path (da bi mogli da fetchujemo iz useEffecta )
    // Uraditi full FolderTemplate dizajn, popraviti ovde dizajn SKROZ, conditional rendering ne radi, etc.
    // Popraviti dizajn za Dialog u multiple files..
    useEffect(() => {
        listAll(listRef, { maxResults: 20 }).then((response) => {
            response.items.length == 0 && response.prefixes.length == 0 ? setIsEmpty(true) : setIsEmpty(false);
            setFolders([...response.prefixes]);
            response.items.map((item) => {
                getDownloadURL(item).then((url) => {
                    getMetadata(item).then((meta) => {

                        setDownloadLinks(before => [...before, url]);
                        setMetadata(before => [...before, meta]);


                    })
                })
            })


        })


    }, [])


    return (
        <div id={styles.imageList}>

            {isEmpty ? <p>EMPTY</p> :

                downloadLinks.map((img, index) =>
                    <Image key={index} path={metadata[index].fullPath} type={metadata[index].contentType}  image={img} size={shortenSize(metadata[index].size * 0.000001)} uploaded={metadata[index].timeCreated} />)}
            {folders.map((folder, index) =>
                <div className={styles.folderContainer}>
                    <Folder key={index+5} className={`hoverable ` + styles.folder} onClick={() => navigateFolder({ path: folder.fullPath })} sx={{ fontSize: '15rem' }} color='success' />
                    <p className={styles.folderText}>Folder {index}</p>
                </div>)}


        </div>

    )

}
function Image({ image, size, uploaded, path, type }) {
    const reference = ref(storage, path);
    // Explanation for like/dislike functions:
    // We check if there are no likes or dislikes on a picture, if so, then create a new variable on the server called likes: or dislikes: with the value of 1
    // If there are already likes/dislikes, we just increment the field value by 1
    // We also prevent the user from liking the same picture more times
    // We could also create the variable when uploading a new image, both ways work.
    const [likeCount, setLikeCount] = useState();
    const [dislikeCount, setDislikeCount] = useState();
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);

    useEffect(() => {
        getMetadata(reference).then((meta) => {
            if (meta.customMetadata.likes === undefined) {
                setLikeCount(0);
            }
            else {
                setLikeCount(meta.customMetadata.likes);
            }
            if (meta.customMetadata.dislikes === undefined) {
                setDislikeCount(0);
            }
            else {
                setDislikeCount(meta.customMetadata.dislikes);
            }
        })
    }, [])

    const likeImage = () => {
        var oldStorage = JSON.parse(localStorage.getItem("sharepictures_likes"));
        
        if (oldStorage === null) {
            localStorage.setItem("sharepictures_likes", JSON.stringify([path]));
        }
        else {
            const likesArray = Array.from(oldStorage);
            if (likesArray.includes(path)) {
                setIsLiked(true);

                return;
            }
            localStorage.setItem("sharepictures_likes", JSON.stringify([...oldStorage, path]));
        } 
        



        getMetadata(reference).then(async (meta) => {

            if (meta.customMetadata.likes === undefined) {
                setLikeCount(1);
                var metadata = {
                    customMetadata: {
                        likes: 1
                    }
                }
                await updateMetadata(reference, metadata);
                
            }
            else {
                var metadata = {
                    customMetadata: {
                        likes: parseInt(meta.customMetadata.likes) + 1
                    }
                }
                await updateMetadata(reference, metadata);
                setLikeCount(metadata.customMetadata.likes);
            }

        })
    }
    const dislikeImage = () => {
        var oldStorage = JSON.parse(localStorage.getItem("sharepictures_dislikes"));
        if (oldStorage === null) {
            localStorage.setItem("sharepictures_dislikes", JSON.stringify([path]));
        }
        else {
            const likesArray = Array.from(oldStorage);
            if (likesArray.includes(path)) {
                setIsDisliked(true);
                return;
            }
            localStorage.setItem("sharepictures_dislikes", JSON.stringify([...oldStorage, path]));
        }
        getMetadata(reference).then(async (meta) => {

            if (meta.customMetadata.dislikes === undefined) {
                setDislikeCount(0);
                var metadata = {
                    customMetadata: {
                        dislikes: 1
                    }
                }
                await updateMetadata(reference, metadata);
            }
            else {
                
                var metadata = {
                    customMetadata: {
                        dislikes: parseInt(meta.customMetadata.dislikes) + 1
                    }
                }
                setDislikeCount(metadata.customMetadata.dislikes);
                await updateMetadata(reference, metadata);
            }
        })
    }
    return (
        <div className={styles.container}>

            <img src={image} onClick={() => window.location.href = `${image}`} className={`${styles.image}  hoverable`} />
            <div className={styles.metadata}>
                <p>Size [MB]: {size}</p>
                <span>File type: {type}</span>
                <p>Created at: {uploaded}</p>
                <div className='flex | centerX' id={styles.likes}>
                    <div className={`hoverable centerY flex ${styles.likeRatio}`}>
                        <span>{likeCount}</span>
                        {isLiked ? <ThumbUpTwoTone /> : <ThumbUpSharp color="success" onClick={(path) => likeImage(path)} />}
                    </div>
                  
                    <div className={`hoverable centerY flex ${styles.likeRatio}`}>
                       {isDisliked ? < ThumbDownTwoTone/> :  <ThumbDownSharp color='error' onClick={() => dislikeImage(path)} />}
                        <span>{dislikeCount}</span>
                    </div>
                </div>
            </div>


        </div>

    )
}