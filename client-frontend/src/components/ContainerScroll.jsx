import React, { useRef, useState, useEffect } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import './ContainerScroll.css';

export const ContainerScroll = ({ titleComponent, children }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [0.7, 0.9] : [1.05, 1]
  );
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div className="cscroll-container" ref={containerRef}>
      <div className="cscroll-inner">
        <motion.div
          style={{ translateY: translate }}
          className="cscroll-header"
        >
          {titleComponent}
        </motion.div>

        <motion.div
          style={{
            rotateX: rotate,
            scale,
            boxShadow:
              '0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003',
          }}
          className="cscroll-card"
        >
          <div className="cscroll-card-inner">{children}</div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContainerScroll;
