import React, { useEffect, useRef } from 'react';
const h = React.createElement;

function useScrollAnimate() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('v');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function About() {
  const ref1 = useScrollAnimate();
  const ref2 = useScrollAnimate();
  const ref3 = useScrollAnimate();

  return h('section', { id: 'about', className: 'sec' },
    h('div', { className: 'sec-in' },
      h('div', { className: 'sec-label' }, 'About'),
      h('h2', { className: 'sec-title' }, '个人经历'),
      h('div', { className: 'about-g' },
        h('div', { className: 'about-img a-fu', ref: ref1 },
          h('img', {
            className: 'about-photo',
            src: './src/assets/profile/IMG_0072.JPG',
            alt: '董博宇个人照片',
            loading: 'lazy',
          })
        ),
        h('div', { className: 'about-c' },
          h('div', { className: 'about-t a-fu', ref: ref2 },
            h('p', null,
              '我是',
              h('strong', null, '董博宇'),
              '，南昌航空大学播音与主持艺术专业在读。虽然专业背景偏向传媒，但我对 AI 技术与产品设计的热情驱动我深入 AIGC 领域。'
            ),
            h('p', { style: { marginTop: '16px' } },
              '在海艺互娱科技有限公司，我先后担任 AI 产品经理与 AI 内容运营。产品经理阶段，负责 C 端工具类 H5 模块的产品工作，使用 AI 辅助输出 Figma 交互原型与 PRD 需求文档，参与 10+ 场技术评审会议，跟进全周期测试并推动问题闭环修复。内容运营阶段，深度参与核心 AIGC 项目 ',
              h('strong', null, 'SeaTunes'),
              ' 从 0 到 1 的孵化，训练 LoRA 模型、开发 ComfyUI 工作流，实现产品 MAU 增长 300%。'
            ),
            h('p', { style: { marginTop: '16px' } },
              '我相信，AI 不只是工具，更是重新定义产品边界的思维方式。'
            )
          ),
          h('div', { className: 'about-stats a-fu', ref: ref3 },
            h('div', { className: 'stat' },
              h('div', { className: 'stat-n' }, '3+'),
              h('div', { className: 'stat-l' }, '段实习经历')
            ),
            h('div', { className: 'stat' },
              h('div', { className: 'stat-n' }, '300%'),
              h('div', { className: 'stat-l' }, 'MAU 增长')
            ),
            h('div', { className: 'stat' },
              h('div', { className: 'stat-n' }, '2'),
              h('div', { className: 'stat-l' }, '核心项目')
            )
          ),
          h('div', { className: 'about-contact' },
            h('div', { className: 'contact-r' },
              h('span', null, '电话'),
              h('span', null, '130-7857-4711')
            ),
            h('div', { className: 'contact-r' },
              h('span', null, '邮箱'),
              h('span', null, 'A13078574711@outlook.com')
            ),
            h('div', { className: 'contact-r' },
              h('span', null, '学历'),
              h('span', null, '南昌航空大学 · 播音与主持艺术')
            )
          )
        )
      )
    )
  );
}
