import { Folder, ThumbDownSharp, ThumbDownTwoTone, ThumbUpSharp, ThumbUpTwoTone } from "@mui/icons-material";
import { Alert, Button, Snackbar } from "@mui/material";
import { getDownloadURL, getMetadata, getStorage, listAll, ref, updateMetadata } from "firebase/storage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styles from "../css/RecentUploads.module.css";
import { shortenSize } from "./ImageTemplate";
import { storage } from "./fire_connection";

export default function RecentUploads() {
    const [downloadLinks, setDownloadLinks] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);
    const [metadata, setMetadata] = useState([]);
    const [folders, setFolders] = useState([]);
    const storage = getStorage();
    const listRef = ref(storage, "/images");
    const nav = useNavigate();
    const navigateFolder = (state) => {
        nav("/folder", { state: state })
    }



    useEffect(() => {
        listAll(listRef, { maxResults: 20 }).then((response) => { // Get all files
            response.items.length == 0 && response.prefixes.length == 0 ? setIsEmpty(true) : setIsEmpty(false);
            setFolders([...response.prefixes]);
            response.items.map((item) => {
                getDownloadURL(item).then((url) => {
                    getMetadata(item).then((meta) => {
                        setDownloadLinks(before => [...before, url]);
                        setMetadata(before => [...before, meta]);
                    });
                });
            });
        })
    }, [])


    return (
        <div id={styles.imageList}>

            {isEmpty ? <Alert className="center" severity="error" color="warning" sx={{ background: 'crimson', color: '#fff', width: '100%', position: 'absolute', bottom: '0', left: '0' }}>No images uploaded</Alert> :

                downloadLinks.map((img, index) =>
                    <Image key={index} title={metadata[index].customMetadata.title} likes={metadata[index].customMetadata.likes} imgPath={metadata[index].customMetadata.path} path={metadata[index].fullPath} dislikes={metadata[index].customMetadata.dislikes} type={metadata[index].contentType} image={img} size={shortenSize(metadata[index].size * 0.000001)} uploaded={metadata[index].timeCreated.slice(0, -14)} />)}
            {folders.map((folder, index) =>
                <div className={styles.folderContainer}>
                    <Folder key={index * 2} className={`hoverable ` + styles.folder} onClick={() => navigateFolder({ path: folder.fullPath })} sx={{ fontSize: '15rem' }} color='success' />
                    <p className={styles.folderText}>Folder {index}</p>
                </div>)}


        </div>

    )

}
function Image({ image, size, uploaded, path, type, title, likes, dislikes, imgPath }) {

    const reference = ref(storage, path);
    const [likeCount, setLikeCount] = useState(likes);
    const [dislikeCount, setDislikeCount] = useState(dislikes);
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const nav = useNavigate();


    const likeImage = () => {
        // This is a good & a bad way to check if client liked the image or not. 
        // Good: works, full privacy
        // Bad: user can delete localStorage and re-like or re-dislike the image
        // Potential fix is to add server-sided checking by storing the user's account id on the likedBy array on the image metadata but this website does not support account creation.
        var oldStorage = JSON.parse(localStorage.getItem("sharepictures_likes"));
        var dislikes = JSON.parse(localStorage.getItem("sharepictures_dislikes"));

        if (oldStorage === null) { // If we never liked anything, then create an array of liked images and append this one to it
            localStorage.setItem("sharepictures_likes", JSON.stringify([path]));
        }
        else {
            // If we have liked something, then just check if we ever liked this image (with it's path), if we have not, then add this image to likedArray
            const likesArray = Array.from(oldStorage);
            if (likesArray.includes(path)) {
                setIsLiked(true);
                return;
            }
            if (dislikes.includes(path)) { return }
            localStorage.setItem("sharepictures_likes", JSON.stringify([...oldStorage, path]));
        }

        getMetadata(reference).then(async (meta) => { // When that's done, get the current image metadata from the server, and append likes variable by 1
            const metadata = {
                customMetadata: {
                    likes: parseInt(meta.customMetadata.likes) + 1
                }
            }
            setLikeCount(metadata.customMetadata.likes);
            await updateMetadata(reference, metadata);
        })
    }
    const dislikeImage = () => {
        // This works the same way like likeImage function, check it out above.
        var oldStorage = JSON.parse(localStorage.getItem("sharepictures_dislikes"));
        var likes = JSON.parse(localStorage.getItem("sharepictures_likes"));
        if (oldStorage === null) {
            localStorage.setItem("sharepictures_dislikes", JSON.stringify([path]));
        }
        else {
            const dislikesArray = Array.from(oldStorage);
            if (dislikesArray.includes(path)) {
                setIsDisliked(true);
                return;
            }
            if (likes.includes(path)) { return }


            localStorage.setItem("sharepictures_dislikes", JSON.stringify([...oldStorage, path]));

        }
        getMetadata(reference).then(async (meta) => {
            const metadata = {
                customMetadata: {
                    dislikes: parseInt(meta.customMetadata.dislikes) + 1
                }
            }
            setDislikeCount(metadata.customMetadata.dislikes);
            await updateMetadata(reference, metadata);
        })



    }
    const styling = {
        alert: {
            backgroundColor: "yellow",
            fontFamily: 'Kanit, sans-serif',
            color: 'rgb(0,0,255)'
        }
    }
    return (
        <div className={styles.container}>

            <img src={image} onClick={() => window.location.href = `${image}`} className={`${styles.image}  hoverable`} />
            <div className={styles.metadata}>
                {title && <p>Title: {title}</p>}
                <p>Size [MB]: {size}</p>
                <span>File type: {type}</span>
                <p>Created at: {uploaded}</p>
                <Button style={{background:'navy', color:'white', width:'100%'}} onClick={() => window.location.href="https://bogyz123.github.io/sharepictures/#/image/" + imgPath}>Open</Button>
                <div className='flex | centerX' id={styles.likes}>
                    <div className={`hoverable centerY flex ${styles.likeRatio}`}>
                        <span>{likeCount}</span>
                        {isLiked ? <ThumbUpTwoTone /> : <ThumbUpSharp color="success" onClick={(path) => likeImage(path)} />}
                    </div>

                    <div className={`hoverable centerY flex ${styles.likeRatio}`}>
                        {isDisliked ? < ThumbDownTwoTone /> : <ThumbDownSharp color='error' onClick={() => dislikeImage(path)} />}
                        <span>{dislikeCount}</span>
                    </div>


                </div>
            </div>
            <Snackbar open={isLiked} autoHideDuration={3000} onClose={() => setIsLiked(false)} sx={{ bottom: 0, left: 0, position: 'absolute' }}>
                <Alert sx={styling.alert} severity="warning">
                    You have already liked this image.
                </Alert>
            </Snackbar>

            <Snackbar open={isDisliked} autoHideDuration={3000} onClose={() => setIsDisliked(false)} sx={{ bottom: 0, left: 0, position: 'absolute' }}>
                <Alert sx={styling.alert} severity="warning">
                    You have already disliked this image.
                </Alert>
            </Snackbar>

        </div>

    )
}