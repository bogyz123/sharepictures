import people from "../images/people.svg";
import photographer from "../images/photographer.svg";
import dataprocess from "../images/dataprocess.svg";
import safe from "../images/safe.svg";
import steps from "../images/steps.svg";
import styles from "../css/Home.module.css";
import { Alert, Button, Dialog, Grid, IconButton, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";
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

export default function Homepage() {
    const [image, setImage] = useState();
    const [imageObj, setImageObj] = useState();
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
            backgroundColor: 'rgb(32,32,32)',
        }
    }
    const handleChange = (e) => {
        setUrl(null);
        setImage(e.target.files[0]);
        setImageObj(URL.createObjectURL(e.target.files[0]));
        setOpen(true);
    }
    const upload = () => {
        const uuid = v4();
        const reference = ref(storage, `images/${uuid}`);

        uploadBytes(reference, image).then((res) => {
            setUploadSuccess(true);
            setUrl(uuid);
        }).catch(() => setUploadError(true));

    }
    const nav = useNavigate();


    useEffect(() => {

    }, [image])
    return (
        <div id={styles.homepage}>
            <Snackbar open={uploadSuccess} autoHideDuration={3000}>
                <Alert onClose={() => setUploadSuccess(false)} severity='success'>Successfully uploaded the image!</Alert>
            </Snackbar>
            <Snackbar open={uploadError} autoHideDuration={3000}>
                <Alert onClose={() => setUploadSuccess(false)} severity='error'>Something went wrong!</Alert>
            </Snackbar>

            <div id={styles.photographer}>

                <img src={photographer} id={styles.flip} alt="photographer" />
                <img src={people} alt='posing people'  />

            </div>

            <div id={styles.websiteDescription}>

                <p>Share pictures with others in no time!</p>
                <small>Share your favorite photos with other people on the internet. <br /> *Deleted images are removed from the server too.</small>
                <Button variant="contained" component="label">
                    Upload
                    <input onChange={(e) => handleChange(e)} hidden accept="image/*" multiple type="file" />

                </Button>



                <Dialog open={open}>
                    <div style={styling.dialog} className='flex | flexCol'>
                        <CloseIcon className="hoverable" id={styles.close} color='action' sx={{color: '#fff'}} onClick={() => setOpen(false)} />
                        <img src={imageObj} className={styles.logo} id={styles.uploadedImg} />
                        {url == null && <Button variant='contained' onClick={upload}><ArrowForwardIosIcon /></Button>}
                        {url != null &&
                            <CopyToClipboard text={url}>
                                <Button color='success' variant='contained'><Link to={`/image/${url}`}>Open</Link></Button>
                            </CopyToClipboard>
                        }

                    </div>


                </Dialog>
            </div>
            <Grid container={true} id={styles.grid}>

                <Grid xs={12} md={4} lg={2.5} className={styles.gridItem}>
                    <img src={dataprocess} />
                    <h4>Access images with a link</h4>
                    <p>Access images of any size with just a link!</p>
                </Grid >

                <Grid xs={12} md={4} lg={2.5} className={styles.gridItem}>
                    <img src={safe} />
                    <h4>You're safe!</h4>
                    <p>Only allow certain people to access your pictures by putting a <strong>password.</strong></p>
                </Grid>
                <Grid xs={12} md={4} lg={2.5} className={styles.gridItem}>
                    <img src={steps} />
                    <h4>Easy to use</h4>
                    <p>Select a image, click a button, share the link, easy as that!</p>
                </Grid>
                <Grid xs={12} md={12} lg={2.5} className={styles.gridItem}>
                    <img src={dataprocess} />
                    <h4>Access images with link!</h4>
                    <p>Access images of any size with just a link!</p>
                </Grid>
            </Grid>
            <Footer />


        </div>
    )
}