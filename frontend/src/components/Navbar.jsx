import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t, lang, setLang } = useLanguage();

  const toggleLang = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  return (
    <>
      <header style={{position:'fixed',top:0,left:0,right:0,zIndex:1000,background:'#0a0a0a',borderBottom:'1px solid #222',padding:'1rem 2rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <Link to='/' style={{color:'#FACC15',fontWeight:'bold',fontSize:'1.5rem',textDecoration:'none'}}>QuizVerse</Link>
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
          <button
            onClick={toggleLang}
            style={{background:'#FACC15',color:'#0a0a0a',border:'none',padding:'0.5rem 1rem',borderRadius:'8px',fontSize:'1rem',cursor:'pointer',fontWeight:600}}
            title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            {lang === 'ar' ? 'EN' : 'العربية'}
          </button>
          <button onClick={()=>setOpen(true)} style={{background:'none',border:'none',color:'white',fontSize:'2rem',cursor:'pointer'}} aria-label="Menu">☰</button>
        </div>
      </header>
      {open && <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',zIndex:2000,display:'flex',justifyContent:'flex-end'}} onClick={()=>setOpen(false)}>
        <div onClick={e=>e.stopPropagation()} style={{width:'300px',background:'#111',height:'100%',padding:'2rem',display:'flex',flexDirection:'column',gap:'1.2rem'}}>
          <button onClick={()=>setOpen(false)} style={{alignSelf:'flex-end',background:'none',border:'none',color:'white',fontSize:'1.5rem',cursor:'pointer'}}>✕</button>
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem',paddingBottom:'0.75rem',borderBottom:'1px solid #222'}}>
            <span style={{color:'#888',fontSize:'0.9rem'}}>{t('settings.language')}</span>
            <button onClick={toggleLang} style={{background:'rgba(250,204,21,0.15)',border:'1px solid #FACC15',color:'#FACC15',padding:'0.35rem 0.7rem',borderRadius:'6px',fontSize:'0.85rem',cursor:'pointer'}}>
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>
          <Link to='/' onClick={()=>setOpen(false)} style={{color:'white',textDecoration:'none',fontSize:'1.1rem',padding:'0.75rem 0',borderBottom:'1px solid #222'}}>{t('nav.home')}</Link>
          <Link to='/quizzes' onClick={()=>setOpen(false)} style={{color:'white',textDecoration:'none',fontSize:'1.1rem',padding:'0.75rem 0',borderBottom:'1px solid #222'}}>{t('nav.quizzes')}</Link>
          <Link to='/create-quiz' onClick={()=>setOpen(false)} style={{color:'white',textDecoration:'none',fontSize:'1.1rem',padding:'0.75rem 0',borderBottom:'1px solid #222'}}>{t('nav.createQuiz')}</Link>
          <Link to='/login' onClick={()=>setOpen(false)} style={{color:'white',textDecoration:'none',fontSize:'1.1rem',padding:'0.75rem 0',borderBottom:'1px solid #222'}}>{t('nav.login')}</Link>
          <Link to='/register' onClick={()=>setOpen(false)} style={{color:'white',textDecoration:'none',fontSize:'1.1rem',padding:'0.75rem 0',borderBottom:'1px solid #222'}}>{t('nav.register')}</Link>
        </div>
      </div>}
    </>
  );
}
