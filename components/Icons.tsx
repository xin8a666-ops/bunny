import React, { useState } from 'react';

// Custom Bunny Logo Image
export const IconBunnyLogo = ({ className }: { className?: string }) => {
  // We use the image if available, otherwise we render the custom SVG design
  // The user provided design is a bunny with a blue hat on a yellow background
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
        {/* Try to load the file if the user uploads it */}
        <img 
            src="/bunny-logo.png" 
            alt="Bunny Bakes Logo" 
            className="absolute inset-0 w-full h-full object-cover z-10"
            onError={(e) => {
                e.currentTarget.style.display = 'none';
            }}
        />
        
        {/* Fallback SVG Design based on user's request */}
        <svg viewBox="0 0 100 100" className="w-full h-full" style={{ backgroundColor: '#FFE69C' }} fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Body */}
            <path d="M35 65C30 75 30 90 35 95H65C70 90 70 75 65 65" fill="#E6B88A" stroke="#4A3B32" strokeWidth="2.5" strokeLinejoin="round"/>
            
            {/* Apron */}
            <path d="M38 72H62V90C62 92 60 94 58 94H42C40 94 38 92 38 90V72Z" fill="#F4A261" stroke="#4A3B32" strokeWidth="2.5" strokeLinejoin="round"/>
            <path d="M42 80H58" stroke="#4A3B32" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" opacity="0.5"/>

            {/* Ears */}
            <path d="M35 35C32 20 35 10 40 10C45 10 48 20 45 35" fill="#E6B88A" stroke="#4A3B32" strokeWidth="2.5" strokeLinejoin="round"/>
            <path d="M65 35C68 20 65 10 60 10C55 10 52 20 55 35" fill="#E6B88A" stroke="#4A3B32" strokeWidth="2.5" strokeLinejoin="round"/>
            
            {/* Head */}
            <ellipse cx="50" cy="50" rx="22" ry="18" fill="#FCEAC6" stroke="#4A3B32" strokeWidth="2.5"/>
            
            {/* Blue Beret Hat */}
            <path d="M32 38C28 38 25 42 28 45C30 48 35 48 50 48C65 48 70 48 72 45C75 42 72 38 68 38H32Z" fill="#89CFF0" stroke="#4A3B32" strokeWidth="2.5" strokeLinejoin="round"/>
            <path d="M60 38C65 38 70 30 50 30C35 30 40 38 40 38" fill="#89CFF0" stroke="#4A3B32" strokeWidth="2.5" strokeLinejoin="round"/>
            
            {/* Face Features */}
            <circle cx="43" cy="50" r="2.5" fill="#4A3B32"/>
            <circle cx="57" cy="50" r="2.5" fill="#4A3B32"/>
            <path d="M48 55Q50 57 52 55" stroke="#4A3B32" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="38" cy="54" r="3" fill="#FFB7B2" opacity="0.6"/>
            <circle cx="62" cy="54" r="3" fill="#FFB7B2" opacity="0.6"/>

            {/* Arms holding tray */}
            <path d="M30 65L40 60" stroke="#4A3B32" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M70 65L60 60" stroke="#4A3B32" strokeWidth="2.5" strokeLinecap="round"/>
            
            {/* Tray */}
            <rect x="25" y="62" width="50" height="5" rx="1" fill="#C4A484" stroke="#4A3B32" strokeWidth="2"/>
        </svg>
    </div>
  );
};

export const IconChefHat = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" />
    <line x1="6" x2="18" y1="17" y2="17" />
  </svg>
);

export const IconWand = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 4V2" />
    <path d="M15 16a5 5 0 1 1-5-5 5 5 0 0 1 5 5Zm0 0 4 4" />
    <path d="M19.5 9.5 21 8" />
    <path d="M22 13h-2" />
  </svg>
);

export const IconMessage = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export const IconHome = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export const IconArrowLeft = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

export const IconClock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const IconSend = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

export const IconBook = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

export const IconPlus = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export const IconCamera = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

export const IconImage = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

export const IconCommunity = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const IconHeart = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

export const IconHeartFilled = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" className={className}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);