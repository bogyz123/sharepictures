import { useNavigate } from "react-router";
import styles from "../css/Navbar.module.css";

function Navbar() {

    const nav = useNavigate();

    return (
        <div id={styles.navbarContainer}>
            <h2 id={styles.header} className="hoverable | hoverAnimation" onClick={() => nav('/')}>Share Images</h2>
          
            <div id={styles.navbarControls} className="hoverable">
                
                <span className="hoverAnimation" onClick={() => nav("/recentuploads")}>Recent Uploads</span>
            </div>
        </div>
    )
}
export default Navbar;