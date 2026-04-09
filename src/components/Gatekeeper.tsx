"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Gatekeeper Phase 1: Neo-Tokyo Total Layout Reset
 * Bypassing utility classes for inline styles to ensure core layout stability.
 * Sequential Sticker Logic: LIAR -> BZZT! -> OKAY...
 */
type GateState = "QUESTION" | "CELEBRATION" | "UNLOCKING";

interface GatekeeperProps {
  onUnlock: () => void;
}

export function Gatekeeper({ onUnlock }: GatekeeperProps) {
  const [state, setState] = useState<GateState>("QUESTION");
  const [showSticker, setShowSticker] = useState<boolean>(false);
  const [stickerType, setStickerType] = useState<"BZZT!" | "LIAR" | "SPARKLE" | "OKAY...">("BZZT!");
  const [shake, setShake] = useState(0);
  const [mistakeCount, setMistakeCount] = useState(0);

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setState("CELEBRATION");
      setStickerType("SPARKLE");
      setShowSticker(true);
      
      setTimeout(() => {
        setState("UNLOCKING");
        setTimeout(() => {
          onUnlock();
        }, 800);
      }, 2000);
    } else {
      setShake(prev => prev + 1);
      
      const nextMistakeCount = mistakeCount + 1;
      setMistakeCount(nextMistakeCount);

      // Sequential logic
      if (nextMistakeCount === 1) {
        setStickerType("LIAR");
      } else if (nextMistakeCount === 2) {
        setStickerType("BZZT!");
      } else {
        setStickerType("OKAY...");
        setMistakeCount(0); // Reset for next loop
      }

      setShowSticker(true);
      setTimeout(() => setShowSticker(false), 2000);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: state === 'UNLOCKING' ? '#00FF41' : '#0B0C10',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'visible',
        transition: 'background-color 0.3s ease'
      }}
    >
      {/* ── Background Halftone Pattern ── */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.035,
          pointerEvents: 'none',
          backgroundImage: 'radial-gradient(var(--accent) 1px, transparent 0)',
          backgroundSize: '15px 15px',
          zIndex: 0
        }} 
      />

      {/* ── Outer Boundary Wrapper (The Yellow Box) ── */}
      <div 
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '95vw',
          height: '90vh',
          maxHeight: '800px',
          maxWidth: '1100px',
          border: '4px solid #FACC15',
          padding: '2rem',
          boxShadow: '0 0 20px rgba(255, 245, 0, 0.1)',
          pointerEvents: state === 'UNLOCKING' ? 'none' : 'auto'
        }}
      >
        <AnimatePresence mode="wait">
          {state === "QUESTION" && (
            <motion.div
              key="question"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                x: shake ? [-15, 15, -15, 15, 0] : 0 
              }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ x: { duration: 0.4 } }}
              style={{
                textAlign: 'center',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem'
              }}
            >
              <h2 
                className="font-heading"
                style={{ 
                  color: '#FACC15', 
                  fontSize: 'clamp(2rem, 6vw, 4.5rem)',
                  textShadow: '5px 5px 0px #FF3131',
                  textTransform: 'uppercase',
                  fontStyle: 'italic',
                  margin: 0,
                  lineHeight: 1.1
                }}
              >
                PROVE YOU ARE A CODER TO ENTER.
              </h2>

              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '1.5rem', 
                  width: '100%', 
                  maxWidth: '500px' 
                }}
              >
                <button 
                  onClick={() => handleAnswer(false)} 
                  disabled={showSticker || state !== "QUESTION"}
                  className="button-outline"
                  style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', border: '3px solid #FACC15' }}
                >
                  A: I HACK MAINFRAMES WITH HTML.
                </button>
                <button 
                  onClick={() => handleAnswer(false)} 
                  disabled={showSticker || state !== "QUESTION"}
                  className="button-outline"
                  style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', border: '3px solid #FACC15' }}
                >
                  B: I JUST DRAG AND DROP BLOCKS.
                </button>
                <button 
                  onClick={() => handleAnswer(true)} 
                  disabled={showSticker || state !== "QUESTION"}
                  className="button-outline"
                  style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', border: '3px solid #FACC15' }}
                >
                  C: YES, MY FIRST CODE WAS HELLO WORLD.
                </button>
              </div>
            </motion.div>
          )}

          {state === "CELEBRATION" && (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              style={{ textAlign: 'center' }}
            >
              <h1 
                className="font-heading"
                style={{ 
                  color: '#FACC15', 
                  fontSize: 'clamp(3rem, 15vw, 10rem)',
                  textShadow: '10px 10px 0px #FF3131',
                  fontStyle: 'italic',
                  textTransform: 'uppercase',
                  margin: 0,
                  lineHeight: 0.9
                }}
              >
                I CAN FEEL YOU BRO.
              </h1>
            </motion.div>
          )}

          {state === "UNLOCKING" && (
            <motion.div
              key="unlocking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 10001,
                backgroundColor: '#00FF41'
              }}
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 15 }}
                transition={{ duration: 0.8, ease: "easeIn" }}
                style={{ width: '100%', height: '100%', backgroundColor: '#00FF41' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Stickers (Positioned Absolutely to Viewport Center) ── */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
          <AnimatePresence>
            {showSticker && (
              <motion.div
                key={`sticker-${stickerType}-${shake}`}
                initial={{ y: -600, x: '-50%', rotate: -20, scale: 0.5, opacity: 0 }}
                animate={{ 
                  y: state === 'CELEBRATION' ? 0 : -80, // Sparkle centered, Liar slightly higher
                  x: '-50%', 
                  rotate: stickerType === 'LIAR' ? -15 : 15, 
                  scale: 2, 
                  opacity: 1 
                }}
                exit={{ opacity: 0, scale: 4, y: 300 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                className="jitter"
                style={{ 
                  position: 'absolute', 
                  left: '50%', 
                  top: '50%', 
                  transformOrigin: 'center center'
                }}
              >
                {stickerType === 'SPARKLE' ? (
                  <svg width="250" height="250" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(15px 15px 0px #000)' }}>
                    <path d="M50,0 L62,38 L100,50 L62,62 L50,100 L38,62 L0,50 L38,38 Z" fill="#FACC15" stroke="#000" strokeWidth="2" />
                    <circle cx="50" cy="50" r="10" fill="white" />
                  </svg>
                ) : (
                  <svg width="350" height="200" viewBox="0 0 300 150" style={{ filter: 'drop-shadow(15px 15px 0px #000)' }}>
                    <path d="M10,75 L40,30 L90,10 L160,20 L240,10 L280,50 L290,100 L240,140 L160,130 L80,145 L30,110 Z" 
                          fill="#FF3131" stroke="white" strokeWidth="6" />
                    <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" 
                          fill="white" fontSize={stickerType === 'OKAY...' ? '50' : '60'} fontWeight="900" fontStyle="italic" style={{ fontFamily: 'var(--font-heading)' }}>
                      {stickerType}
                    </text>
                  </svg>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        @keyframes jitter {
          0% { transform: translate(-50%, -50%) translate(0,0) rotate(var(--rot)); }
          25% { transform: translate(-50%, -50%) translate(8px, -8px) rotate(calc(var(--rot) + 5deg)); }
          50% { transform: translate(-50%, -50%) translate(-8px, 8px) rotate(calc(var(--rot) - 5deg)); }
          75% { transform: translate(-50%, -50%) translate(8px, 8px) rotate(calc(var(--rot) + 5deg)); }
          100% { transform: translate(-50%, -50%) translate(0,0) rotate(var(--rot)); }
        }

        .jitter {
          animation: jitter 0.08s infinite;
          --rot: 15deg;
        }

        .button-outline {
          background: transparent;
          color: #FACC15;
          font-family: var(--font-mono);
          font-weight: 800;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.1s ease;
        }

        .button-outline:hover:not(:disabled) {
          background-color: #FACC15;
          color: #0B0C10;
          transform: translate(-4px, -4px);
          box-shadow: 8px 8px 0px #FF3131;
        }

        .button-outline:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          filter: grayscale(1);
        }
      `}</style>
    </div>
  );
}
