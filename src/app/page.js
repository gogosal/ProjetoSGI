"use client";

import RecordPlayerViewer from '@/components/RecordPlayerViewer';
import HelpOverlay from '@/components/HelpOverlay';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function RecordPlayerPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Visualizador 3D */}
      <RecordPlayerViewer />

      {/* Overlays de Ajuda e Vídeo */}
      <HelpOverlay />
    </div>
  );
}
