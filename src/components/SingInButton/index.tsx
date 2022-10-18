import React from "react";
import {FaGoogle} from 'react-icons/fa'
import { FiX } from "react-icons/fi";
import { signIn, signOut, useSession } from "next-auth/react";

import styles from "./styles.module.scss";

export function SingInButton(){
    const { data: session } = useSession();

    
    return session ? (
      <button 
      type="button" 
      className={styles.signIn}
      onClick={() => signOut()}>
        <FaGoogle color="#04d361" />
        {session.user.name}
        <FiX color='737380' className={styles.closeIcon}/>
      </button>
    ) : (
      <button 
      type="button" 
      className={styles.signIn}
      onClick={()=> signIn('google')}>
        <FaGoogle color="#eba417" />
        Sing in with Google
      </button>
    );
}