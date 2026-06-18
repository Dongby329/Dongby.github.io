import React from 'react';
import TextPressure from './TextPressure.js';
const h = React.createElement;

export default function Hero() {
  return h('section', { id: 'hero', className: 'hero' },
    // Main content
    h('div', { className: 'hero-content' },
      // TextPressure title
      h('div', { className: 'hero-pressure-wrap' },
        h(TextPressure, {
          text: 'DONGBOYU',
          flex: true,
          alpha: true,
          stroke: false,
          width: true,
          weight: true,
          italic: true,
          textColor: '#f59e0b',
          strokeColor: '#f59e0b',
          minFontSize: 48
        })
      ),

      // CTA buttons
      h('div', { className: 'hero-cta' },
        h('a', { href: '#about', className: 'btn-primary' },
          h('span', { className: 'btn-primary-text' }, '了解我')
        ),
        h('a', { href: '#projects', className: 'btn-secondary' }, '查看项目')
      )
    )
  );
}
