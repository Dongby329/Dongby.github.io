import React from 'react';
import TextPressure from './TextPressure.js';
const h = React.createElement;

export default function Hero() {
  return h('section', { id: 'hero', className: 'hero' },
    // Animated background orbs
    h('div', { className: 'hero-bg' },
      h('div', { className: 'hero-bg-orb hero-bg-orb--1' }),
      h('div', { className: 'hero-bg-orb hero-bg-orb--2' }),
      h('div', { className: 'hero-bg-orb hero-bg-orb--3' })
    ),

    // Main content
    h('div', { className: 'hero-content' },
      // Tagline
      h('p', { className: 'hero-tagline' }, 'HELLO, I’M'),

      // TextPressure title — Sounso Quality + mouse interactive animation
      h('div', { className: 'hero-pressure-wrap' },
        h(TextPressure, {
          text: 'DONGBOYU',
          fontFamily: 'Sounso Quality',
          fontUrl: '',
          flex: false,
          alpha: true,
          stroke: false,
          width: true,
          weight: true,
          italic: true,
          textColor: '#f59e0b',
          strokeColor: '#f59e0b',
          minFontSize: 48,
          minWeight: 300,
          maxWeight: 900,
          staticFont: true
        })
      ),

      // Subtitle
      h('p', { className: 'hero-subtitle' }, '产品经理 · 创意探索者'),

      // CTA buttons
      h('div', { className: 'hero-cta' },
        h('a', { href: '#about', className: 'btn-primary' },
          h('span', { className: 'btn-primary-text' }, '了解我')
        ),
        h('a', { href: '#projects', className: 'btn-secondary' }, '查看项目')
      ),

      // Scroll-down indicator
      h('div', { className: 'hero-scroll' },
        h('span', { className: 'hero-scroll-line' })
      )
    )
  );
}
