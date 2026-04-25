import React from 'react';

export const LOGO_URL = 'https://firebasestorage.googleapis.com/v0/b/tuconexiongratis.firebasestorage.app/o/activos_marca%2FLogo%20sin%20fondo.png?alt=media&token=18b917b2-c369-42aa-804f-0f0986e755d1';

interface BrandLogoProps {
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = "w-8 h-8 rounded-md object-cover" }) => {
  return (
    <img 
      alt="Logo Tu Conexión Inmobiliaria" 
      className={className} 
      src={LOGO_URL} 
    />
  );
};
