import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
// Alvo: rolagem principal do documento. Um único proprietário e um único RAF.
export function SmoothScroll() {
 useEffect(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let instance: Lenis | undefined;
  const update = () => {
   instance?.destroy(); instance = undefined;
   if (!preference.matches) instance = new Lenis({ autoRaf: true, lerp: 0.1, smoothWheel: true, syncTouch: false, allowNestedScroll: true });
  };
  update(); preference.addEventListener('change', update);
  return () => { preference.removeEventListener('change', update); instance?.destroy(); };
 }, []);
 return null;
}
