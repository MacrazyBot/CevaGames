import { motion } from "framer-motion";

interface ProgressBarProps {
  progress: number;
  maxProgress: number;
  label?: string;
}

export const ProgressBar = ({ progress, maxProgress, label }: ProgressBarProps) => {
  const percentage = Math.min((progress / maxProgress) * 100, 100);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-white text-sm mb-1">
          <span>{label}</span>
          <span>{Math.floor(percentage)}%</span>
        </div>
      )}
      <div className="w-full h-4 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};
