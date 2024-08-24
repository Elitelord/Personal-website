import NavBar from "@components/navbar/navbar";
import styles from "./home-header.module.css";

export default function HomeHeader() {
    return <><NavBar /><div className={styles.heading}>
        <h1>Sameer Agarwal</h1>

    </div>
    </>
}