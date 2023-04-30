import { Folder, ThumbDownSharp, ThumbDownTwoTone, ThumbUpSharp, ThumbUpTwoTone } from "@mui/icons-material";
import { Alert, Snackbar } from "@mui/material";
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
    const storage = getStorage();
    const listRef = ref(storage, "/images");
    const nav = useNavigate();
    const navigateFolder = (state) => {
        nav("/folder", { state: state })
    }



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

            {isEmpty ? <Alert className="center" severity="error" color="warning" sx={{ background: 'crimson', color: '#fff', width: '100%', position: 'absolute', bottom: '0', left: '0' }}>No images uploaded</Alert> :

                downloadLinks.map((img, index) =>
                    <Image title={metadata[index].customMetadata.title} key={index} path={metadata[index].fullPath} type={metadata[index].contentType} image={img} size={shortenSize(metadata[index].size * 0.000001)} uploaded={metadata[index].timeCreated} />)}
            {folders.map((folder, index) =>
                <div className={styles.folderContainer}>
                    <Folder key={index * 2} className={`hoverable ` + styles.folder} onClick={() => navigateFolder({ path: folder.fullPath })} sx={{ fontSize: '15rem' }} color='success' />
                    <p className={styles.folderText}>Folder {index}</p>
                </div>)}


        </div>

    )

}
function Image({ image, size, uploaded, path, type, title }) {
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
            if (meta.customMetadata === undefined) {
                setLikeCount(0);
            }
            else {
                setLikeCount(meta.customMetadata.likes);

            }
            if (meta.customMetadata === undefined) {
                setDislikeCount(0);
            }
            else {
                setDislikeCount(meta.customMetadata.dislikes);
            }
        })
    }, [])

    const likeImage = () => {
        
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
                <div className='flex | centerX' id={styles.likes}>
                    <div className={`hoverable centerY flex ${styles.likeRatio}`}>
                        <span>{likeCount}</span>
                        {isLiked ? <ThumbUpTwoTone /> : <ThumbUpSharp color="success" onClick={(path) => likeImage(path)} />}
                    </div>

                    <div className={`hoverable centerY flex ${styles.likeRatio}`}>
                        {isDisliked ? < ThumbDownTwoTone /> : <ThumbDownSharp color='error' onClick={() => dislikeImage(path)} />}
                        <span>{dislikeCount}</span>
                    </div>
                    <Snackbar open={isLiked} autoHideDuration={3000} onClose={() => setIsLiked(false)}>
                        <Alert sx={styling.alert} severity="warning">You have already liked this image.</Alert>
                    </Snackbar>
                    <Snackbar open={isDisliked} autoHideDuration={3000} onClose={() => setIsDisliked(false)}>
                        <Alert sx={styling.alert} severity="warning">You have already disliked this image.</Alert>
                    </Snackbar>

                </div>
            </div>

        </div>

    )
}