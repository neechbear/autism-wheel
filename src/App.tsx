import { useEffect } from 'react';
import CircularDiagram from './components/CircularDiagram';

export default function App() {
  useEffect(() => {
    // Only set title if not in locked HTML mode
    const lockedMeta = document.querySelector('meta[name="autism-wheel-locked-html-mode"]');
    if (!lockedMeta) {
      document.title = 'Autism Wheel';
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <CircularDiagram />
    </div>
  );
}