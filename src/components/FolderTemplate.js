import { getDownloadURL, listAll, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import styles from "../css/FolderTemplate.module.css";
import { storage } from "../fire_connection";

export default function FolderTemplate() {
  const { state } = useLocation();
  const { path } = state;
  const reference = ref(storage, path);
  const [files, setFiles] = useState([]);
  const openImage = (image) => {
    window.open(image, "_blank");
  };

  useEffect(() => {
    listAll(reference).then((res) => {
      res.items.map((file) => {
        getDownloadURL(file).then((url) => {
          setFiles((before) => [...before, url]);
        });
      });
    });
  }, []);

  return (
    <>
      <center>
        <p>Folder {path}</p>
      </center>
      <div id={styles.container}>
        {files.map((x, i) => {
          return (
            <img
              key={i}
              className={styles.image}
              src={x}
              onClick={() => {
                openImage(x);
              }}
            />
          );
        })}
      </div>
    </>
  );
}
