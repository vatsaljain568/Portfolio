import { useEffect, useRef, useState } from 'react';

const SPRITE_SIZE = 32;

// Detect theme for brightness filter
const useIsDark = () => {
  const [dark, setDark] = useState(() => !document.documentElement.classList.contains('light'));
  useEffect(() => {
    const obs = new MutationObserver(() => setDark(!document.documentElement.classList.contains('light')));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
};

const frame = (col, row) => ({
  x: -(col * SPRITE_SIZE),
  y: -(row * SPRITE_SIZE),
});

const SPRITES = {
  sit:      frame(0, 0),
  alert:    frame(1, 0),
  sleep1:   frame(2, 0),
  sleep2:   frame(3, 0),
  awake:    frame(4, 0),
  groom1:   frame(5, 0),
  groom2:   frame(6, 0),
  scratch1: frame(7, 0),
  tiltL:    frame(0, 3),
  tiltR:    frame(1, 3),
  yawn:     frame(2, 3),
  scratchW1:frame(5, 3),
  scratchW2:frame(6, 3),
};

const IDLE_ANIMATIONS = [
  {
    name: 'sleep',
    frames: ['sleep1', 'sleep2'],
    frameDuration: 800,
    totalLoops: 5,
  },
  {
    name: 'groom',
    frames: ['groom1', 'groom2'],
    frameDuration: 350,
    totalLoops: 4,
  },
  {
    name: 'sit',
    frames: ['sit'],
    frameDuration: 500,
    totalLoops: 1,
  },
  {
    name: 'yawn',
    frames: ['yawn', 'awake', 'sit'],
    frameDuration: 500,
    totalLoops: 1,
  },
  {
    name: 'tilt',
    frames: ['tiltL', 'tiltR'],
    frameDuration: 600,
    totalLoops: 2,
  },
  {
    name: 'scratch',
    frames: ['scratchW1', 'scratchW2'],
    frameDuration: 250,
    totalLoops: 3,
  },
];

const OnekoCat = () => {
  const [sprite, setSprite] = useState(SPRITES.sit);
  const animRef = useRef(null);
  const timeoutRef = useRef(null);
  const isDark = useIsDark();

  useEffect(() => {
    let cancelled = false;

    const runIdleLoop = () => {
      if (cancelled) return;

      const anim = IDLE_ANIMATIONS[Math.floor(Math.random() * IDLE_ANIMATIONS.length)];
      let loopCount = 0;
      let frameIndex = 0;

      const tick = () => {
        if (cancelled) return;

        const spriteKey = anim.frames[frameIndex % anim.frames.length];
        setSprite(SPRITES[spriteKey]);

        frameIndex++;
        if (frameIndex >= anim.frames.length) {
          frameIndex = 0;
          loopCount++;
        }

        if (loopCount < anim.totalLoops) {
          animRef.current = setTimeout(tick, anim.frameDuration);
        } else {
          setSprite(SPRITES.sit);
          const pause = 2000 + Math.random() * 4000;
          timeoutRef.current = setTimeout(runIdleLoop, pause);
        }
      };

      tick();
    };

    timeoutRef.current = setTimeout(runIdleLoop, 2000);

    return () => {
      cancelled = true;
      clearTimeout(animRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const scaledSize = SPRITE_SIZE * 2;

  return (
    <span
      className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
      style={{ bottom: '90%', width: scaledSize, height: scaledSize }}
      title="meow 🐱"
      aria-hidden="true"
    >
      <span
        className="block"
        style={{
          width: scaledSize,
          height: scaledSize,
          imageRendering: 'pixelated',
          backgroundImage: 'url(/oneko.gif)',
          backgroundSize: `${256 * 2}px ${128 * 2}px`,
          backgroundPosition: `${sprite.x * 2}px ${sprite.y * 2}px`,
          backgroundRepeat: 'no-repeat',
          filter: isDark ? 'brightness(0.95)' : 'brightness(0.15)',
          transition: 'filter 0.5s ease',
        }}
      />
    </span>
  );
};

export default OnekoCat;
