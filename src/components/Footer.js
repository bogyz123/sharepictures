
import { Divider } from "@mui/material";
import styles from "../css/Footer.module.css";
import "../css/Global.css";
import FirebasePng from "../images/firebase.png";
import MuiSvg from "../images/mui.svg";
import ReactSvg from "../images/react.svg";

export default function Footer() {
    return (
        <div className="flex | centerX | flexCol">



            <h3>INFORMATION</h3>
            <Divider />

            <div className='flex' id={styles.listContainer}>
                <div className={`${styles.gridItem} flex | flexCol`}>
                    <span className="hoverable">Contact Us</span>
                    <span className="hoverable">About Us</span>
                    <a href='https://github.com/bogyz123/sharepictures' target='_blank' className="hoverable">GitHub</a>
                </div>

                <div className={styles.gridItem}>

                    <span>Made With</span>


                    <div className={`flex ${styles.gridItem}`}>
                        <img src={ReactSvg} className={styles.icon} />
                        <span>REACT.js</span>
                    </div>


                    <div className={`flex ${styles.gridItem}`}>
                        <img src={MuiSvg} className={styles.icon} />
                        <span>MaterialUI</span>
                    </div>
                    <div className={`flex ${styles.gridItem}`}>
                        <img src={FirebasePng} className={styles.icon} />
                        <span>Firebase</span>
                    </div>

                </div>
            </div>



        </div>
    )
}
