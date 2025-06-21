'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';

import classic from '@/public/classic.jpg'
import gray from '@/public/gray-sofa.jpg'
import orange from '@/public/orange-sofa.jpg'
import sectional from '@/public/sectional.jpg'
import rustic from '@/public/rustic-sofa.jpg'
import sleek from '@/public/sleek-leather.jpg'
import tufted from '@/public/tufted-sofa.jpg'
import velvet from '@/public/velvet-sofa.jpg'
import vintage from '@/public/vintage-chester.jpg'
import recliner from '@/public/recliner-sofa.jpg'

const sofas = [
  { image: sleek, alt: 'Comfy Sleek Leather Sofa' },
  { image: classic, alt: 'Comfy Orange Sofa' },
  { image: orange, alt: 'Comfy Orange Sofa' },
  { image: velvet, alt: 'Lux Comfy Velvet Sofa' },
  { image: gray, alt: 'Comfy Gray Sofa' },
  { image: sectional, alt: 'Comfy Sectional Sofa' },
  { image: recliner, alt: 'Comfy Recliner Sofa' },
  { image: rustic, alt: 'Old Money Rustic Sofa' },
  { image: tufted, alt: 'Comfy Tufted Sofa' },
  { image: vintage, alt: 'Old School Vintage Chest Sofa' },
]

export default function ImageSlider() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevIndex) =>
        prevIndex < sofas.length - 1 ? prevIndex + 1 : 0
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full md:flex-row rounded-lg overflow-hidden" style={{ boxShadow: '0 7 0.5rem rgba(0, 0, 0, 0.9)' }}>
      {sofas.map((image, index) => (
        <Image
          key={index}
          src={image.image}
          loading='lazy'
          className={`w-full h-full absolute top-0 left-0 transition-all ease-in-out duration-500 ${index === currentImage
              ? 'z-10 opacity-100 transform scale-100 translate-x-0 rotate-0'
              : 'opacity-0 transform scale-[1.1] translate-x-[-1rem] rotate-[-12deg]'
            }`}
          alt={image.alt}
        />
      ))}
    </div>
  );
}
