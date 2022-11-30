import styles from "../css/Navbar.module.css";
import { Input } from "@mui/material";
import { useNavigate } from "react-router";
import { useImperativeHandle, useState } from "react";
import { ArrowForward, ArrowLeft, ArrowRight } from "@mui/icons-material";

function Navbar() {

    const nav = useNavigate();

    return (
        <div id={styles.navbarContainer}>
            <h2 id={styles.header} className="hoverable" onClick={() => nav('/')}>Share Images</h2>

            <div id={styles.navbarControls} className="hoverable">
                <span onClick={() => nav("/recentuploads")}>Recent Uploads</span>
            </div>
        </div>
    )
}
export default Navbar;