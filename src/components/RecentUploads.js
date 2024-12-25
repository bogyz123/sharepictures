import { Folder } from "@mui/icons-material";
import { Alert, Button } from "@mui/material";
import { getDownloadURL, getMetadata, getStorage, listAll, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import styles from "../css/RecentUploads.module.css";
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
    nav("/folder", { state: state });
  };

  useEffect(() => {
    listAll(listRef, { maxResults: 20 }).then((response) => {
      // Get all files
      response.items.length == 0 && response.prefixes.length == 0 ? setIsEmpty(true) : setIsEmpty(false);
      setFolders([...response.prefixes]);
      response.items.map((item) => {
        getDownloadURL(item).then((url) => {
          getMetadata(item).then((meta) => {
            setDownloadLinks((before) => [...before, url]);
            setMetadata((before) => [...before, meta]);
          });
        });
      });
    });
  }, []);

  return (
    <div id={styles.imageList}>
      {isEmpty ? (
        <Alert className="center" severity="error " color="warning" sx={{ background: "crimson", color: "#fff", width: "100%", position: "absolute", bottom: "0", left: "0" }}>
          No images uploaded
        </Alert>
      ) : (
        downloadLinks.map((img, index) => <Image key={index} title={metadata[index].customMetadata.title} likes={metadata[index].customMetadata.likes} imgPath={metadata[index].customMetadata.path} path={metadata[index].fullPath} dislikes={metadata[index].customMetadata.dislikes} type={metadata[index].contentType} image={img} size={shortenSize(metadata[index].size * 0.000001)} uploaded={metadata[index].timeCreated.slice(0, -14)} />)
      )}
      {folders.map((folder, index) => (
        <div className={styles.folderContainer}>
          <Folder key={index} className={`hoverable ` + styles.folder} onClick={() => navigateFolder({ path: folder.fullPath })} sx={{ fontSize: "15rem" }} color="success" />
          <p className={styles.folderText}>Folder {index}</p>
        </div>
      ))}
    </div>
  );
}
function Image({ image, size, uploaded, type, title, imgPath }) {
  const styling = {
    alert: {
      backgroundColor: "yellow",
      fontFamily: "Kanit, sans-serif",
      color: "rgb(0,0,255)",
    },
  };
  return (
    <div className={styles.container}>
      <div className={styles.img}>
        <img src={image} onClick={() => (window.location.href = `${image}`)} className={`${styles.image}  hoverable`} />
      </div>
      <div className={styles.metadata}>
        {title ? <p>Title: {title}</p> : <p>Unnamed photo</p>}
        <p>Size [MB]: {size}</p>
        <span>File type: {type}</span>
        <p>Created at: {uploaded}</p>
        <Button style={{ background: "navy", color: "white", width: "100%" }} onClick={() => (window.location.href = "https://bogyz123.github.io/sharepictures/#/image/" + imgPath)}>
          Open
        </Button>
      </div>
    </div>
  );
}
