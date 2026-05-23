import React from 'react';
import { motion } from 'framer-motion';
import './FloatingDrawings.css';

/**
 * Decorative children's drawings that peek in from the left and right
 * edges of the screen. Purely visual — pointer-events are disabled so
 * they never interfere with clicks or navigation.
 *
 * Images must be placed at  public/drawings/  with the names below.
 * white backgrounds are made transparent via mix-blend-mode: multiply.
 */
const DRAWINGS = [
  // ── Left side ──────────────────────────────────────────────
  {
    src: '/drawings/person-1.png',
    alt: 'desen copil',
    side: 'left',
    top: '8%',
    rotate: -8,
    delay: 0,
    size: 130,
    peek: 0.38,   // fraction hidden off-screen (0 = fully visible, 1 = fully hidden)
  },
  {
    src: '/drawings/bunny.png',
    alt: 'desen iepure',
    side: 'left',
    top: '40%',
    rotate: 5,
    delay: 1.2,
    size: 145,
    peek: 0.32,
  },
  {
    src: '/drawings/pig.png',
    alt: 'desen porc',
    side: 'left',
    top: '72%',
    rotate: -4,
    delay: 2.4,
    size: 138,
    peek: 0.36,
  },
  // ── Right side ─────────────────────────────────────────────
  {
    src: '/drawings/ladybug.png',
    alt: 'desen buburuză',
    side: 'right',
    top: '6%',
    rotate: 10,
    delay: 0.4,
    size: 125,
    peek: 0.30,
  },
  {
    src: '/drawings/mouse.png',
    alt: 'desen șoricel',
    side: 'right',
    top: '38%',
    rotate: -7,
    delay: 1.6,
    size: 132,
    peek: 0.34,
  },
  {
    src: '/drawings/person-2.png',
    alt: 'desen copil',
    side: 'right',
    top: '68%',
    rotate: 6,
    delay: 2.8,
    size: 122,
    peek: 0.38,
  },
];

const FloatingDrawings = () => (
  <div className="fd-wrapper" aria-hidden="true">
    {DRAWINGS.map((d, i) => {
      const offset = `${-(d.size * d.peek)}px`;
      const style = {
        top: d.top,
        [d.side]: offset,
        '--fd-size': `${d.size}px`,
        '--fd-rotate': `${d.rotate}deg`,
      };

      return (
        <motion.div
          key={d.src}
          className={`fd-item fd-${d.side}`}
          style={style}
          animate={{ y: [0, -10, 2, 0] }}
          transition={{
            duration: 3.6 + i * 0.45,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: d.delay,
          }}
        >
          <img src={d.src} alt={d.alt} className="fd-img" />
        </motion.div>
      );
    })}
  </div>
);

export default FloatingDrawings;
