import React from "react";
import { FaGithub } from 'react-icons/fa'
import { FiX } from "react-icons/fi";

import styles from "./styles.module.scss";

export function SingInButton(){
    const isUserLoggedIn = true;

    
    return isUserLoggedIn ? (
      <button type="button" className={styles.signIn}>
        <FaGithub color="#04d361" />
        User Git
        <FiX color='737380' className={styles.closeIcon}/>
      </button>
    ) : (
      <button type="button" className={styles.signIn}>
        <FaGithub color="#eba417" />
        Sing in with Github
      </button>
    );
}