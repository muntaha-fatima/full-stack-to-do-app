'use client';

import React from 'react';

const PurplePinkSmokeBackground = () => {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">
      {/* Soft gradient background with pink and purple tones */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 10% 20%, rgba(219, 112, 147, 0.3) 0%, transparent 20%), radial-gradient(circle at 90% 80%, rgba(147, 112, 219, 0.3) 0%, transparent 20%)',
        }}
      />

      {/* Gentle floating particles for smoke effect */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-15"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              background: i % 2 === 0
                ? 'radial-gradient(circle, rgba(219, 112, 147, 0.4), transparent)'
                : 'radial-gradient(circle, rgba(147, 112, 219, 0.4), transparent)',
              animation: `float${i % 3 + 1} ${Math.random() * 20 + 15}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
              filter: 'blur(30px)',
            }}
          />
        ))}
      </div>

      {/* Custom animation styles */}
      <style jsx global>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(20px, 30px); }
          50% { transform: translate(-15px, 25px); }
          75% { transform: translate(25px, -20px); }
        }

        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-30px, -20px); }
          50% { transform: translate(20px, -35px); }
          75% { transform: translate(-25px, 15px); }
        }

        @keyframes float3 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(15px, -25px); }
          50% { transform: translate(-25px, 15px); }
          75% { transform: translate(30px, 20px); }
        }
      `}</style>
    </div>
  );
};

export default PurplePinkSmokeBackground;