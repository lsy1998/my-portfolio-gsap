"use client";

import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { SplitText } from "gsap/dist/SplitText";
import { useGSAP } from "@gsap/react";

interface ScrollTriggerInstance {
  progress: number;
  direction: number;
  isActive: boolean;
  [key: string]: any;
}

const HomePage = () => {
  const container = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };
  useGSAP(
    () => {
      if (
        !container.current ||
        !audioRef.current ||
        !needleRef.current ||
        !textRef.current
      )
        return;

      // 注册 SplitText 插件
      gsap.registerPlugin(SplitText, ScrollTrigger);

      // 将文本分割成字符
      const splitText = new SplitText(textRef.current, { type: "chars" });
      const chars = splitText.chars;

      // 为每个字符添加初始样式
      gsap.set(chars, {
        opacity: 0,
        scale: 1,
      });

      // 创建字符出现的时间线
      const charsTl = gsap.timeline({
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        },
      });

      // 随机选择一些字符添加发光效果
      const glowChars = chars.filter(() => Math.random() > 0.4);

      // 为所有字符添加基础动画
      charsTl.to(chars, {
        opacity: 1,
        scale: 1,
        duration: 0.1,
        stagger: {
          amount: 2,
          from: "random",
        },
        ease: "back.out(1.7)",
      });

      // 修改发光动画部分的代码
      const updateGlowEffect = () => {
        // 先重置所有字符的样式
        gsap.set(chars, {
          scale: 1,
          color: "inherit",
          textShadow: "none",
        });

        // 重新随机选择字符
        const newGlowChars = chars.filter(() => Math.random() > 0.9);

        // 创建新的发光动画
        gsap.to(newGlowChars, {
          scale: 1.2,
          color: "#ffffff",
          textShadow: "0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 30px #ffffff",
          duration: 1,
          repeat: 1,
          yoyo: true,
          ease: "power1.inOut",
          stagger: {
            amount: 1,
            from: "random",
          },
          onComplete: updateGlowEffect, // 动画完成后递归调用
        });
      };

      // 初始化发光效果
      updateGlowEffect();

      gsap.registerPlugin(ScrollTrigger);

      // 创建共享的ScrollTrigger配置
      const scrollTriggerConfig = {
        trigger: ".vinyl-player",
        start: "top center",
        end: "+=500",
        scrub: 3,
        onUpdate: (self: ScrollTriggerInstance) => {
          const progress = self.progress;
          const vinylDisc = document.querySelector(".vinyl-disc");
          if (vinylDisc) {
            if (progress > 0.5) {
              vinylDisc.classList.add("active");
            } else {
              vinylDisc.classList.remove("active");
            }
          }
        },
      };

      // 创建唱片旋转和缩放的时间轴动画
      const discTimeline = gsap.timeline({
        paused: true,
        repeat: -1,
        defaults: {
          ease: "none",
        },
      });
      const title1Timeline = gsap.timeline({
        scrollTrigger: {
          trigger: "#title-1-container",
          start: "top 80%",
          end: "bottom 100%",
          scrub: 1.5,
          // markers: true,
        },
      });
      // 添加标题动画效果
      title1Timeline.to("#title-1", {
        opacity: 1,
        duration: 1,
        ease: "none",
      });

      // 创建文字动画
      const lyricsTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".lyrics-container",
          start: "top 100%",
          end: "bottom 100%",
          scrub: 1.5,
          // markers: true,
        },
      });

      // 添加文字动画效果，每行依次淡入
      lyricsTimeline
        .to(".line1", {
          opacity: 1,
          duration: 0.5,
          ease: "none",
        })
        .to(".line2", {
          opacity: 1,
          duration: 0.5,
          ease: "none",
        })
        .to(".line3", {
          opacity: 1,
          duration: 0.5,
          ease: "none",
        })
        .to(".line4", {
          opacity: 1,
          duration: 0.5,
          ease: "none",
        })
        .to(".line5", {
          opacity: 1,
          duration: 0.5,
          ease: "none",
        })
        .to(".line6", {
          opacity: 1,
          duration: 0.5,
          ease: "none",
        });

      // 创建唱片滚动时的缩放动画和指针隐藏动画
      const scrollTimeline = gsap.timeline({
        scrollTrigger: scrollTriggerConfig,
      });

      // 添加唱片缩放和指针隐藏的动画
      scrollTimeline
        .to(".vinyl-disc", {
          scale: 2,
          duration: 1,
          ease: "power2.inOut",
        })
        .to(
          ".needle",
          {
            opacity: 0,
            duration: 1,
            ease: "power2.inOut",
          },
          "<"
        ); // "<" 表示与前一个动画同时开始

      // 添加连续旋转动画
      discTimeline.to(".vinyl-disc", {
        rotation: 360,
        duration: 2,
        ease: "linear",
        transformOrigin: "center center",
      });

      // 自我介绍部分的动画
      const introTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".self-introduction",
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
      });

      introTimeline
        .from(".avatar-container", {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power2.out",
        })
        .to(
          ".intro-container",
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.5"
        )
        .to(
          ".timeline-item",
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.2,
            ease: "power2.out",
          },
          "-=0.5"
        ); // 工作经历卡片动画

      // 工作经历时间轴动画
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#work-experience",
            start: "top 80%",
            end: "bottom 20%",
            scrub: 0.5,
            // markers: true,
            pin: false,
            toggleActions: "play reverse play reverse",
          },
        })
        .fromTo(
          ".timeline-item",
          {
            opacity: 0,
            y: 20,
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.2,
            duration: 0.6,
            ease: "power2.out",
          }
        )
        .fromTo(
          ".timeline-item:nth-child(odd) .content",
          {
            opacity: 0,
            x: -50,
          },
          {
            opacity: 1,
            x: 0,
            stagger: 0.2,
            duration: 0.4,
            ease: "back.out(1.7)",
          },
          "<+=0.1"
        )
        .fromTo(
          ".timeline-item:nth-child(even) .content",
          {
            opacity: 0,
            x: 50,
          },
          {
            opacity: 1,
            x: 0,
            stagger: 0.2,
            duration: 0.4,
            ease: "back.out(1.7)",
          },
          "<"
        )
        .fromTo(
          ".year",
          {
            scale: 0.5,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            stagger: 0.1,
            ease: "back.out(2)",
          },
          "<+=0.2"
        );

      // 技能标签动画
      gsap.fromTo(
        ".skill-badge",
        {
          scale: 0,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.4,
          stagger: 0.05,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: ".skills",
            start: "top 90%",
            end: "bottom 60%",
            toggleActions: "play reverse play reverse",
            scrub: true,
          },
        }
      );

      // 监听播放状态变化
      const updateAnimation = (playing: boolean) => {
        if (playing) {
          discTimeline.play();
        } else {
          discTimeline.pause();
        }
      };

      updateAnimation(isPlaying); // 人生时间线动画
      const timelineAnimation = gsap.timeline({
        scrollTrigger: {
          trigger: "#life-timeline",
          start: "top center",
          end: "bottom center",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 设置小人初始位置和里程碑初始状态
      gsap.set(".timeline-walker", {
        xPercent: -100, // 从左边开始
      });

      gsap.set(".milestone", {
        opacity: 0,
        scale: 0.8,
      });

      // 创建动画序列
      const milestonePositions = ["20%", "40%", "60%", "80%"];

      // 小人移动动画
      timelineAnimation.to(".timeline-walker", {
        x: "90vw", // 移动到右边
        ease: "none",
        duration: 1,
      });

      // 里程碑出现动画
      milestonePositions.forEach((position, index) => {
        timelineAnimation.to(
          `.milestone:nth-child(${index + 1})`,
          {
            opacity: 1,
            scale: 1,
            duration: 0.2,
            ease: "back.out(1.7)",
          },
          `<+=${0.25}` // 每个里程碑在前一个出现后0.25的时间出现
        );
      });

      return () => {
        if (scrollTimeline.scrollTrigger) {
          scrollTimeline.scrollTrigger.kill();
        }
      };
    },
    { scope: container, dependencies: [isPlaying] }
  );

  return (
    <main className="home" ref={container}>
      <div id="self-introduction" className="self-introduction">
        <div className="intro-container">
          <div className="avatar-section">
            <div className="avatar-container">
              <div className="avatar-frame">
                <img
                  src="/images/avatar.jpg"
                  alt="Jackson's avatar"
                  className="avatar-image"
                />
              </div>
              <div className="avatar-decoration"></div>
            </div>
          </div>
          <div>
            <h2 className="intro-title">
              你好，我是<span className="highlight">Jackson</span>
            </h2>
            <p className="intro-text">一个充满激情的全栈开发者</p>
            <div className="skills-container">
              <div className="skill-tag">React</div>
              <div className="skill-tag">Next.js</div>
              <div className="skill-tag">TypeScript</div>
              <div className="skill-tag">Node.js</div>
              <div className="skill-tag">GSAP</div>
            </div>
            <p className="intro-description">
              我热爱创造美好的用户体验和解决复杂的技术问题。
              通过不断学习和实践，我致力于构建优雅且高性能的web应用。
            </p>
            <div className="social-links">
              <a href="#" className="social-link github">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a href="#" className="social-link linkedin">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="h-screen" id="special-part">
        <div className="header title-container" id="title-1-container">
          <h1 className="title" id="title-1">
            没有永远的年轻，没有唱不完的歌
          </h1>
        </div>

        <div className="vinyl-player">
          <div className="needle" ref={needleRef}>
            <img src="/images/needle.svg" alt="Needle" />
          </div>{" "}
          <div className="vinyl-disc" onClick={togglePlay}>
            <div className="vinyl-grooves"></div>
            <div className="vinyl-reflection"></div>
            <img src="/images/vinyl.svg" alt="Vinyl" className="disc-image" />
          </div>
          <audio ref={audioRef} loop>
            <source src="/audio/renyuren.m4a" type="audio/mp4" />
          </audio>
        </div>

        <div className="lyrics-container">
          <div className="lyrics-line line1">于是整座山就忘了你</div>
          <div className="lyrics-line line2">忘了多艳丽</div>
          <div className="lyrics-line line3">山花终将离去</div>
          <div className="lyrics-line line4">漫山遍野那些荒唐里</div>
          <div className="lyrics-line line5">我回头望去</div>
          <div className="lyrics-line line6">山花了无痕迹</div>
        </div>
      </div>
      <div id="work-experience" className="work-experience h-screen">
        <div className="intro-right">
          <div className="experience-card">
            <div className="timeline">
              <div className="timeline-item">
                <div className="year">2023</div>
                <div className="content">
                  <h4>高级全栈开发工程师</h4>
                  <p>
                    负责企业级应用的架构设计与开发，带领团队完成多个重要项目
                    的交付
                  </p>
                  <div className="skills">
                    <span className="skill-badge">React</span>
                    <span className="skill-badge">Node.js</span>
                    <span className="skill-badge">TypeScript</span>
                    <span className="skill-badge">微服务</span>
                  </div>
                </div>
              </div>
              <div className="timeline-item">
                <div className="year">2022</div>
                <div className="content">
                  <h4>全栈开发工程师</h4>
                  <p>专注于高性能Web应用开发，优化系统架构，提升用户体验</p>
                  <div className="skills">
                    <span className="skill-badge">Next.js</span>
                    <span className="skill-badge">GraphQL</span>
                    <span className="skill-badge">MongoDB</span>
                  </div>
                </div>
              </div>
              <div className="timeline-item">
                <div className="year">2021</div>
                <div className="content">
                  <h4>前端开发工程师</h4>
                  <p>
                    负责企业官网和管理系统的前端开发，实现响应式设计和动画效果
                  </p>
                  <div className="skills">
                    <span className="skill-badge">Vue.js</span>
                    <span className="skill-badge">SCSS</span>
                    <span className="skill-badge">Webpack</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        id="special-part-1"
        className="special-part-1 h-screen overflow-hidden relative"
      >
        <div className="character-background" ref={textRef}>
          于是整座山就忘了忘了多山花将去漫山遍野那些荒唐里我回望去山花了无痕迹于是整座山就忘了忘了多山花将去漫山遍野那些荒唐里我回望去山花了无痕迹于是整座山就忘了忘了多山花将去漫山遍野那些荒唐里我回望去山花了无痕迹于是整座山就忘了忘了多山花将去漫山遍野那些荒唐里我回望去山花了无痕迹于是整座山就忘了忘了多山花将去漫山遍野那些荒唐里我回望去山花了无痕迹于是整座山就忘了忘了多山花将去漫山遍野那些荒唐里我回望去山花了无痕迹于是整座山就忘了忘了多山花将去漫山遍野那些荒唐里我回望去山花了无痕迹于是整座山就忘了忘了多山花将去漫山遍野那些荒唐里我回望去山花了无痕迹
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      <div id="life-timeline" className="h-screen relative">
        <div className="timeline-wrapper relative w-full px-10">
          {/* 时间线基础线 */}
          <div className="timeline-base absolute h-1 bg-gradient-to-r from-gray-500 via-white to-gray-500 w-full top-1/2 transform -translate-y-1/2"></div>

          {/* 行走的小人 */}
          <div
            className="timeline-walker absolute top-1/2 transform -translate-y-1/2"
            style={{ filter: "drop-shadow(0 0 8px rgba(59, 130, 246, 0.5))" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="#2563EB">
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
            </svg>
          </div>

          {/* 时间线节点 */}
          <div className="timeline-milestones absolute w-full h-full top-0 left-0">
            <div className="milestone absolute left-[20%] top-1/2 transform -translate-y-full opacity-0">
              <div className="milestone-dot w-4 h-4 bg-blue-500 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 shadow-lg"></div>
              <div className="milestone-content p-6 rounded-xl shadow-xl mb-4 max-w-xs transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-xl font-bold text-white mb-2">2010年</h3>
                <p className="text-gray-600">开始接触编程，发现了编程的乐趣</p>
              </div>
            </div>

            <div className="milestone absolute left-[40%] top-1/2 transform translate-y-8 opacity-0">
              <div className="milestone-dot w-4 h-4 bg-blue-500 rounded-full absolute -top-9 left-1/2 transform -translate-x-1/2 -translate-y-1 shadow-lg"></div>
              <div className="milestone-content p-6 rounded-xl shadow-xl mt-4 max-w-xs transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-xl font-bold text-white mb-2">2015年</h3>
                <p className="text-gray-600">
                  大学毕业，进入互联网公司，开启职业生涯
                </p>
              </div>
            </div>

            <div className="milestone absolute left-[60%] top-1/2 transform -translate-y-full opacity-0">
              <div className="milestone-dot w-4 h-4 bg-blue-500 rounded-full absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 shadow-lg"></div>
              <div className="milestone-content  p-6 rounded-xl shadow-xl mb-4 max-w-xs transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-xl font-bold text-white mb-2">2020年</h3>
                <p className="text-gray-600">
                  成为全栈开发工程师，技术能力全面提升
                </p>
              </div>
            </div>

            <div className="milestone absolute left-[80%] top-1/2 transform translate-y-8 opacity-0">
              <div className="milestone-dot w-4 h-4 bg-blue-500 rounded-full absolute -top-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
              <div className="milestone-content  p-6 rounded-xl shadow-xl mt-4 max-w-xs transform hover:scale-105 transition-transform duration-300">
                <h3 className="text-xl font-bold text-white mb-2">2025年</h3>
                <p className="text-gray-600">
                  开始独立创业之路，追寻更大的梦想
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
