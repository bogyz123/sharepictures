import styles from "../css/Footer.module.css";
import "../css/Global.css";

export default function Footer() {
  return (
    <div id={styles.footer}>
      <div className="text-center" id={styles.header}>
        SharePictures
      </div>
      <div id={styles.description}>SharePictures is a website where users can upload, share, and browse photos. It provides a simple way to share moments and explore images from others.</div>
    </div>
  );
}
