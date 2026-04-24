'use client';

import dynamic from 'next/dynamic';
import { useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const AIDistortionSphere = dynamic(() => import('@/components/AIDistortionSphere'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-[400px] bg-transparent" />,
});

const AiSphere = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setCanRender(true);
    }, 600);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute left-1/2 top-[-10px] z-0 flex -translate-x-1/2 scale-50 opacity-20 blur-[0.5px] md:top-[-100px] md:scale-75 lg:left-auto lg:right-[-40px] lg:top-1/2 lg:translate-x-0 lg:-translate-y-1/2 lg:scale-100 lg:opacity-30"
      aria-hidden
    >
      {isInView && canRender ? (
        <AIDistortionSphere />
      ) : (
        <div className="flex h-[400px] w-[400px] items-center justify-center bg-transparent" />
      )}
    </div>
  );
};

export default AiSphere;
