'use client';

import React, { useEffect, useState } from 'react';

const ManagerPage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Prevent rendering during SSR
  }

  return (
    <div>
      {/* Your manager page content goes here */}
      <h1>Manager Page</h1>
    </div>
  );
};

export default ManagerPage;
