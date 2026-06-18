import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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

function formatTime(value) {
  if (!Number.isFinite(value)) return '0:00';
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

const modalStyle = {
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '36px',
  background: 'rgba(3, 3, 6, 0.94)',
  backdropFilter: 'blur(18px)',
};

const backStyle = {
  position: 'fixed',
  top: '24px',
  left: '24px',
  zIndex: 10001,
};

const stageStyle = {
  width: 'min(1280px, 100%)',
  aspectRatio: '16 / 9',
  position: 'relative',
  overflow: 'hidden',
  background: '#000',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '8px',
  boxShadow: '0 40px 120px rgba(0, 0, 0, 0.55)',
};

const videoStyle = {
  width: '100%',
  height: '100%',
  display: 'block',
  objectFit: 'contain',
  background: '#000',
};

function VideoPlayer({ project, onClose }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [showVolume, setShowVolume] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume;
    video.muted = false;
    const playPromise = video.play();
    if (playPromise) playPromise.catch(() => setPlaying(false));
  }, [volume]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.body.classList.add('player-open');
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.classList.remove('player-open');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const seek = (event) => {
    const video = videoRef.current;
    const nextTime = Number(event.target.value);
    if (!video) return;
    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const changeVolume = (event) => {
    const nextVolume = Number(event.target.value);
    const video = videoRef.current;
    setVolume(nextVolume);
    if (video) {
      video.volume = nextVolume;
      video.muted = nextVolume === 0;
    }
  };

  return createPortal(h('div', { className: 'video-modal', role: 'dialog', 'aria-modal': true, style: modalStyle },
    h('button', { className: 'video-back', type: 'button', onClick: onClose, 'aria-label': '返回', style: backStyle }, '返回'),
    h('div', { className: 'video-stage', style: stageStyle },
      h('video', {
        ref: videoRef,
        className: 'video-main',
        style: videoStyle,
        src: project.videoSrc,
        autoPlay: true,
        playsInline: true,
        onClick: togglePlay,
        onLoadedMetadata: (event) => setDuration(event.currentTarget.duration || 0),
        onTimeUpdate: (event) => setCurrentTime(event.currentTarget.currentTime || 0),
        onPlay: () => setPlaying(true),
        onPause: () => setPlaying(false),
        onEnded: () => setPlaying(false),
      }),
      h('div', { className: 'video-topbar' },
        h('div', null,
          h('div', { className: 'video-eyebrow' }, 'Now Playing'),
          h('h3', { className: 'video-title' }, project.title)
        )
      ),
      h('div', { className: 'video-controls' },
        h('button', { className: 'video-icon-btn', type: 'button', onClick: togglePlay, 'aria-label': playing ? '暂停' : '播放' }, playing ? '暂停' : '播放'),
        h('div', { className: 'video-timeline' },
          h('span', { className: 'video-time' }, formatTime(currentTime)),
          h('input', {
            className: 'video-progress',
            type: 'range',
            min: 0,
            max: duration || 0,
            step: 0.1,
            value: currentTime,
            onChange: seek,
            'aria-label': '视频进度',
          }),
          h('span', { className: 'video-time' }, formatTime(duration))
        ),
        h('div', { className: 'video-volume' },
          h('button', {
            className: 'video-icon-btn',
            type: 'button',
            onClick: () => setShowVolume(!showVolume),
            'aria-label': '调节音量',
          }, volume === 0 ? '静音' : '音量'),
          showVolume && h('input', {
            className: 'volume-slider',
            type: 'range',
            min: 0,
            max: 1,
            step: 0.01,
            value: volume,
            onChange: changeVolume,
            'aria-label': '音量大小',
          })
        )
      )
    )
  ), document.body);
}

export default function Projects() {
  const ref = useScrollAnimate();
  const scrollRef = useRef(null);
  const trackRef = useRef(null);
  const scrollRaf = useRef(0);
  const scrollPos = useRef(0);
  const [activeProject, setActiveProject] = useState(null);
  const [paused, setPaused] = useState(false);

  const projects = [
    {
      title: '快速周报日报生成器',
      desc: '面向所有职场人的开源日报 / 周报编写助手。每天填写关键字段后，AI 自动生成专业量化日报，支持 3 种风格轮转（专业 / 数据 / 简洁），周五自动汇总本周日报生成周报，彻底告别形式主义重复劳动。',
      tags: ['Python', 'DeepSeek', 'MVP v1.0', 'Open Source'],
      gradient: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      link: 'https://github.com/Dongby329/weekly-report-assistant',
      isLink: true,
      images: [
        './src/assets/weekly-report/1.png',
        './src/assets/weekly-report/2.png',
        './src/assets/weekly-report/3.png',
        './src/assets/weekly-report/4.png',
        './src/assets/weekly-report/5.png',
      ],
    },
    {
      title: 'AIGC 微电影 — 审判日',
      desc: '基于可灵 3.0 生视频模型，全流程参与从创意构思、提示词调试、多轮生成与筛选到后期包装的 AIGC 微电影项目。探索 AI 在影视创作中的边界与可能。',
      tags: ['可灵3.0', 'AIGC', '视频生成', '后期包装'],
      gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      videoSrc: './src/assets/The_Innocence_Day.mp4',
    },
    {
      title: 'C端音乐MV项目 H5板块的制作',
      desc: '担任产品经理，负责 C 端工具类 H5 模块的产品工作。使用 AI 辅助输出 Figma 交互原型与业务流程图，参与 10+ 场技术评审会议；独立输出标准化 PRD 需求文档，梳理业务逻辑与功能边界；通过 AI 制作包含理想交互和各类动画的 HTML 原型，提升开发需求对接的准确性和效率。',
      tags: ['Figma', 'PRD', 'HTML原型', '需求文档'],
      gradient: 'linear-gradient(135deg, #2d1b4e 0%, #1a1a2e 100%)',
      images: [
        './src/assets/mv-h5/mv-h5-01.png',
        './src/assets/mv-h5/mv-h5-02.png',
        './src/assets/mv-h5/mv-h5-03.png',
        './src/assets/mv-h5/mv-h5-04.png',
      ],
    },
  ];

  // JS 驱动无限循环滚动，平滑无跳帧
  useEffect(() => {
    const track = trackRef.current;
    const scroll = scrollRef.current;
    if (!track || !scroll) return;

    const speed = 1.2; // px/frame，60fps

    const animate = () => {
      if (!paused) {
        scrollPos.current -= speed;
        const singleSetWidth = track.scrollWidth / 2;
        if (Math.abs(scrollPos.current) >= singleSetWidth) {
          scrollPos.current += singleSetWidth;
        }
        track.style.transform = `translateX(${scrollPos.current}px)`;
      }
      scrollRaf.current = requestAnimationFrame(animate);
    };

    scrollRaf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(scrollRaf.current);
  }, [paused]);

  const handleCardClick = (p) => {
    if (p.isLink) {
      window.open(p.link, '_blank', 'noopener');
      return;
    }
    if (p.videoSrc) {
      setActiveProject(p);
    }
  };

  return h(React.Fragment, null,
    h('section', { id: 'projects', className: 'sec' },
      h('div', { className: 'sec-in' },
        h('div', { className: 'sec-label' }, 'Portfolio'),
        h('h2', { className: 'sec-title' }, '精选项目'),
        h('div', {
          className: 'proj-scroll a-fu',
          ref: (el) => { ref.current = el; scrollRef.current = el; },
          onMouseEnter: () => setPaused(true),
          onMouseLeave: () => setPaused(false),
        },
          h('div', { className: 'proj-track', ref: trackRef },
            [...projects, ...projects].map((p, i) =>
              h('article', {
                className: p.videoSrc ? 'proj-card proj-card-video' : 'proj-card',
                key: `${p.title}-${i}`,
                style: { animationDelay: `${i * 0.15}s` },
                onClick: () => handleCardClick(p),
                role: 'button',
                tabIndex: 0,
                onKeyDown: (event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleCardClick(p);
                  }
                },
              },
                h('div', {
                  className: p.videoSrc ? 'proj-img proj-video-wrap' : p.images ? 'proj-img proj-gallery-wrap' : 'proj-img',
                  style: { background: p.images ? '#000' : p.gradient }
                }, p.videoSrc
                  ? h(React.Fragment, null,
                    h('video', {
                      className: 'proj-video',
                      src: p.videoSrc,
                      autoPlay: true,
                      muted: true,
                      loop: true,
                      playsInline: true,
                      preload: 'metadata',
                      'aria-label': `${p.title} 静音预览`,
                    }),
                    h('div', { className: 'proj-play-badge' }, '播放')
                  )
                  : p.images
                    ? h('div', { className: p.isLink ? 'proj-gallery-track-weekly' : 'proj-gallery-track' },
                      [...p.images, ...p.images].map((src, imageIndex) =>
                        h('img', {
                          className: p.isLink ? 'proj-gallery-img-weekly' : 'proj-gallery-img',
                          src,
                          alt: `${p.title} 界面展示 ${imageIndex + 1}`,
                          key: `${src}-${imageIndex}`,
                          loading: 'lazy',
                        })
                      )
                    )
                  : h('span', null, p.title)
                ),
                h('div', { className: 'proj-c' },
                  h('h3', { className: 'proj-title' }, p.title),
                  h('p', { className: 'proj-desc' }, p.desc),
                  h('div', { className: 'proj-tags' },
                    p.tags.map(tag => h('span', { className: 'proj-tag', key: tag }, tag))
                  )
                )
              )
            )
          )
        )
      )
    ),
    activeProject && h(VideoPlayer, { project: activeProject, onClose: () => setActiveProject(null) })
  );
}
