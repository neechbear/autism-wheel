import { useEffect } from 'react';
import CircularDiagram from './components/CircularDiagram';

export default function App() {
  useEffect(() => {
    document.title = 'Autism Wheel';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <CircularDiagram />
    </div>
  );
}