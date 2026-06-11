import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation.js?v=grainient-unified-4';
import Hero from './components/Hero.js?v=grainient-unified-4';
import About from './components/About.js?v=grainient-unified-4';
import Projects from './components/Projects.js?v=grainient-unified-4';
import Skills from './components/Skills.js?v=grainient-unified-4';
import Contact from './components/Contact.js?v=grainient-unified-4';
import Grainient from './components/Grainient.js?v=grainient-unified-4';

const h = React.createElement;

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const cardSelector = '.proj-card, .skill-card, .stat, .contact-link, .about-img';

    const getCardMetrics = (card, x, y) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = x - cx;
      const dy = y - cy;
      const kx = dx === 0 ? Infinity : cx / Math.abs(dx);
      const ky = dy === 0 ? Infinity : cy / Math.abs(dy);
      const edge = Math.min(Math.max(1 / Math.min(kx, ky), 0), 1) * 100;
      let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
      if (angle < 0) angle += 360;
      return { edge, angle };
    };

    const handlePointerMove = (event) => {
      const card = event.target.closest(cardSelector);
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const { edge, angle } = getCardMetrics(card, event.clientX - rect.left, event.clientY - rect.top);
      card.style.setProperty('--edge-proximity', edge.toFixed(3));
      card.style.setProperty('--cursor-angle', `${angle.toFixed(3)}deg`);
    };

    document.addEventListener('pointermove', handlePointerMove);
    return () => document.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // 高级动效：首屏 opening + 各 section 滚动动画
  useEffect(() => {
    let ctx;
    let scrollTrigger;

    (async () => {
      try {
        const gsapModule = await import('https://esm.sh/gsap@3.12.5');
        const scrollModule = await import('https://esm.sh/gsap@3.12.5/ScrollTrigger');

        const gsap = gsapModule.gsap || gsapModule.default || gsapModule;
        scrollTrigger = scrollModule.ScrollTrigger || scrollModule.default || scrollModule;
        if (gsap && scrollTrigger) {
          gsap.registerPlugin(scrollTrigger);
        }

        const hero = document.querySelector('#hero');
        const heroTitleLines = hero ? hero.querySelectorAll('.hero-title-line') : [];
        const heroDesc = hero ? hero.querySelectorAll('.hero-desc') : [];
        const heroCta = hero ? hero.querySelector('.hero-cta') : null;

        // 首屏 Opening：从压缩+遮罩揭开+位移归位，节奏偏慢
        if (hero && heroTitleLines.length && gsap) {
          gsap.set(hero, { opacity: 1 });
          gsap.set(heroTitleLines, {
            opacity: 0,
            yPercent: 40,
            skewY: 6,
            clipPath: 'inset(0 0 100% 0)',
          });
          gsap.set(heroDesc, { opacity: 0, y: 24 });
          if (heroCta) gsap.set(heroCta, { opacity: 0, y: 40 });

          gsap.timeline({
            defaults: { ease: 'power3.out' },
          })
            .to(heroTitleLines, {
              opacity: 1,
              yPercent: 0,
              skewY: 0,
              clipPath: 'inset(0 0 0% 0)',
              stagger: 0.14,
              duration: 1.4,
            }, 0.1)
            .to(heroDesc, {
              opacity: 1,
              y: 0,
              stagger: 0.08,
              duration: 0.9,
            }, '-=0.6')
            .to(heroCta, {
              opacity: 1,
              y: 0,
              duration: 0.9,
            }, '-=0.5');
        }

        if (!gsap || !scrollTrigger) return;

        // 公共：每个模块标题 + 卡片 stagger
        scrollTrigger.batch('.sec', {
          start: 'top 70%',
          onEnter: (batch) => {
            batch.forEach((sec) => {
              const label = sec.querySelector('.sec-label');
              const title = sec.querySelector('.sec-title');
              const cards = sec.querySelectorAll('.proj-card, .skill-card, .stat, .contact-link');

              if (title) {
                gsap.fromTo(title,
                  {
                    opacity: 0,
                    yPercent: 40,
                    letterSpacing: '0.4em',
                  },
                  {
                    opacity: 1,
                    yPercent: 0,
                    letterSpacing: '-0.03em',
                    ease: 'power3.out',
                    duration: 1.2,
                  }
                );
              }

              if (label) {
                gsap.fromTo(label,
                  { opacity: 0, y: 12 },
                  { opacity: 1, y: 0, ease: 'power3.out', duration: 0.6, delay: 0.1 }
                );
              }

              if (cards && cards.length) {
                gsap.fromTo(cards,
                  {
                    opacity: 0,
                    y: 32,
                    scale: 0.96,
                  },
                  {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    stagger: 0.08,
                    ease: 'power3.out',
                    duration: 0.9,
                    delay: 0.25,
                  }
                );
              }
            });
          },
        });

        // About 區：照片輕微視差
        const aboutImg = document.querySelector('#about .about-img');
        if (aboutImg) {
          gsap.fromTo(aboutImg,
            { yPercent: 6 },
            {
              yPercent: -6,
              ease: 'none',
              scrollTrigger: {
                trigger: '#about',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.8,
              },
            }
          );
        }

        // Projects 中的视频卡和 H5 卡片輕微視差
        const projImages = document.querySelectorAll('#projects .proj-img');
        projImages.forEach((img) => {
          gsap.fromTo(img,
            { yPercent: 6 },
            {
              yPercent: -4,
              ease: 'none',
              scrollTrigger: {
                trigger: img,
                start: 'top 90%',
                end: 'bottom 10%',
                scrub: 0.7,
              },
            }
          );
        });

      } catch (e) {
        // 動效載入失敗時靜默降級，避免黑屏
        console.warn('GSAP animation init failed', e);
      }
    })();

    return () => {
      try {
        if (scrollTrigger && scrollTrigger.getAll) {
          scrollTrigger.getAll().forEach((st) => st.kill());
        }
      } catch (_) {
        // ignore
      }
    };
  }, []);

  return h('div', { className: 'site-shell' },
    h('div', { className: 'site-grainient-bg', 'aria-hidden': 'true' },
      h(Grainient, {
        className: 'site-grainient',
        color1: '#F59E0B',
        color2: '#000000',
        color3: '#F97316',
        timeSpeed: 0.45,
        colorBalance: -0.12,
        warpStrength: 1.75,
        warpFrequency: 3.8,
        warpSpeed: 1.3,
        warpAmplitude: 22,
        blendAngle: -33,
        blendSoftness: 0.15,
        rotationAmount: 500,
        noiseScale: 2.3,
        grainAmount: 0.16,
        grainScale: 2,
        grainAnimated: false,
        contrast: 1.85,
        gamma: 1,
        saturation: 0.7,
        centerX: 0.12,
        centerY: 0,
        zoom: 0.85,
      })
    ),
    h(Navigation, { scrolled }),
    h(Hero),
    h(About),
    h(Projects),
    h(Skills),
    h(Contact)
  );
}
