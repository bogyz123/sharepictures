import { Alert, Button } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router"
import { db, storage } from "./fire_connection";
import styles from "../css/ImageTemplate.module.css";
import "../css/Global.css";
import { getDownloadURL, getMetadata, getStorage, ref } from "firebase/storage";


export default function ImageTemplate() {
    const { id } = useParams();
    const [error, setError] = useState(false);
    const [image, setImage] = useState();
    const [metadata, setMetadata] = useState({});
    const [downloadLink, setDownloadLink] = useState(null);

    useEffect(() => {

        getDownloadURL(ref(storage, `images/${id}`)).then((url) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            setImage(url);
        }).then(() => {
            getMetadata(ref(storage, `images/${id}`)).then((metadata) => {
                setMetadata(metadata);
            })
        })
    }, [])
    return (
        <div id={styles.template} className="flex | flexCol | centerY">
            {error && <div><Alert severity="error">This image does not exist.</Alert></div>}
            <img src={image} id={styles.image} />
            {image != null &&
                <div className=' flex | flexCol | centerY'>
                    <h3><em>Uploaded on {metadata.timeCreated}</em></h3>
                    <h4 id='size'>Size (MB): {metadata.size * 0.000001}</h4>
                    <Button variant='contained'><a download href={`${image}`}>Download</a></Button>
                </div>
            }
        </div>
    )
}