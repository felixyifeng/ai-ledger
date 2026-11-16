"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { useState,useEffect } from 'react'
// useState=申请状态格子；useEffect=状态变化时自动执行某事

export default function Home() {
  const [digit,setDigit]=useState(0)
  const [input,setInput]=useState('')
  const [bills,setBills]=useState(()=>{
    try{
      const saved=localStorage.getItem("ai-bills");
      return saved?JSON.parse(saved):[];
    }catch(e){
      return [];
    }
  })
  const [bill,setBill]=useState(null)
  const [loading,setLoading]=useState(false)// 新格子："正在解析中"

  useEffect(()=>{
    localStorage.setItem("ai-bills",JSON.stringify(bills))
  },[bills])// [bills] = 接线名单：只有 bills 变化时才执行上面这行

  /**
   * AI接口函数：用户点"AI解析"按钮时执行
   */
  async function parseBill(){
    if(input.trim()===""){
      return;
    }
    setLoading(true)//发出ai解析请求前上锁
    try{
      const res=await fetch("/api/parse",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({text:input}),
      })
      const data=await res.json()
      setBill(data)
    }catch(e){
      setBill({error:"网络异常，请检查连接后重试！"})
    }
    finally{
      setLoading(false)
    }

  }

  /**
   * 确认函数:用户点"确认入账"按钮时执行
   */
  function confirmBill(){
    setBills([...bills,{...bill,id:Date.now()}])
    setBill(null)// 清空待确认区
    setInput("")// 清空输入框
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div>
          <input
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            placeholder="如：昨天打车35块"
          />
          <button type="button" onClick={parseBill} disabled={loading}>
            {loading?"解析中···":"AI解析"}
          </button>

          {/* 情况一：AI 说不认识这句话 → 红字提示（&& 左边两个都真才显示） */}
          {bill&&bill.error&&<p style={{color:"red"}}>{bill.error}</p>}

          {/* 情况二：AI 解析成功 → 显示确认卡片（bill 有值 且 error 字段不存在） */}
          {bill && !bill.error&&(
            <div>
              <p>AI解析结果：{bill.type}{bill.amount}元 · {bill.note}</p>
              <button type="button" onClick={confirmBill}>确认入账</button>
              <button type="button" onClick={()=>setBill(null)}>放弃</button>
            </div>
          )}

          <ul>
            {/* map = 对bills数组每一条执行箭头函数，返回值组成新数组 */}
            {bills.map((b)=>(
              <li key={b.id}>
                {b.note}:{b.type==="支出"?"-":"+"}{b.amount}元
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
