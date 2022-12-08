import people from "../images/people.svg";
import photographer from "../images/photographer.svg";
import dataprocess from "../images/dataprocess.svg";
import safe from "../images/safe.svg";
import steps from "../images/steps.svg";
import styles from "../css/Home.module.css";
import { Alert, Button, Dialog, Grid, IconButton, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import "../css/Global.css";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "./fire_connection";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { v4 } from "uuid";
import CopyToClipboard from "react-copy-to-clipboard";
import CloseIcon from '@mui/icons-material/Close';
import Footer from "./Footer";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import github from "../images/github.png";

export default function Homepage() {

    const [imgBlob, setImgBlob] = useState();
    const [image, setImage] = useState();
    const [open, setOpen] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState(false);
    const [url, setUrl] = useState(null);
    const styling = {
        button: {
            width: '100%',
            marginInline: 'auto',
            background: 'linear-gradient(0deg, rgba(6,0,98,1) 0%, rgba(6,2,250,1) 6%, rgba(14,23,96,1) 7%, rgba(2,27,33,1) 100%, rgba(0,117,140,1) 100%)',
            fontFamily: 'Kanit, sans-serif',
            fontSize: '1.1rem'

        },
        dialog: {
            backgroundColor: 'inherit',
        }
    }

    const handleChange = (e) => {

        setUrl(null);
        setOpen(true);
        setImgBlob(URL.createObjectURL(e.target.files[0]));
        setImage(e.target.files[0]);
    }

    const upload = () => {
        const uuid = v4();
        const reference = ref(storage, `images/${uuid}`);

        uploadBytes(reference, image).then(() => {
            setUploadSuccess(true);
            setUrl(uuid);
            navigator.clipboard.writeText(`sharepictures.online/image/${uuid}`);
        }).catch(() => setUploadError(true));

    }


    return (
        <div id={styles.homepage}>
            <Snackbar open={uploadSuccess} autoHideDuration={3000}>
                <Alert onClose={() => setUploadSuccess(false)} severity='success'>Successfully uploaded the image & copied the link!</Alert>
            </Snackbar>
            <Snackbar open={uploadError} autoHideDuration={3000}>
                <Alert onClose={() => setUploadSuccess(false)} severity='error'>Something went wrong!</Alert>
            </Snackbar>

            <main>
                <div id={styles.photographer}>

                    <img src={photographer} id={styles.flip} alt="photographer" />
                    <img src={people} alt='posing people' />

                </div>

                <div id={styles.websiteDescription}>

                    <p>Share pictures with others in no time!</p>
                    <small>Share your favorite photos with other people on the internet. <br /> *Deleted images are removed from the server too.</small>
                    <Button variant="contained" component="label" sx={{fontSize:'1.1rem'}}>

                        Upload
                        <input onChange={(e) => handleChange(e)} accept="image/*" multiple type="file" hidden />

                    </Button>

                </div>



                <Dialog open={open}>
                    <div style={styling.dialog} className='flex | flexCol'>
                        <CloseIcon className="hoverable" id={styles.close} color='action' sx={{ color: "#fff", mixBlendMode: "difference" }} onClick={() => setOpen(false)} />
                        {<img src={imgBlob} />}
                        {url == null && <Button variant='contained' onClick={upload}><ArrowForwardIosIcon /></Button>}

                        {url != null &&
                            <>
                                <CopyToClipboard text={url}>
                                    <Button color='success' variant='contained'><Link style={{ width: '100%', height:'100%'}} to={`/image/${url}`}>Open</Link></Button>
                                </CopyToClipboard>

                            </>

                        }

                    </div>
                </Dialog>

            </main>
            <div className={styles.grid}>

                <div className={styles.gridItem}>
                    <img src={dataprocess} />
                    <h4>Easy and convenient</h4>
                    <p>Click on upload, select the image/s and that's it!</p>
                </div >

                <div className={styles.gridItem}>
                    <img src={safe} />
                    <h4>Protect your files</h4>
                    <p>Only allow certain people to access your files by using a <strong>password.</strong></p>
                </div>
            </div>



            <div id={styles.githubSection}>
                <div className={styles.gitItem} id={styles.gitDescription}>
                    <h2>Open Source</h2>
                    <p>SharePictures is fully open source and could be accessed <a href='https://github.com/bogyz123/sharepictures' className="link" target="_blank" id={styles.githubLink}>here</a></p>
                </div>
                <img src={github} id={styles.github} className={styles.gitItem} />

            </div>
            <footer>
                <Footer />
            </footer>


        </div>
    )
}