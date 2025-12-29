import React from 'react';

const Layout = ({ children }) => {
  return (
    // Replicating the bg-light/bg-white logic and spacing from your EJS main tags
    <div className="layout-wrapper" style={{ minHeight: '100vh' }}>
      {/* This container ensures that every page starts below the 
          180px fixed navbar you designed. [cite: 69, 147, 188]
      */}
      <main className="container-fluid p-0">
        {children}
      </main>

      <style jsx="true">{`
        .layout-wrapper {
          -webkit-font-smoothing: antialiased; /* Preserving your EJS style  */
          background-color: #ffffff;
        }
        
        /* Ensures body scroll logic works with your is-scrolled class [cite: 113, 134] */
        :global(body.is-scrolled) {
          position: static !important;
          top: 0px !important;
        }
      `}</style>
    </div>
  );
};

export default Layout;