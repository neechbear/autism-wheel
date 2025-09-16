import { useEffect } from 'react';
import CircularDiagram from './components/CircularDiagram';
import { Toaster } from './components/ui/sonner';

export default function App() {
  useEffect(() => {
    document.title = 'Autism Wheel';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <CircularDiagram />
      <Toaster />
    </div>
  );
}