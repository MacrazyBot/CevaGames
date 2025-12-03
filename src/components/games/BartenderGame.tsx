import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Wine } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { CevaturaMessage } from "./CevaturaMessage";
import { VictoryScreen } from "./VictoryScreen";
import { SurveyForm } from "./SurveyForm";

interface Target {
  id: number;
  x: number;
  y: number;
  emoji: string;
  velocityX: number;
  velocityY: number;
}

interface Explosion {
  id: number;
  x: number;
  y: number;
}

interface BartenderGameProps {
  onClose: () => void;
}

const MAX_SCORE = 30;
const DRINK_EMOJIS = ["🍷", "🍸", "🍹", "🥃", "🍺", "🍾", "🥂"];

export const BartenderGame = ({ onClose }: BartenderGameProps) => {
  const [gameState, setGameState] = useState<"playing" | "paused" | "won" | "survey">("playing");
  const [score, setScore] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [targets, setTargets] = useState<Target[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [showCevaturaMessage, setShowCevaturaMessage] = useState(false);
  const [hasShownMessage, setHasShownMessage] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);
  const targetIdRef = useRef(0);
  const explosionIdRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animationRef = useRef<number>();

  const resetGame = useCallback(() => {
    setScore(0);
    setTargets([]);
    setExplosions([]);
    setGameState("playing");
    setShowCevaturaMessage(false);
    setHasShownMessage(false);
    targetIdRef.current = 0;
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

        setTargets((prev) =>
          prev.map((target) => {
            let newX = target.x + target.velocityX * 0.5;
            let newY = target.y + target.velocityY * 0.5;
            let newVelocityX = target.velocityX;
            let newVelocityY = target.velocityY;

            // Bounce off walls
            if (newX <= 5 || newX >= 95) newVelocityX = -newVelocityX;
            if (newY <= 5 || newY >= 80) newVelocityY = -newVelocityY;

            return {
              ...target,
              x: Math.max(5, Math.min(95, newX)),
              y: Math.max(5, Math.min(80, newY)),
              velocityX: newVelocityX,
              velocityY: newVelocityY,
            };
          })
        );
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameState]);

  // Spawn targets
  useEffect(() => {
    if (gameState !== "playing") return;

    const spawnInterval = setInterval(() => {
      setTargets((prev) => {
        if (prev.length >= 6) return prev; // Limit targets
        const side = Math.random() > 0.5 ? 0 : 100;
        return [
          ...prev,
          {
            id: targetIdRef.current++,
            x: side === 0 ? 10 : 90,
            y: 60 + Math.random() * 20,
            emoji: DRINK_EMOJIS[Math.floor(Math.random() * DRINK_EMOJIS.length)],
            velocityX: (side === 0 ? 1 : -1) * (1.5 + Math.random() * 1.5),
            velocityY: -1.5 - Math.random() * 1.5,
          },
        ];
      });
    }, 1000);

    return () => clearInterval(spawnInterval);
  }, [gameState]);

  // Clean up explosions
  useEffect(() => {
    if (explosions.length === 0) return;
    const timeout = setTimeout(() => {
      setExplosions((prev) => prev.slice(1));
    }, 400);
    return () => clearTimeout(timeout);
  }, [explosions]);

  const handleClick = (e: React.MouseEvent) => {
    if (!gameRef.current || gameState !== "playing") return;

    const rect = gameRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setTargets((prev) => {
      const hitIndex = prev.findIndex((t) => {
        const dist = Math.sqrt((t.x - clickX) ** 2 + (t.y - clickY) ** 2);
        return dist < 10;
      });

      if (hitIndex !== -1) {
        const hit = prev[hitIndex];
        setExplosions((e) => [...e, { id: explosionIdRef.current++, x: hit.x, y: hit.y }]);
        
        setScore((s) => {
          const newScore = Math.min(s + 1, MAX_SCORE);
          if (newScore >= MAX_SCORE) {
            setGameState("won");
          }
          return newScore;
        });

        return prev.filter((_, i) => i !== hitIndex);
      }

      return prev;
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gameRef.current) return;
    const rect = gameRef.current.getBoundingClientRect();
    setCursorPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
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
          <Wine className="text-purple-400" /> ¡Revienta las Botellas!
        </h2>
      </div>

      <ProgressBar progress={score} maxProgress={MAX_SCORE} label="Progreso" />

      <div
        ref={gameRef}
        className="relative w-full h-[300px] sm:h-[400px] bg-gradient-to-b from-purple-900 via-purple-800 to-purple-950 rounded-xl overflow-hidden cursor-crosshair mt-4 select-none"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
      >
        {/* Bar counter */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-amber-900 to-amber-800">
          <div className="absolute inset-x-0 top-0 h-2 bg-amber-600" />
        </div>

        {/* Shelves */}
        <div className="absolute left-4 right-4 top-[20%] h-2 bg-amber-700/50" />
        <div className="absolute left-4 right-4 top-[45%] h-2 bg-amber-700/50" />

        {/* Targets - simple divs */}
        {targets.map((target) => (
          <div
            key={target.id}
            className="absolute cursor-pointer text-4xl will-change-transform"
            style={{
              left: `${target.x}%`,
              top: `${target.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {target.emoji}
          </div>
        ))}

        {/* Explosions */}
        {explosions.map((exp) => (
          <div
            key={exp.id}
            className="absolute text-5xl pointer-events-none animate-ping"
            style={{ left: `${exp.x}%`, top: `${exp.y}%`, transform: "translate(-50%, -50%)" }}
          >
            💥
          </div>
        ))}

        {/* Crosshair */}
        <div
          className="absolute pointer-events-none will-change-transform"
          style={{ left: `${cursorPos.x}%`, top: `${cursorPos.y}%`, transform: "translate(-50%, -50%)" }}
        >
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 border-2 border-red-500 rounded-full" />
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500" />
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-red-500" />
          </div>
        </div>

        {/* Cevatura Message */}
        {showCevaturaMessage && (
          <CevaturaMessage onContinue={handleContinue} onCancel={onClose} />
        )}
      </div>

      <p className="text-white/60 text-center mt-4 text-sm">
        Haz clic en las botellas para reventarlas. ¡Llega a {MAX_SCORE} puntos!
      </p>
    </div>
  );
};
