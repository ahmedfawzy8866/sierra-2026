import { animate } from 'animejs';

/**
 * SIERRA BLU — GRAVITY WARP (CINEMATIC FX)
 * Handles the "Gravity Warp" visual transitions for premium aesthetics.
 * Optimized for Next.js Client Components.
 */

const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const startGravityWarp = (active: boolean) => {
  if (typeof window === 'undefined') return;

  const field = document.querySelector('.gravity-warp-field');
  if (!field) return;

  if (active) {
    field.classList.add('active');

    // Smooth transition to dark mode aesthetics
    animate('body', {
      backgroundColor: '#050a14',
      duration: 1000,
      easing: 'easeInOutQuad',
    });

    animate('.gravity-warp-layer', {
      scale: 1.2,
      rotate: '1turn',
      duration: 20000,
      loop: true,
      easing: 'linear',
    });
  } else {
    field.classList.remove('active');
    
    // Smooth transition back to neutral/light mode
    animate('body', {
      backgroundColor: '#FAFAF7',
      duration: 500,
      easing: 'easeInOutQuad',
    });
  }
};

export const createParticles = (container: HTMLElement) => {
  if (!container) return;
  
  // Clear existing particles to prevent memory leaks on re-run
  container.innerHTML = '';

  for (let i = 0; i < 50; i++) {
    const p = document.createElement('div');
    p.className = 'gravity-warp-particle';
    p.style.position = 'absolute';
    p.style.width = '2px';
    p.style.height = '2px';
    p.style.borderRadius = '50%';
    p.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    container.appendChild(p);

    animate(p, {
      translateX: randomBetween(-150, 150),
      translateY: randomBetween(-150, 150),
      scale: [{ value: 2, duration: 1000 }, { value: 0, duration: 2000 }],
      opacity: [{ value: 0.8, duration: 1000 }, { value: 0, duration: 2000 }],
      duration: randomBetween(3000, 6000),
      delay: randomBetween(0, 3000),
      loop: true,
      easing: 'easeInOutQuad',
    });
  }
};

