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

      <div>
        于是整座山就忘了你 忘了多艳丽 山花终将离去
        漫山遍野那些荒唐里我回头望去山花了无痕迹
      </div>
    </main>
  );
};

export default HomePage;
