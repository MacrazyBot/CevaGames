import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CareerSlide } from "./CareerSlide";
import { GameModal } from "./games/GameModal";
import { ChevronLeft, ChevronRight } from "lucide-react";
import chefImage from "@/assets/chef-hero.png";
import bartenderImage from "@/assets/bartender-hero.png";
import aviationImage from "@/assets/aviation-hero.png";
import logo from "@/assets/logo.png";

const careers = [
  {
    id: "aviation" as const,
    title: "Aviacion Comercial",
    description: "Vuela alto y alcanza tus sueños en la aviación comercial",
    image: aviationImage,
    youtubeUrl: "https://cevaturpiura.edu.pe/Careers#careers",
  },
  {
    id: "chef" as const,
    title: "Chef Profesional",
    description: "Domina el arte culinario y conviértete en un chef de clase mundial",
    image: chefImage,
    youtubeUrl: "https://cevaturpiura.edu.pe/Careers#careers",
  },
  {
    id: "bartender" as const,
    title: "Bartender Experto",
    description: "Aprende el arte de la mixología y crea experiencias únicas",
    image: bartenderImage,
    youtubeUrl: "https://cevaturpiura.edu.pe/Careers#careers",
  },
];

export const CareerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [activeGameType, setActiveGameType] = useState<"chef" | "bartender" | "aviation">("aviation");

  useEffect(() => {
    // Don't auto-switch if game is open
    if (isGameOpen) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % careers.length);
    }, 12000);

    return () => clearInterval(interval);
  }, [isGameOpen]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % careers.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + careers.length) % careers.length);
  };

  const openGame = (gameType: "chef" | "bartender" | "aviation") => {
    setActiveGameType(gameType);
    setIsGameOpen(true);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Logo */}
      <motion.div
        className="absolute top-8 left-8 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img src={logo} alt="CEVATUR Logo" className="w-32 h-auto sm:w-40 lg:w-52 drop-shadow-lg" />
      </motion.div>

      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CareerSlide
            career={careers[currentIndex].id}
            title={careers[currentIndex].title}
            description={careers[currentIndex].description}
            image={careers[currentIndex].image}
            youtubeUrl={careers[currentIndex].youtubeUrl}
            isActive={true}
            onOpenGame={() => openGame(careers[currentIndex].id)}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-3">
        {careers.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Game Modal - managed at carousel level so it persists */}
      <GameModal
        isOpen={isGameOpen}
        onClose={() => setIsGameOpen(false)}
        gameType={activeGameType}
      />
    </div>
  );
};
