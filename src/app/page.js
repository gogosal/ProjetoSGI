"use client";

import RecordPlayerViewer from '@/components/RecordPlayerViewer';

export default function RecordPlayerPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Visualizador 3D */}
      <RecordPlayerViewer />
    </div>
  );
}
