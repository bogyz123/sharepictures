import { Alert, Button } from "@mui/material";
import { getDownloadURL, getMetadata, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import "../css/Global.css";
import styles from "../css/ImageTemplate.module.css";
import { storage } from "../fire_connection";

export const shortenSize = (size) => {
  var stringified = String(size);

  var beforeDot = stringified.substring(0, stringified.indexOf(".", 0));
  var afterDot = stringified.substring(stringified.indexOf(".", 0), stringified.indexOf(".", 0) + 3);
  return beforeDot + afterDot;

  // * 0.000001
};
export default function ImageTemplate() {
  const { id } = useParams();
  const [error, setError] = useState(false);
  const [image, setImage] = useState();
  const [metadata, setMetadata] = useState({});
  const [size, setSize] = useState("");
  useEffect(() => {
    getDownloadURL(ref(storage, `images/${id}`))
      .then((url) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        setImage(url);
      })
      .then(() => {
        getMetadata(ref(storage, `images/${id}`)).then((metadata) => {
          setMetadata(metadata);
          setSize(shortenSize(metadata.size * 0.000001));
        });
      });
  }, []);
  return (
    <div id={styles.template} className="flex | flexCol | centerY | centerX">
      {error && (
        <div>
          <Alert severity="error">This image does not exist.</Alert>
        </div>
      )}
      <img src={image} id={styles.image} />
      {image != null && (
        <div className=" flex | flexCol | centerY">
          {metadata.customMetadata?.title != undefined && <h4>Title: {metadata.customMetadata.title}</h4>}
          <h4 id="size">Size (MB): {size}</h4>
          <Button variant="contained">
            <a download href={`${image}`}>
              Download
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
