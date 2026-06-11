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

export default function Skills() {
  const ref = useScrollAnimate();

  const skills = [
    { icon: '📋', title: '产品规划与 PRD', desc: '独立完成标准化 PRD 输出，梳理业务逻辑、功能边界与异常流程，保障研发与测试信息对齐。' },
    { icon: '🤖', title: 'AI 工具链应用', desc: '熟练运用 Figma+AI、ComfyUI、SeaFlow 等工具，训练 LoRA 模型，开发对话式交互产品原型。' },
    { icon: '🤝', title: '跨部门协作', desc: '对接研发、测试、运营多部门，统筹项目排期与进度，跟进全周期测试 Bug 累计发现 50+ 问题并推动 80% 闭环修复，保障功能按期上线。' },
    { icon: '📈', title: '用户增长与运营', desc: '策划效果广告视频与线下活动，实现产品 MAU 增长 300%，建立从引流到转化的闭环。' },
    { icon: '🎬', title: '内容策划与制作', desc: '具备从撰稿策划、拍摄到后期剪辑的全流程能力，单条视频播放量突破 1w+。' },
    { icon: '📊', title: '数据分析与优化', desc: '持续跟踪留存、转化等核心用户数据，复盘功能上线效果，输出优化建议支撑产品迭代。' },
  ];

  return h('section', { id: 'skills', className: 'sec' },
    h('div', { className: 'sec-in' },
      h('div', { className: 'sec-label' }, 'Strengths'),
      h('h2', { className: 'sec-title' }, '个人优势'),
      h('div', { className: 'skill-g a-fu', ref: ref },
        skills.map((s, i) =>
          h('div', {
            className: 'skill-card',
            key: i,
            style: { animationDelay: `${i * 0.1}s` }
          },
            h('div', { className: 'skill-icon' }, s.icon),
            h('h3', { className: 'skill-title' }, s.title),
            h('p', { className: 'skill-desc' }, s.desc)
          )
        )
      )
    )
  );
}

