import { ThumbDownSharp, ThumbsUpDownSharp, ThumbUpSharp } from "@mui/icons-material";
import { getDownloadURL, getMetadata, getStorage, list, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import styles from "../css/RecentUploads.module.css";
import { shortenSize } from "./ImageTemplate";

export default function RecentUploads() {
    const [downloadLinks, setDownloadLinks] = useState([]);
    const [metadata, setMetadata] = useState([]);
    const likeImage = () => {

    }

    useEffect(() => {
        const storage = getStorage();
        const listRef = ref(storage, "/images");
        list(listRef, { maxResults: 20 }).then((response) => {
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
            {downloadLinks.length <= 0 ?
                <div className='flex | centerY | flexCol' id={styles.emptyList}>
                    <h1>Nothing to show here :(</h1>
                    <small>Start uploading images for them to appear!</small>
                </div>
                : downloadLinks.map((img, index) => <Image type={metadata[index].contentType} dblClick={() => likeImage()} key={index} image={img} size={shortenSize(metadata[index].size * 0.000001)} uploaded={metadata[index].timeCreated} />)}
        </div>

    )

}
function Image({ image, size, uploaded, dblClick, type }) {
    return (
        <div onDoubleClick={dblClick}>

            <img src={image} onClick={() => window.location.href = `${image}`} className={`${styles.image} hoverable`} />
            <div className={styles.metadata}>
                <p>Size [MB]: {size}</p>
                <span>File type: {type}</span>
                <p>Created at: {uploaded}</p>
                <div className='flex | centerX' id={styles.likes}>
                    <div className='hoverable'><ThumbUpSharp /></div>
                    <div className='hoverable'><ThumbDownSharp /></div>
                </div>
            </div>


        </div>

    )
}