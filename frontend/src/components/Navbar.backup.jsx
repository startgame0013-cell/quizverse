import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header style={{position:'fixed',top:0,left:0,right:0,zIndex:1000,background:'#0a0a0a',borderBottom:'1px solid #222',padding:'1rem 2rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <Link to="/" style={{color:'#FACC15',fontWeight:'bold',fontSize:'1.5rem',textDecoration:'none'}}>QuizVerse</Link>
        <button onClick={()=>setOpen(true)} style={{background:'none',border:'none',color:'white',fontSize:'2rem',cursor:'pointer'}}>☰</button>
      </header>
      {open&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:2000,display:'flex',justifyContent:'flex-end'}} onClick={()=>setOpen(false)}>
        <div onClick={e=>e.stopPropagation()} style={{width:'300px',background:'#111',height:'100%',padding:'2rem',display:'flex',flexDirection:'column',gap:'1.2rem'}}>
          <button onClick={()=>setOpen(false)} style={{alignSelf:'flex-end',background:'none',border:'none',color:'white',fontSize:'1.5rem',cursor:'pointer'}}>✕</button>
          {[['/',  'Home'],['/create-quiz','Create Quiz'],['/my-quizzes','My Quizzes'],['/ai-generator','AI Generator'],['/join','Join Game'],['/leaderboard','Leaderboard'],['/mini-games','Mini Games'],['/sign-in','Sign In'],['/register','Register']].map(([p,l])=>(
            <Link key={p} to={p} onClick={()=>setOpen(false)} style={{color:'white',textDecoration:'none',fontSize:'1.1rem',padding:'0.75rem 0',borderBottom:'1px solid #222'}}>{l}</Link>
          ))}
        </div>
      </div>}
    </>
  );
}
