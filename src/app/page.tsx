"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";

const HomePage = () => {
  const container = useRef<HTMLElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);
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
      if (!container.current || !audioRef.current || !needleRef.current) return;

      gsap.registerPlugin(ScrollTrigger);

      // 创建共享的ScrollTrigger配置
      const scrollTriggerConfig = {
        trigger: ".vinyl-player",
        start: "top center",
        end: "+=500",
        scrub: 3,
        onUpdate: (self) => {
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

      // 创建文字动画
      const lyricsTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".lyrics-container",
          start: "top 80%",
          end: "bottom 80%",
          scrub: 1.5,
          markers: true,
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
        .to(".intro-container", {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
        }, "-=0.5")
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
        );

      // 技能标签的悬停动画
      const skillTags = document.querySelectorAll('.skill-tag');
      skillTags.forEach((tag) => {
        tag.addEventListener('mouseenter', () => {
          gsap.to(tag, {
            scale: 1.1,
            duration: 0.3,
            ease: "power2.out"
          });
        });
        tag.addEventListener('mouseleave', () => {
          gsap.to(tag, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });

      // 监听播放状态变化
      const updateAnimation = (playing: boolean) => {
        if (playing) {
          discTimeline.play();
        } else {
          discTimeline.pause();
        }
      };

      updateAnimation(isPlaying);

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
      <div className="header">
        <h1 className="title">没有永远的年轻，没有唱不完的歌</h1>
        <p>
          Simple example for setting up GSAP ScrollSmoother in a NextJS App
          using the{" "}
          <strong>
            <i>App</i>
          </strong>{" "}
          Router
        </p>
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
        {/* <button
          onClick={togglePlay}
          className="play-button"
          aria-label={isPlaying ? "暂停" : "播放"}
        >
          {isPlaying ? "暂停" : "播放"}
        </button> */}
      </div>

      <div className="lyrics-container">
        <div className="lyrics-line line1">于是整座山就忘了你</div>
        <div className="lyrics-line line2">忘了多艳丽</div>

        <div className="lyrics-line line3">山花终将离去</div>

        <div className="lyrics-line line4">漫山遍野那些荒唐里</div>

        <div className="lyrics-line line5">我回头望去</div>

        <div className="lyrics-line line6">山花了无痕迹</div>
      </div>
      <div id="self-introduction" className="self-introduction">
        <div className="intro-container">
          <div className="intro-left">
            <div className="avatar-section">
              <div className="avatar-container">
                <div className="avatar-frame">
                  <img src="/images/avatar.jpg" alt="Jackson's avatar" className="avatar-image" />
                </div>
                <div className="avatar-decoration"></div>
              </div>
            </div>
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
          <div className="intro-right">
            <div className="experience-card">
              <h3>工作经历</h3>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="year">2023</div>
                  <div className="content">
                    <h4>全栈开发工程师</h4>
                    <p>负责企业级应用开发和优化</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="year">2021</div>
                  <div className="content">
                    <h4>前端开发工程师</h4>
                    <p>专注于用户界面和交互体验的开发</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
