import { useNavigate } from "react-router";
import styles from "../css/Navbar.module.css";

function Navbar() {

    const nav = useNavigate();

    return (
        <div className={styles.navbarContainer}>
            <h2 className={`${styles.header} hoverable`} onClick={() => nav('/')}>Share Images</h2>
          
            <div className={`${styles.navbarControls} hoverable`}>
                <span  onClick={() => nav("/recentuploads")}>Recent Uploads</span>
            </div>
        </div>
    )
}
export default Navbar;