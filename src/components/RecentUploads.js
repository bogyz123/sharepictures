import { getDownloadURL, getMetadata, getStorage, list, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import styles from "../css/RecentUploads.module.css";

export default function RecentUploads() {
    const [downloadLinks, setDownloadLinks] = useState([]);
    const [metadata, setMetadata] = useState([]);

    useEffect(() => {
        const storage = getStorage();
        const listRef = ref(storage, "/images");
        list(listRef, { maxResults: 15 }).then((response) => {
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
            {downloadLinks.map((img, index) => <Image key={index} image={img} size={metadata[index].size} uploaded={metadata[index].timeCreated} />)}
        </div>

    )
}
function Image({ image, size, uploaded }) {
    return (
        <div>

            <img src={image} onClick={() => window.location.href = `${image}`} className={`${styles.image} hoverable`} />
            <div className={styles.metadata}>
                <p>Size [MB]: {size * 0.000001}</p>
                <p>Created at: {uploaded}</p>
            </div>


        </div>

    )
}