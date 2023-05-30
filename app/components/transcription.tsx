'use client';

import { useEffect } from 'react';

export default function Test() {
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/data');
      const data = await res.json();
      console.log(data);
    };

    fetchData();
  }, []);

  return <div>Hey</div>;
}
