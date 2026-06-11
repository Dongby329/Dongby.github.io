import React from 'react';
const h = React.createElement;

export default function Navigation({ scrolled }) {
  const links = [
    { label: '首页', href: '#hero' },
    { label: '经历', href: '#about' },
    { label: '项目', href: '#projects' },
    { label: '优势', href: '#skills' },
  ];

  return h('nav', { className: scrolled ? 'nav s' : 'nav' },
    h('div', { className: 'nav-in' },
      h('div', { className: 'nav-left' },
        h('div', { className: 'nav-logo-icon' },
          h('svg', { width: 28, height: 28, viewBox: '0 0 28 28', fill: 'none' },
            h('path', {
              d: 'M14 2L25.5 8v12L14 26 2.5 20V8L14 2z',
              stroke: '#f59e0b',
              strokeWidth: 1.5,
              fill: 'none'
            }),
            h('circle', {
              cx: 14, cy: 14, r: 5,
              stroke: '#f59e0b',
              strokeWidth: 1.2,
              fill: 'none'
            })
          )
        ),
        h('span', { className: 'nav-logo-text' }, '董博宇')
      ),
      h('ul', { className: 'nav-links' },
        links.map(link =>
          h('li', { key: link.href },
            h('a', { href: link.href }, link.label)
          )
        )
      ),
      h('a', { href: '#contact', className: 'nav-cta' }, '联系我')
    )
  );
}

