import { useEffect } from 'react';
import CircularDiagram from './components/CircularDiagram';

export default function App() {
  useEffect(() => {
    const lockedMeta = document.querySelector('meta[name="autism-wheel-locked-html-mode"]');
    if (lockedMeta) {
      document.title = 'My Autism Wheel';
    } else {
      document.title = 'Autism Wheel';
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <CircularDiagram />
    </div>
  );
}