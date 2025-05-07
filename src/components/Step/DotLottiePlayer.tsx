import { useEffect, useRef } from 'react';
import { DotLottie } from '@lottiefiles/dotlottie-web';

const DotLottiePlayer = () => {
  const containerRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const animation = new DotLottie({
      canvas: containerRef.current,
      src: '/lottie/search.lottie', // public 폴더에 위치해야 함
      autoplay: true,
      loop: true,
    });

    return () => animation.destroy();
  }, []);

  return <canvas ref={containerRef} style={{ width: 180, height: 180 }} />;
};

export default DotLottiePlayer;