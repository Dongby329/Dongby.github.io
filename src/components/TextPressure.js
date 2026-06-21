import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
const h = React.createElement;

const dist = (a, b) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (distance, maxDist, minVal, maxVal) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export default function TextPressure({
  text = 'Compressa',
  fontFamily = 'Compressa VF',
  fontUrl = 'https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2',

  width = true,
  weight = true,
  italic = true,
  alpha = false,

  flex = true,
  stroke = false,
  scale = false,

  textColor = '#FFFFFF',
  strokeColor = '#FF0000',
  className = '',

  minFontSize = 24,
  minWeight = 100,
  maxWeight = 900,

  // Static font mode: use CSS transforms instead of font-variation-settings
  staticFont = false
}) {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const spansRef = useRef([]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const chars = text.split('');

  useEffect(() => {
    const handleMouseMove = e => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const handleTouchMove = e => {
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    if (containerRef.current) {
      const { left, top, width, height } = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = left + width / 2;
      mouseRef.current.y = top + height / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

    let newFontSize = containerW / (chars.length / 2);
    newFontSize = Math.max(newFontSize, minFontSize);

    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();

      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;
        setScaleY(yRatio);
        setLineHeight(yRatio);
      }
    });
  }, [chars.length, minFontSize, scale]);

  useEffect(() => {
    const debouncedSetSize = debounce(setSize, 100);
    debouncedSetSize();
    window.addEventListener('resize', debouncedSetSize);
    return () => window.removeEventListener('resize', debouncedSetSize);
  }, [setSize]);

  useEffect(() => {
    let rafId;
    const animate = () => {
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect();
        const maxDist = titleRect.width / 2;

        spansRef.current.forEach(span => {
          if (!span) return;

          const rect = span.getBoundingClientRect();
          const charCenter = {
            x: rect.x + rect.width / 2,
            y: rect.y + rect.height / 2
          };

          const d = dist(mouseRef.current, charCenter);

          if (staticFont) {
            // ── Static font: use CSS transforms + text-stroke ──
            const wdth = width ? getAttr(d, maxDist, 5, 200) : 100;        // 5..200
            const wght = weight ? getAttr(d, maxDist, minWeight, maxWeight) : 400;
            const italVal = italic ? getAttr(d, maxDist, 0, 1) : 0;
            const alphaVal = alpha ? getAttr(d, maxDist, 0.15, 1).toFixed(2) : 1;

            // scaleX: map wdth 5..200 → 0.85..1.15
            const sx = 1 + (wdth - 100) / 100 * 0.18;
            // skewX: map ital 0..1 → 0..12 deg
            const skx = italVal * 12;
            // stroke: map wght → 0..5px
            const weightRatio = (wght - 100) / 800;
            const strokeW = Math.max(0, weightRatio * 5);

            const transform = `scaleX(${sx.toFixed(3)}) skewX(${skx.toFixed(2)}deg)`;

            if (span.style.transform !== transform) {
              span.style.transform = transform;
            }
            const newStroke = `${strokeW.toFixed(2)}px`;
            if (span.style.webkitTextStrokeWidth !== newStroke) {
              span.style.webkitTextStrokeWidth = newStroke;
              span.style.webkitTextStrokeColor = textColor;
            }
            if (alpha) {
              span.style.opacity = alphaVal;
            }
          } else {
            // ── Variable font: use font-variation-settings ──
            const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
            const wght = weight ? Math.floor(getAttr(d, maxDist, minWeight, maxWeight)) : 400;
            const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : 0;
            const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : 1;

            const newFontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;

            if (span.style.fontVariationSettings !== newFontVariationSettings) {
              span.style.fontVariationSettings = newFontVariationSettings;
            }
            if (alpha && span.style.opacity !== alphaVal) {
              span.style.opacity = alphaVal;
            }
          }
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, [width, weight, italic, alpha, staticFont, textColor, minWeight, maxWeight]);

  const styleElement = useMemo(() => {
    // Only inject @font-face for variable fonts (CDN-loaded)
    if (!staticFont && fontUrl) {
      return h('style', null,
        `@font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}');
          font-style: normal;
        }

        .flex {
          display: flex;
          justify-content: space-between;
        }

        .stroke span {
          position: relative;
          color: ${textColor};
        }
        .stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: 3px;
          -webkit-text-stroke-color: ${strokeColor};
        }

        .text-pressure-title {
          color: ${textColor};
        }
        .text-pressure-title.center {
          display: flex;
          justify-content: center;
        }
        .text-pressure-title.center span {
          flex-shrink: 0;
        }`
      );
    }
    // Static font: @font-face handled externally, only inject utility styles
    return h('style', null,
      `.flex {
        display: flex;
        justify-content: space-between;
      }

      .stroke span {
        position: relative;
        color: ${textColor};
      }
      .stroke span::after {
        content: attr(data-char);
        position: absolute;
        left: 0;
        top: 0;
        color: transparent;
        z-index: -1;
        -webkit-text-stroke-width: 3px;
        -webkit-text-stroke-color: ${strokeColor};
      }

      .text-pressure-title {
        color: ${textColor};
      }
      .text-pressure-title.center {
        display: flex;
        justify-content: center;
      }
      .text-pressure-title.center span {
        flex-shrink: 0;
      }`
    );
  }, [fontFamily, fontUrl, textColor, strokeColor, staticFont]);

  const dynamicClassName = [
    className,
    flex ? 'flex' : 'center',
    stroke ? 'stroke' : ''
  ].filter(Boolean).join(' ');

  // Base font weight for static fonts should be normal (not 100)
  const baseWeight = staticFont ? 700 : 100;

  return h('div', {
    ref: containerRef,
    style: {
      position: 'relative',
      width: '100%',
      height: '100%',
      background: 'transparent'
    }
  },
    styleElement,
    h('h1', {
      ref: titleRef,
      className: `text-pressure-title ${dynamicClassName}`,
      style: {
        fontFamily,
        textTransform: 'uppercase',
        fontSize: fontSize,
        lineHeight,
        transform: `scale(1, ${scaleY})`,
        transformOrigin: 'center top',
        margin: 0,
        userSelect: 'none',
        whiteSpace: 'nowrap',
        fontWeight: baseWeight,
        width: '100%'
      }
    },
      chars.map((char, i) =>
        h('span', {
          key: i,
          ref: el => (spansRef.current[i] = el),
          'data-char': char,
          style: {
            display: 'inline-block',
            color: stroke ? undefined : textColor,
            willChange: staticFont ? 'transform' : undefined
          }
        }, char)
      )
    )
  );
}
