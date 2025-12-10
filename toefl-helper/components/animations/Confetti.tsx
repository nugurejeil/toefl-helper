'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  trigger: boolean;
  variant?: 'default' | 'burst' | 'stars' | 'school-pride';
}

export default function Confetti({ trigger, variant = 'default' }: ConfettiProps) {
  useEffect(() => {
    if (!trigger) return;

    const colors = ['#E8A0A0', '#D4A574', '#A8D5BA', '#F4D03F', '#FFECD2'];

    switch (variant) {
      case 'burst':
        // Central burst
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors,
        });
        break;

      case 'stars':
        // Star shower from top
        const duration = 2 * 1000;
        const animationEnd = Date.now() + duration;

        const randomInRange = (min: number, max: number) => {
          return Math.random() * (max - min) + min;
        };

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            clearInterval(interval);
            return;
          }

          confetti({
            particleCount: 2,
            angle: randomInRange(55, 125),
            spread: randomInRange(50, 70),
            origin: { x: randomInRange(0.1, 0.9), y: 0 },
            colors,
            shapes: ['star'],
            scalar: 1.2,
          });
        }, 150);

        return () => clearInterval(interval);

      case 'school-pride':
        // Multiple bursts
        const count = 200;
        const defaults = {
          origin: { y: 0.7 },
          colors,
        };

        const fire = (particleRatio: number, opts: confetti.Options) => {
          confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
          });
        };

        fire(0.25, { spread: 26, startVelocity: 55 });
        fire(0.2, { spread: 60 });
        fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
        fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
        fire(0.1, { spread: 120, startVelocity: 45 });
        break;

      default:
        // Default confetti
        confetti({
          particleCount: 50,
          angle: 90,
          spread: 45,
          origin: { x: 0.5, y: 0.5 },
          colors,
        });
    }
  }, [trigger, variant]);

  return null; // This component doesn't render anything
}

// Utility function for custom confetti triggers
export const fireConfetti = (variant: ConfettiProps['variant'] = 'default') => {
  const colors = ['#E8A0A0', '#D4A574', '#A8D5BA', '#F4D03F', '#FFECD2'];

  switch (variant) {
    case 'burst':
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors,
      });
      break;

    case 'stars':
      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        confetti({
          particleCount: 2,
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          origin: { x: randomInRange(0.1, 0.9), y: 0 },
          colors,
          shapes: ['star'],
          scalar: 1.2,
        });
      }, 150);
      break;

    case 'school-pride':
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        colors,
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      };

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
      break;

    default:
      confetti({
        particleCount: 50,
        angle: 90,
        spread: 45,
        origin: { x: 0.5, y: 0.5 },
        colors,
      });
  }
};
