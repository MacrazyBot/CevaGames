import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Plane } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { CevaturaMessage } from "./CevaturaMessage";
import { VictoryScreen } from "./VictoryScreen";
import { SurveyForm } from "./SurveyForm";

interface Obstacle {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

interface AviationGameProps {
  onClose: () => void;
}

const MAX_SCORE = 30;

export const AviationGame = ({ onClose }: AviationGameProps) => {
  const [gameState, setGameState] = useState<"playing" | "paused" | "won" | "survey">("playing");
  const [score, setScore] = useState(0);
  const [playerY, setPlayerY] = useState(50);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [showCevaturaMessage, setShowCevaturaMessage] = useState(false);
  const [hasShownMessage, setHasShownMessage] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const obstacleIdRef = useRef(0);

  const obstacleEmojis = ["✈️", "🛩️", "🚁", "🍸", "🍹", "🍕", "🍔"];

  const resetGame = useCallback(() => {
    setScore(0);
    setPlayerY(50);
    setObstacles([]);
    setGameOver(false);
    setGameState("playing");
    setShowCevaturaMessage(false);
    setHasShownMessage(false);
    obstacleIdRef.current = 0;
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

  // Handle keyboard controls
  useEffect(() => {
    if (gameState !== "playing" || gameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w") {
        setPlayerY((prev) => Math.max(5, prev - 8));
      } else if (e.key === "ArrowDown" || e.key === "s") {
        setPlayerY((prev) => Math.min(95, prev + 8));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, gameOver]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing" || gameOver) return;

    const gameLoop = () => {
      setObstacles((prev) => {
        const updated = prev
          .map((obs) => ({ ...obs, x: obs.x - 2 }))
          .filter((obs) => obs.x > -10);

        const playerX = 10;
        const collision = updated.some((obs) => {
          const hitX = obs.x < playerX + 8 && obs.x > playerX - 5;
          const hitY = Math.abs(obs.y - playerY) < 10;
          return hitX && hitY;
        });

        if (collision) {
          setGameOver(true);
          return prev;
        }

        return updated;
      });

      setScore((prev) => {
        const newScore = prev + 0.1;
        if (newScore >= MAX_SCORE) {
          setGameState("won");
          return MAX_SCORE;
        }
        return newScore;
      });

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameState, gameOver, playerY]);

  // Spawn obstacles
  useEffect(() => {
    if (gameState !== "playing" || gameOver) return;

    const spawnInterval = setInterval(() => {
      setObstacles((prev) => [
        ...prev,
        {
          id: obstacleIdRef.current++,
          x: 105,
          y: Math.random() * 80 + 10,
          emoji: obstacleEmojis[Math.floor(Math.random() * obstacleEmojis.length)],
        },
      ]);
    }, 800);

    return () => clearInterval(spawnInterval);
  }, [gameState, gameOver]);

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!gameRef.current || gameState !== "playing") return;
    const rect = gameRef.current.getBoundingClientRect();
    const y = ((e.touches[0].clientY - rect.top) / rect.height) * 100;
    setPlayerY(Math.max(5, Math.min(95, y)));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gameRef.current || gameState !== "playing") return;
    const rect = gameRef.current.getBoundingClientRect();
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPlayerY(Math.max(5, Math.min(95, y)));
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
          <Plane className="text-yellow-400" /> Esquiva los Obstáculos
        </h2>
      </div>

      <ProgressBar progress={score} maxProgress={MAX_SCORE} label="Progreso" />

      <div
        ref={gameRef}
        className="relative w-full h-[300px] sm:h-[400px] bg-gradient-to-r from-sky-400 via-sky-300 to-sky-200 rounded-xl overflow-hidden cursor-none mt-4 touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onMouseMove={handleMouseMove}
      >
        {/* Clouds */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-30"
            style={{ top: `${20 + i * 15}%` }}
            animate={{ x: ["-100%", "500%"] }}
            transition={{ duration: 15 + i * 2, repeat: Infinity, ease: "linear", delay: i * 2 }}
          >
            ☁️
          </motion.div>
        ))}

        {/* Player */}
        <motion.div
          className="absolute text-4xl sm:text-5xl drop-shadow-lg"
          style={{ left: "10%", top: `${playerY}%`, transform: "translateY(-50%)" }}
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        >
          🛫
        </motion.div>

        {/* Obstacles */}
        {obstacles.map((obs) => (
          <motion.div
            key={obs.id}
            className="absolute text-3xl sm:text-4xl"
            style={{ left: `${obs.x}%`, top: `${obs.y}%`, transform: "translateY(-50%)" }}
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ duration: 0.3, repeat: Infinity }}
          >
            {obs.emoji}
          </motion.div>
        ))}

        {/* Game Over */}
        {gameOver && (
          <motion.div
            className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h3 className="text-white text-3xl font-bold mb-4">💥 ¡Game Over!</h3>
            <p className="text-white/80 mb-4">Puntos: {Math.floor(score)}</p>
            <Button onClick={resetGame} className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
              Intentar de Nuevo
            </Button>
          </motion.div>
        )}

        {/* Cevatura Message */}
        {showCevaturaMessage && (
          <CevaturaMessage 
            onContinue={handleContinue} 
            onCancel={onClose}
            title="¡VUELAS INCREÍBLE!"
            message="CEVATUR PIURA ES LA ACADEMIA N°1 EN AVIACIÓN COMERCIAL DEL NORTE CON 50 AÑOS FORMANDO AZAFATAS Y SOBRECARGOS PROFESIONALES. ¿QUIERES CONTINUAR Y DESCUBRIR TU FUTURO EN LOS CIELOS?"
          />
        )}
      </div>

      <p className="text-white/60 text-center mt-4 text-sm">
        Usa el mouse o toca la pantalla para mover el avión. ¡Llega a {MAX_SCORE} puntos!
      </p>
    </div>
  );
};
