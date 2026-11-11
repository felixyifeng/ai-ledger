"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from 'react'


export default function Home() {
  const [digit,setDigit]=useState(0)
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div>
          <button onClick={()=>setDigit(digit+1)}>
            点击+1 
          </button>
          <button onClick={()=>setDigit(digit-1)}>
            点击-1 
          </button>
          {digit}
        </div>

      </main>
    </div>
  );
}
