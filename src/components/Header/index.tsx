import React from "react"
import { SingInButton } from "../SingInButton";
import Link from "next/link";

import styles from './styles.module.scss'
import { ActiveLink } from "../ActiveLink";

export function Header(){
    return (
      <header className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <h2>Newsletter</h2>
          <nav>
            <ActiveLink activeClassName={styles.active} href="/">
              <a>Home</a>
            </ActiveLink>
            <ActiveLink activeClassName={styles.active} href="/posts">
              <a>Posts</a>
            </ActiveLink>
          </nav>
          <SingInButton />
        </div>
      </header>
    );
}