import React from 'react';

interface Image {
  id: string;
  src: {
    medium: string;
  };
  alt: string;
}

interface ImageGalleryProps {
  images: Image[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {images.map((image) => (
        <div key={image.id} className="border p-2">
          <img src={image.src.medium} alt={image.alt} className="w-full" />
          <button className="bg-green-500 text-white p-2 mt-2">Spara</button>
          <button className="bg-blue-500 text-white p-2 mt-2">Ladda ner</button>
          <button className="bg-yellow-500 text-white p-2 mt-2">Dela</button>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
