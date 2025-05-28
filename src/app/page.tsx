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

      // 创建唱片旋转的时间轴动画
      const discTimeline = gsap.timeline({
        paused: true,
        repeat: -1,
        defaults: {
          ease: "none",
        },
      });

      // 添加连续旋转动画
      discTimeline.to(".vinyl-disc", {
        rotation: 360,
        duration: 2,
        ease: "linear",
        transformOrigin: "center center",
      }); // 创建唱针的滚动动画
      const needleTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: ".vinyl-player",
          start: "top center",
          end: "+=500", // 增加滚动距离，使动画更平缓
          markers: true,
          scrub: 3, // 增加平滑度，数值越大越平滑
          anticipatePin: 1, // 提前加载以确保平滑
          onUpdate: (self) => {
            // 根据滚动进度添加active类
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
        },
      });

      // 添加唱针的精细动画
      needleTimeline.fromTo(
        needleRef.current,
        {
          rotation: -30,
          transformOrigin: "20% 20%",
        },
        {
          rotation: 0,
          transformOrigin: "20% 20%",
          duration: 1,
          ease: "power2.inOut", // 使用更平滑的缓动效果
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

      updateAnimation(isPlaying);

      return () => {
        if (needleTimeline.scrollTrigger) {
          needleTimeline.scrollTrigger.kill();
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

      <div className="line"></div>
    </main>
  );
};

export default HomePage;
