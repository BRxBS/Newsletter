import React from "react"
import { SingInButton } from "../SingInButton";

import styles from './styles.module.scss'

export function Header(){
    return (
      <header className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <h2>Newsletter</h2>
          <nav>
            <a href="#" className={styles.active}>Home</a>
            <a href="#">Posts</a>
          </nav>
          <SingInButton/>
        </div>
      </header>
    );
}