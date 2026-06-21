import React from 'react';
const h = React.createElement;

export default function Contact() {
  return h('section', { id: 'contact', className: 'contact-sec' },
    h('div', { className: 'contact-c' },
      h('h2', { className: 'contact-title' }, '一起创造下一个可能'),
      h('p', { className: 'contact-sub' },
        '如果你对我的经历感兴趣，或者有合作的机会，欢迎随时联系我。'
      ),
      h('div', { className: 'contact-links' },
        h('a', {
          href: 'mailto:A13078574711@outlook.com',
          className: 'contact-link'
        }, '发送邮件'),
        h('a', {
          href: 'tel:13078574711',
          className: 'contact-link'
        }, '拨打电话')
      ),
      h('div', { className: 'contact-info' },
        h('div', { className: 'contact-info-item' },
          h('strong', null, '电话'),
          '130-7857-4711'
        ),
        h('div', { className: 'contact-info-item' },
          h('strong', null, '邮箱'),
          'A13078574711@outlook.com'
        ),
        h('div', { className: 'contact-info-item' },
          h('strong', null, '学校'),
          '南昌航空大学'
        ),
        h('div', { className: 'contact-info-item' },
          h('strong', null, '地点'),
          '中国 · 南昌'
        )
      )
    )
  );
}
