import { useEffect, useRef } from 'react';
import { DotLottie } from '@lottiefiles/dotlottie-web';

const FetchingUI = () => {
  const containerRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const animation = new DotLottie({
      canvas: containerRef.current,
      src: '/lottie/listLoading.lottie',
      autoplay: true,
      loop: true,
    });

    return () => animation.destroy();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <canvas ref={containerRef} style={{ width: 180, height: 180 }} />
      <p className="mt-2 text-sm md:text-base text-gray-500">
        This process may take a few seconds.
      </p>
    </div>
  );
};

export default FetchingUI;  