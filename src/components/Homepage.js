import { Close } from "@mui/icons-material";
import { Alert, Button, Dialog, Input, LinearProgress, Snackbar } from "@mui/material";
import { getDownloadURL, ref, updateMetadata, uploadBytes } from "firebase/storage";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { v4 } from "uuid";
import "../css/Global.css";
import styles from "../css/Home.module.css";
import dataprocess from "../images/dataprocess.svg";
import explore from "../images/explore.svg";
import github from "../images/github.svg";
import people from "../images/people.svg";
import photographer from "../images/photographer.svg";
import safe from "../images/safe.svg";
import Footer from "./Footer";
import { storage } from "../fire_connection";

export default function Homepage() {
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [imageTitle, setImageTitle] = useState(undefined);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [url, setUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const styling = {
    button: {
      width: "100%",
      marginInline: "auto",
      background: "linear-gradient(0deg, rgba(6,0,98,1) 0%, rgba(6,2,250,1) 6%, rgba(14,23,96,1) 7%, rgba(2,27,33,1) 100%, rgba(0,117,140,1) 100%)",
      fontFamily: "Kanit, sans-serif",
      fontSize: "1.1rem",
    },
    dialogPaper: {
      borderRadius: ".35rem",
      color: "#fff",
      background: "linear-gradient(rgb(2, 9, 33), rgb(6,0,98))",
      fontSize: "1.2rem",
      width: "100%",
    },
    inputPlaceholder: {
      color: "#fff",
      fontFamily: "Kanit, sans-serif",
    },
    closeIcon: {
      position: "absolute",
    },
  };
  const handleChange = (e) => {
    setFiles([...e.target.files]);
    setOpen(true);
  };

  const nav = useNavigate();

  const upload = async () => {
    const imageCount = files.length;
    const folderPath = `/images/${v4()}`;
    setUploading(true);
    if (imageCount > 1) {
      files.map((file, index) => {
        const reference = ref(storage, folderPath + `/${index}`);
        uploadBytes(reference, file).then(async () => {
          if (imageTitle != undefined) {
            const metadata = {
              customMetadata: {
                title: imageTitle,
                likes: 0,
                dislikes: 0,
              },
            };
            await updateMetadata(reference, metadata);
          } else {
            const metadata = {
              customMetadata: {
                likes: 0,
                dislikes: 0,
              },
            };
            await updateMetadata(reference, metadata);
          }
          if (index == files.length - 1) {
            setUrl(folderPath);
          }
        });
      });
    } else {
      const randomName = v4();
      const reference = ref(storage, `/images/${randomName}`);
      uploadBytes(reference, files[0]).then(async () => {
        if (imageTitle != undefined) {
          const metadata = {
            customMetadata: {
              title: imageTitle,
              likes: 0,
              dislikes: 0,
              path: randomName,
            },
          };
          await updateMetadata(reference, metadata);
        } else {
          const metadata = {
            customMetadata: {
              likes: 0,
              dislikes: 0,
              path: randomName,
            },
          };
          await updateMetadata(reference, metadata);
        }
        await getDownloadURL(reference).then(() => {
          setUrl(`/image/${randomName}`);
        });
      });
    }
  };
  const handleDialog = () => {
    setOpen(false);
    setUrl(null);
    setUploading(false);
  };

  return (
    <div id={styles.homepage}>
      <Snackbar open={uploadSuccess} autoHideDuration={3000}>
        <Alert onClose={() => setUploadSuccess(false)} severity="success">
          Successfully uploaded the image & copied the link!
        </Alert>
      </Snackbar>
      <Snackbar open={uploadError} autoHideDuration={3000}>
        <Alert onClose={() => setUploadSuccess(false)} severity="error">
          Something went wrong!
        </Alert>
      </Snackbar>

      <main>
        <div id={styles.photographer}>
          <img src={photographer} id={styles.flip} alt="photographer" />
          <img src={people} alt="posing people" />
        </div>

        <div id={styles.websiteDescription}>
          <p>Share pictures with others in no time!</p>
          <small>
            Share your favorite photos with other people on the internet. <br /> *Deleted images are removed from the server too.
          </small>
          <Button variant="contained" component="label" sx={{ fontSize: "1.1rem" }}>
            Upload
            <input onChange={(e) => handleChange(e)} accept="image/*" multiple type="file" hidden />
          </Button>
        </div>

        <Dialog open={open} PaperProps={{ style: styling.dialogPaper }}>
          <div id={styles.dialog}>
            <span onClick={handleDialog} className="hoverable">
              <Close color="error" sx={styling.closeIcon} />
            </span>
            <h3 className="text-center">Image/s</h3>
            {files.length === 1 && <Input sx={styling.inputPlaceholder} type="text" placeholder="Title (optional)" onChange={(e) => setImageTitle(e.target.value)} />}
            <small>
              <center>Total {files.length} images</center>
            </small>
            {files.length >= 1 && (
              <div className="flex | flexCol">
                <div id={styles.preview}>
                  {files.map((file, index) => {
                    return <img key={index} src={URL.createObjectURL(file)} className={styles.previewImage} />;
                  })}
                </div>

                {url != null ? (
                  files.length === 1 ? (
                    <Button variant="contained" color="success" onClick={() => nav(url)}>
                      Open
                    </Button>
                  ) : (
                    <Button variant="contained" color="success" onClick={() => nav("/folder", { state: { path: url } })}>
                      Open
                    </Button>
                  )
                ) : uploading ? (
                  <LinearProgress color="success" />
                ) : (
                  <Button variant="contained" onClick={() => upload()}>
                    Submit
                  </Button>
                )}
              </div>
            )}
          </div>
        </Dialog>
      </main>
      <div className={styles.grid}>
        <div className={styles.gridItem}>
          <img src={dataprocess} />
          <h4>Easy and convenient</h4>
          <p>Click on upload, select the image/s and that's it!</p>
        </div>

        <div className={styles.gridItem}>
          <img src={safe} />
          <h4>Protect your files</h4>
          <p>
            Only allow certain people to access your files by using a <strong>password.</strong>
          </p>
        </div>
        <div className={styles.gridItem}>
          <img src={explore} />
          <h4>Explore images</h4>
          <p>
            See other people's images on the{" "}
            <strong className="hoverable" onClick={() => nav("/recentuploads")}>
              Recent Uploads
            </strong>{" "}
            tab.
          </p>
        </div>
      </div>

      <div id={styles.githubSection}>
        <div className={styles.gitItem} id={styles.gitDescription}>
          <div className={styles.gitGradient}>
            <h2>Open Source</h2>
          </div>
          <p className={styles.gitGradient}>
            SharePictures is fully open source and could be accessed{" "}
            <a href="https://github.com/bogyz123/sharepictures" className="link" target="_blank" id={styles.githubLink}>
              here
            </a>
          </p>
        </div>
        <div id={styles.githubContainer}>
          <img src={github} id={styles.github} className={styles.gitItem} />
        </div>
      </div>
      <footer>
        <Footer />
      </footer>
    </div>
  );
}
