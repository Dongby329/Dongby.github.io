import React from 'react';
const h = React.createElement;

export default function Hero() {
  return h('section', { id: 'hero', className: 'hero' },
    // Main content
    h('div', { className: 'hero-content' },
      // Title line 1
      h('div', { className: 'hero-title-line' },
        h('span', { className: 'hero-title-white' }, 'AI'),
        h('span', { className: 'hero-title-orange' }, ' PRODUCT'),
        h('span', { className: 'hero-script hero-script-1' }, 'Ecosystem')
      ),

      // Title line 2
      h('div', { className: 'hero-title-line' },
        h('span', { className: 'hero-title-orange' }, 'FOR A')
      ),

      // Title line 3
      h('div', { className: 'hero-title-line' },
        h('span', { className: 'hero-title-white' }, 'CRE'),
        h('span', { className: 'hero-title-orange' }, 'ATIVE'),
        h('span', { className: 'hero-script hero-script-2' }, 'Future')
      ),

      // Title line 4
      h('div', { className: 'hero-title-line' },
        h('span', { className: 'hero-title-orange' }, 'ERA.')
      ),

      // Description
      h('p', { className: 'hero-desc' },
        '用AI产品思维与内容创作能力，重新定义人机协作的边界，'
      ),
      h('p', { className: 'hero-desc' },
        '打造属于创作者的黄金时代。'
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
