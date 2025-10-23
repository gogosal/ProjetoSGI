"use client";

import { useState } from 'react';

export default function HelpOverlay() {
    const [showHelp, setShowHelp] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [showAnnotations, setShowAnnotations] = useState(false);

    const handleVideoClose = () => {
        setShowVideo(false);
        const video = document.querySelector('#video-overlay video');
        if (video) video.pause();
    };

    const handleVideoOpen = () => {
        setShowVideo(true);
        setTimeout(() => {
            const video = document.querySelector('#video-overlay video');
            if (video) {
                video.currentTime = 0;
                video.play().catch(e => console.error('Error playing video:', e));
            }
        }, 100);
    };

    return (
        <>
            {/* Botão de Ajuda */}
            <button
                onClick={() => setShowHelp(true)}
                className="fixed bottom-5 left-1/2 -translate-x-1/2 z-20 bg-black backdrop-blur-xl border border-white/30 text-white text-sm rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 shadow-lg px-4 py-2 hover:bg-black/75 hover:scale-110"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-current mr-1 mt-[3px]">
                    <path fillRule="evenodd"
                        d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0ZM8.94 6.94a.75.75 0 1 1-1.061-1.061 3 3 0 1 1 2.871 5.026v.345a.75.75 0 0 1-1.5 0v-.5c0-.72.57-1.172 1.081-1.287A1.5 1.5 0 1 0 8.94 6.94ZM10 15a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                        clipRule="evenodd" />
                </svg>
                <span>Ajuda</span>
            </button>

            {/* Overlay de Ajuda */}
            {showHelp && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-black/60 backdrop-blur-[15px] z-[25] flex justify-center items-center transition-opacity duration-300"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setShowHelp(false);
                    }}
                >
                    {/* Botão de Alternar Anotações */}
                    <button
                        onClick={() => setShowAnnotations(!showAnnotations)}
                        className="fixed top-5 left-5 z-[26] bg-black border border-white/30 text-white text-sm rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 shadow-lg px-4 py-2 hover:bg-black/75 hover:scale-110"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-current mr-2">
                            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path fillRule="evenodd"
                                d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                                clipRule="evenodd" />
                        </svg>
                        <span>{showAnnotations ? 'Mostrar com Anotações' : 'Mostrar Sem Anotações'}</span>
                    </button>

                    {/* Botão Fechar */}
                    <button
                        onClick={() => setShowHelp(false)}
                        className="fixed top-5 right-5 z-[1001] bg-black border border-white/30 text-white text-sm rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 shadow-lg p-2 hover:bg-white/30 hover:scale-110"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[18px] h-[18px]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Imagens */}
                    <img
                        src="/images/informacao_comfiltros.png"
                        alt="Imagem de ajuda"
                        className={`max-w-[80%] max-h-[80%] rounded-[15px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-white/10 object-cover transition-opacity duration-300 ${showAnnotations ? 'hidden' : 'block'}`}
                    />
                    <img
                        src="/images/informacao_semfiltros.png"
                        alt="Informação sem filtros"
                        className={`max-w-[80%] max-h-[80%] rounded-[15px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-white/10 object-cover transition-opacity duration-300 ${showAnnotations ? 'block' : 'hidden'}`}
                    />

                    {/* Botão Vídeo */}
                    <button
                        onClick={handleVideoOpen}
                        className="fixed bottom-5 left-1/2 -translate-x-1/2 z-20 bg-black border border-white/30 text-white text-sm rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 shadow-lg px-4 py-2 hover:bg-black/75 hover:scale-110"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current mr-2">
                            <path fillRule="evenodd"
                                d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                                clipRule="evenodd" />
                        </svg>
                        <span>Demonstração da Animação do Braço do Gira-discos</span>
                    </button>
                </div>
            )}

            {/* Overlay de Vídeo */}
            {showVideo && (
                <div
                    id="video-overlay"
                    className="fixed top-0 left-0 w-full h-full bg-black/60 backdrop-blur-[15px] z-[30] flex justify-center items-center transition-opacity duration-300"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) handleVideoClose();
                    }}
                >
                    <button
                        onClick={handleVideoClose}
                        className="fixed top-5 right-5 z-[1001] bg-black border border-white/30 text-white text-sm rounded-full cursor-pointer flex items-center justify-center transition-all duration-300 shadow-lg p-2 hover:bg-white/30 hover:scale-110"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-[18px] h-[18px]">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <video autoPlay loop muted className="max-w-[90%] max-h-[90vh] rounded-xl shadow-2xl">
                        <source src="/images/animacao_braco.mp4" type="video/mp4" />
                        Seu navegador não suporta o elemento de vídeo.
                    </video>
                </div>
            )}
        </>
    );
}
