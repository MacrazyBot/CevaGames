import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ChefHat } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { CevaturaMessage } from "./CevaturaMessage";
import { VictoryScreen } from "./VictoryScreen";
import { SurveyForm } from "./SurveyForm";

interface FallingItem {
  id: number;
  x: number;
  y: number;
  emoji: string;
  isGood: boolean;
  speed: number;
  caught?: boolean;
}

interface ChefGameProps {
  onClose: () => void;
}

const MAX_SCORE = 30;
const GOOD_ITEMS = ["🍕", "🍔", "🌮", "🍣", "🍜", "🍝", "🥘", "🍗", "🥗", "🍰"];
const BAD_ITEMS = ["🗑️", "🪳", "💀", "🧪"];

export const ChefGame = ({ onClose }: ChefGameProps) => {
  const [gameState, setGameState] = useState<"playing" | "paused" | "won" | "survey">("playing");
  const [score, setScore] = useState(0);
  const [playerX, setPlayerX] = useState(50);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [lives, setLives] = useState(3);
  const [showCevaturaMessage, setShowCevaturaMessage] = useState(false);
  const [hasShownMessage, setHasShownMessage] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);
  const itemIdRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animationRef = useRef<number>();

  const resetGame = useCallback(() => {
    setScore(0);
    setPlayerX(50);
    setItems([]);
    setLives(3);
    setGameState("playing");
    setShowCevaturaMessage(false);
    setHasShownMessage(false);
    itemIdRef.current = 0;
  }, []);

  // Check for 50% progress
  useEffect(() => {
    if (score >= MAX_SCORE / 2 && !hasShownMessage && gameState === "playing") {
      setShowCevaturaMessage(true);
      setGameState("paused");
    }
  }, [score, hasShownMessage, gameState]);

  const handleContinue = () => {
    setShowCevaturaMessage(false);
    setHasShownMessage(true);
    setGameState("playing");
  };

  // Game loop using requestAnimationFrame
  useEffect(() => {
    if (gameState !== "playing") return;

    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;

      if (delta > 16) { // ~60fps
        lastTimeRef.current = timestamp;

        setItems((prev) => {
          const updated: FallingItem[] = [];
          let scoreIncrease = 0;
          let livesDecrease = 0;

          prev.forEach((item) => {
            if (item.caught) return;
            
            const newY = item.y + item.speed * 0.3;
            
            // Check for catch at bottom
            if (newY >= 82 && newY < 88) {
              const caught = Math.abs(item.x - playerX) < 15;
              if (caught) {
                if (item.isGood) {
                  scoreIncrease++;
                } else {
                  livesDecrease++;
                }
                return; // Don't add to updated
              }
            }

            if (newY < 100) {
              updated.push({ ...item, y: newY });
            }
          });

          if (scoreIncrease > 0) {
            setScore((s) => {
              const newScore = Math.min(s + scoreIncrease, MAX_SCORE);
              if (newScore >= MAX_SCORE) {
                setGameState("won");
              }
              return newScore;
            });
          }

          if (livesDecrease > 0) {
            setLives((l) => Math.max(0, l - livesDecrease));
          }

          return updated;
        });
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameState, playerX]);

  // Check game over
  useEffect(() => {
    if (lives <= 0 && gameState === "playing") {
      resetGame();
    }
  }, [lives, gameState, resetGame]);

  // Spawn items
  useEffect(() => {
    if (gameState !== "playing") return;

    const spawnInterval = setInterval(() => {
      const isGood = Math.random() > 0.25;
      const emojis = isGood ? GOOD_ITEMS : BAD_ITEMS;

      setItems((prev) => {
        if (prev.length > 15) return prev; // Limit items
        return [
          ...prev,
          {
            id: itemIdRef.current++,
            x: Math.random() * 80 + 10,
            y: -5,
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            isGood,
            speed: 3 + Math.random() * 2,
          },
        ];
      });
    }, 700);

    return () => clearInterval(spawnInterval);
  }, [gameState]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gameRef.current || gameState !== "playing") return;
    const rect = gameRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setPlayerX(Math.max(10, Math.min(90, x)));
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!gameRef.current || gameState !== "playing") return;
    const rect = gameRef.current.getBoundingClientRect();
    const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
    setPlayerX(Math.max(10, Math.min(90, x)));
  };

  if (gameState === "won") {
    return <VictoryScreen onClaim={() => setGameState("survey")} />;
  }

  if (gameState === "survey") {
    return <SurveyForm onClose={onClose} />;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-white text-xl font-bold flex items-center gap-2">
          <ChefHat className="text-orange-400" /> ¡Atrapa los Ingredientes!
        </h2>
        <div className="text-2xl">
          {"❤️".repeat(lives)}{"🖤".repeat(Math.max(0, 3 - lives))}
        </div>
      </div>

      <ProgressBar progress={score} maxProgress={MAX_SCORE} label="Progreso" />

      <div
        ref={gameRef}
        className="relative w-full h-[300px] sm:h-[400px] bg-gradient-to-b from-amber-100 to-amber-200 rounded-xl overflow-hidden cursor-none mt-4 select-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      >
        {/* Kitchen background */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-amber-800 to-amber-600" />
        
        {/* Falling items - using simple divs */}
        {items.map((item) => (
          <div
            key={item.id}
            className="absolute text-3xl sm:text-4xl will-change-transform"
            style={{ 
              left: `${item.x}%`, 
              top: `${item.y}%`, 
              transform: "translate(-50%, -50%)",
            }}
          >
            {item.emoji}
          </div>
        ))}

        {/* Pan */}
        <div
          className="absolute text-5xl sm:text-6xl will-change-transform"
          style={{ left: `${playerX}%`, bottom: "5%", transform: "translateX(-50%)" }}
        >
          🍳
        </div>

        {/* Cevatura Message */}
        {showCevaturaMessage && (
          <CevaturaMessage 
            onContinue={handleContinue} 
            onCancel={onClose}
            title="¡ERES UN GRAN CHEF!"
            message="CEVATUR PIURA ES LÍDER EN GASTRONOMÍA PERUANA CON 50 AÑOS FORMANDO LOS MEJORES CHEFS DEL NORTE. ¿QUIERES CONTINUAR PARA GANAR Y CONOCER NUESTRAS CARRERAS CULINARIAS?"
          />
        )}
      </div>

      <p className="text-white/60 text-center mt-4 text-sm">
        Mueve el sartén para atrapar ingredientes. ¡Evita la basura! Llega a {MAX_SCORE} puntos.
      </p>
    </div>
  );
};
