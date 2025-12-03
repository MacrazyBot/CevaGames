import { motion } from "framer-motion";
import { UtensilsCrossed, Wine, Plane } from "lucide-react";

interface AnimatedBackgroundProps {
  career: "chef" | "bartender" | "aviation";
}

export const AnimatedBackground = ({ career }: AnimatedBackgroundProps) => {
  const getBackgroundElements = () => {
    switch (career) {
      case "chef":
        return (
          <>
            {/* Falling food items */}
            {[...Array(25)].map((_, i) => {
              const foodEmojis = ["🍕", "🍔", "🥗", "🍝", "🥘", "🍲", "🥙", "🌮", "🍱"];
              const emoji = foodEmojis[i % foodEmojis.length];
              const startX = Math.random() * 100;
              const fallDuration = Math.random() * 8 + 12;
              
              return (
                <motion.div
                  key={`food-${i}`}
                  className="absolute text-6xl opacity-30"
                  style={{
                    left: `${startX}%`,
                    top: "-10%",
                  }}
                  animate={{
                    y: ["0vh", "110vh"],
                    rotate: [0, 360],
                    x: [0, Math.random() * 100 - 50],
                  }}
                  transition={{
                    duration: fallDuration,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 10,
                  }}
                >
                  {emoji}
                </motion.div>
              );
            })}
            
            {/* Utensils floating */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`utensil-${i}`}
                className="absolute opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              >
                <UtensilsCrossed 
                  size={Math.random() * 60 + 40}
                  className="text-chef-secondary"
                />
              </motion.div>
            ))}
            
            {/* Background gradient blobs */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`blob-${i}`}
                className="absolute rounded-full opacity-20"
                style={{
                  background: `radial-gradient(circle, hsl(var(--chef-secondary)) 0%, hsl(var(--chef-primary)) 100%)`,
                  width: Math.random() * 300 + 200,
                  height: Math.random() * 300 + 200,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -40, 0],
                  x: [0, Math.random() * 30 - 15, 0],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: Math.random() * 5 + 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </>
        );
      case "bartender":
        return (
          <>
            {/* Shaking cocktail glasses */}
            {[...Array(20)].map((_, i) => {
              const drinks = ["🍹", "🍸", "🍷", "🥃", "🍺", "🍻", "🥂"];
              const drink = drinks[i % drinks.length];
              
              return (
                <motion.div
                  key={`drink-${i}`}
                  className="absolute text-6xl"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: 0.3,
                  }}
                  animate={{
                    rotate: [-5, 5, -5],
                    x: [-10, 10, -10],
                    y: [-5, 5, -5],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 2,
                  }}
                >
                  {drink}
                </motion.div>
              );
            })}
            
            {/* Wine glass icons */}
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={`wine-${i}`}
                className="absolute opacity-15"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  rotate: [-15, 15, -15],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 2,
                }}
              >
                <Wine 
                  size={Math.random() * 70 + 50}
                  className="text-bartender-secondary"
                />
              </motion.div>
            ))}
            
            {/* Liquid bubbles */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`bubble-${i}`}
                className="absolute rounded-full opacity-25"
                style={{
                  background: `radial-gradient(circle, hsl(var(--bartender-primary)) 0%, hsl(var(--bartender-secondary)) 100%)`,
                  width: Math.random() * 100 + 40,
                  height: Math.random() * 100 + 40,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, Math.random() * -80 - 40, 0],
                  x: [0, Math.random() * 40 - 20, 0],
                  scale: [1, 1.2, 0.8, 1],
                  opacity: [0.25, 0.5, 0.25],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </>
        );
      case "aviation":
        return (
          <>
            {/* Flying airplanes */}
            {[...Array(12)].map((_, i) => {
              const isLeftToRight = i % 2 === 0;
              const startX = isLeftToRight ? "-10%" : "110%";
              const endX = isLeftToRight ? "110%" : "-10%";
              const yPosition = Math.random() * 80 + 10;
              
              return (
                <motion.div
                  key={`plane-icon-${i}`}
                  className="absolute opacity-25"
                  style={{
                    top: `${yPosition}%`,
                    left: startX,
                  }}
                  animate={{
                    x: [0, isLeftToRight ? window.innerWidth + 200 : -(window.innerWidth + 200)],
                    y: [0, Math.random() * 40 - 20, 0],
                  }}
                  transition={{
                    duration: Math.random() * 15 + 20,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 10,
                  }}
                >
                  <Plane 
                    size={Math.random() * 50 + 40}
                    className="text-aviation-secondary"
                    style={{
                      transform: isLeftToRight ? "rotate(0deg)" : "rotate(180deg)",
                    }}
                  />
                </motion.div>
              );
            })}
            
            {/* Airplane emojis */}
            {[...Array(8)].map((_, i) => {
              const isLeftToRight = i % 2 === 0;
              const yPosition = Math.random() * 70 + 15;
              
              return (
                <motion.div
                  key={`plane-emoji-${i}`}
                  className="absolute text-7xl opacity-30"
                  style={{
                    top: `${yPosition}%`,
                    left: isLeftToRight ? "-10%" : "110%",
                    transform: isLeftToRight ? "scaleX(1)" : "scaleX(-1)",
                  }}
                  animate={{
                    x: [0, isLeftToRight ? window.innerWidth + 200 : -(window.innerWidth + 200)],
                    y: [0, Math.random() * 30 - 15, 0],
                  }}
                  transition={{
                    duration: Math.random() * 18 + 25,
                    repeat: Infinity,
                    ease: "linear",
                    delay: Math.random() * 12,
                  }}
                >
                  ✈️
                </motion.div>
              );
            })}
            
            {/* Clouds */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`cloud-${i}`}
                className="absolute rounded-full opacity-20"
                style={{
                  background: `radial-gradient(ellipse, hsl(var(--aviation-primary) / 0.3) 0%, hsl(var(--aviation-secondary) / 0.2) 100%)`,
                  width: Math.random() * 350 + 250,
                  height: Math.random() * 120 + 80,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  x: [0, Math.random() * 150 + 100, 0],
                  y: [0, Math.random() * 30 - 15, 0],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: Math.random() * 10 + 15,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </>
        );
    }
  };

  const getGradientClass = () => {
    switch (career) {
      case "chef":
        return "bg-gradient-chef";
      case "bartender":
        return "bg-gradient-bartender";
      case "aviation":
        return "bg-gradient-aviation";
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className={`absolute inset-0 ${getGradientClass()} opacity-90`} />
      {getBackgroundElements()}
      <div className="absolute inset-0 bg-black/10" />
    </div>
  );
};
