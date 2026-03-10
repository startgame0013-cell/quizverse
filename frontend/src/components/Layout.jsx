import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '4.5rem' }}>
        <Outlet />
      </main>
    </>
  );
}
