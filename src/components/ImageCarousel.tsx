import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useHelia } from '../context/HeliaContext';
import { getImages } from '../utils/ipfs';

interface ImageCarouselProps {
  images: string[];
  height?: string;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  height = "h-48"
}) => {
  const heliaContext = useHelia();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [localImages, setLocalImages] = useState<string[]>([]);


  useEffect(() => {
    const fetchImages = async () => {
      if (!heliaContext || !heliaContext.fs || !images) return
      const _localImages = await getImages(heliaContext, images)
      setLocalImages(_localImages)
    }
    fetchImages()
    if (!isHovered && localImages.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((current) => (current + 1) % images.length)
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [isHovered, images.length]);

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((current) => (current + 1) % localImages.length);
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((current) => (current - 1 + localImages.length) % localImages.length);
  };

  return (
    <div
      className={`relative ${height} overflow-hidden group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {localImages.map((image, index) => (
        <img
          key={image}
          src={image}
          alt={`Product image ${index + 1}`}
          className={`absolute w-full h-full object-cover transition-transform duration-500 ease-in-out ${index === currentIndex ? 'translate-x-0' :
            index < currentIndex ? '-translate-x-full' : 'translate-x-full'
            }`}
        />
      ))}

      {localImages.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300
                     hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5 text-gray-800" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300
                     hover:bg-white"
          >
            <ChevronRight className="h-5 w-5 text-gray-800" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {localImages.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${index === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};