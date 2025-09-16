import { useEffect } from 'react';
import CircularDiagram from './components/CircularDiagram';
import { Toaster } from './components/ui/sonner';
import Tour, { steps } from './components/Tour';
import { TourProvider } from '@reactour/tour';

export default function App() {
  useEffect(() => {
    document.title = 'Autism Wheel';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <TourProvider steps={steps}>
        <CircularDiagram />
        <Toaster />
        <Tour>
          <></>
        </Tour>
      </TourProvider>
    </div>
  );
}