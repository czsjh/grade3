import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface StarsProps {
  rating: number;
  maxRating?: number;
  size?: number;
  onRate?: (rating: number) => void;
}

const Stars: React.FC<StarsProps> = ({ 
  rating, 
  maxRating = 3, 
  size = 24,
  onRate 
}) => {
  return (
    <div className="flex gap-1">
      {Array.from({ length: maxRating }).map((_, index) => {
        const isFilled = index < rating;
        return (
          <motion.div
            key={index}
            whileHover={onRate ? { scale: 1.2 } : {}}
            whileTap={onRate ? { scale: 0.8 } : {}}
            onClick={() => onRate?.(index + 1)}
            className={onRate ? 'cursor-pointer' : ''}
          >
            <Star
              size={size}
              className={`transition-colors ${
                isFilled 
                  ? 'text-yellow-400 fill-yellow-400' 
                  : 'text-gray-300'
              }`}
            />
          </motion.div>
        );
      })}
    </div>
  );
};

export default Stars;
