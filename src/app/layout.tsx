import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/index.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Next.js with Tailwind CSS',
  description: 'A boilerplate project with Next.js and Tailwind CSS',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
  },
};

// Ensure no debug overlays or third-party components are rendering the 'N' button
// If the issue persists, inspect the DOM to identify the source of the button

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
        <title>Quantum Vertex</title>
        <meta name="description" content="Quantum Vertex — NextGen Task Manager" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const body = document.querySelector('body');
                if (body) {
                  body.removeAttribute('data-new-gr-c-s-check-loaded');
                  body.removeAttribute('data-gr-ext-installed');
                }
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {/* Ensure no debug overlays or third-party components are rendering the 'N' button */}
        <Header />
        {children}
        <Footer />
        {/* Runtime DOM fallback: ensure a Product nav link exists even if the active header is different */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  function addProductLink(){
    try{
      if(document.querySelector('a[href="/product"], a[href="/product/"]')) return;

      const selectors = ['header nav ul','header nav','nav ul','nav','.nav ul','.navbar ul','.menu ul','.main-nav ul'];
      let container = null;
      let isList = false;
      for(const s of selectors){
        const el = document.querySelector(s);
        if(el){
          container = el;
          isList = el.tagName.toLowerCase() === 'ul' || el.tagName.toLowerCase() === 'ol';
          break;
        }
      }

      if(!container){
        const possible = Array.from(document.querySelectorAll('a')).find(a=>/home|about|services|contact/i.test(a.textContent || ''));
        if(possible && possible.parentElement) container = possible.parentElement;
      }
      if(!container) return;

      const anchor = document.createElement('a');
      anchor.setAttribute('href', '/product');
      anchor.className = 'product-injected-link';
      anchor.textContent = 'Product';
      anchor.style.cursor = 'pointer';

      if(isList){
        const li = document.createElement('li');
        li.appendChild(anchor);
        container.appendChild(li);
      } else {
        const wrapper = document.createElement('span');
        wrapper.style.display = 'inline-block';
        wrapper.style.marginLeft = '10px';
        wrapper.appendChild(anchor);
        container.appendChild(wrapper);
      }

      const styleId = 'product-injected-style';
      if(!document.getElementById(styleId)){
        const style = document.createElement('style');
        style.id = styleId;
        style.innerHTML = '.product-injected-link{ color: white; text-decoration: none; font-size: 14px; } .product-injected-link:hover{ color: var(--accent-cyan, #00e5ff); } .product-injected-link.active{ color: var(--accent-cyan, #00e5ff); font-weight: 600; }';
        document.head.appendChild(style);
      }

      function setActive(){
        const links = document.querySelectorAll('.product-injected-link');
        links.forEach(function(l){
          if(location.pathname === '/product' || location.pathname === '/product/') l.classList.add('active');
          else l.classList.remove('active');
        });
      }
      setActive();
      window.addEventListener('popstate', setActive);
      window.addEventListener('hashchange', setActive);

    }catch(e){
      console.warn('Product link injection failed', e);
    }
  }

  function scheduleInjection(){
    if(typeof window === 'undefined') return;
    // run after full load + at least one animation frame to avoid interfering with React hydration
    function run(){
      try{ window.requestAnimationFrame(()=>{ setTimeout(addProductLink, 60); }); }catch(e){ setTimeout(addProductLink, 200); }
    }
    if(document.readyState === 'complete') run();
    else window.addEventListener('load', run);
  }

  scheduleInjection();
})();
            `,
          }}
        />
      </body>
    </html>
  );
}
