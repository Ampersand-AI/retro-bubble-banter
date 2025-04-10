import React, { useEffect, useState } from 'react';

const comicImages = [
  '/images/rovyk-comic.jpg',
  '/images/rovyk-comic-1.jpeg',
  '/images/rovyk-comic-2.jpeg',
  '/images/rovyk-comic-3.jpeg',
  '/images/rovyk-comic-4.jpeg'
];

const ComicImage = () => {
  const [selectedImage, setSelectedImage] = useState(comicImages[0]);

  useEffect(() => {
    // Select a random image on mount
    const randomIndex = Math.floor(Math.random() * comicImages.length);
    setSelectedImage(comicImages[randomIndex]);
  }, []);

  return (
    <div className="relative w-full h-0 pb-[100%] bg-amp-blue/30 rounded-lg overflow-hidden ">
      <img 
        src={selectedImage}
        alt="Rovyk Comic"
        className="absolute inset-0 w-full h-full object-contain p-4 "
      />
    </div>
  );
};

export default ComicImage; 