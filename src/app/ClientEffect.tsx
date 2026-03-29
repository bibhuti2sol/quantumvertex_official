"use client";

import { useEffect } from 'react';

export default function ClientEffect() {
  useEffect(() => {
    // Remove unwanted attributes added by browser extensions
    const body = document.querySelector('body');
    if (body) {
      body.removeAttribute('data-new-gr-c-s-check-loaded');
      body.removeAttribute('data-gr-ext-installed');
    }
  }, []);

  return null;
}