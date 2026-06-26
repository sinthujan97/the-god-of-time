import { useEffect } from "react";

export function useCanvasSize(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onResize?: (width: number, height: number) => void
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    const updateSize = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);

      if (canvas.width === w && canvas.height === h) {
        return;
      }

      canvas.width = w;
      canvas.height = h;
      onResize?.(w, h);
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });
    observer.observe(container);

    window.addEventListener("resize", updateSize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, [canvasRef, onResize]);
}
