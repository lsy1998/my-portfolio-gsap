"use client";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Environment, OrbitControls, useGLTF, Grid } from "@react-three/drei";
import { Suspense } from "react";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function Computer(props) {
  let myModel = useRef();
  const gltf = useLoader(GLTFLoader, 'models/cute_desktop_animated_model_gltf/scene.gltf')
  const mixer = useRef();
  const action = useRef();

  useEffect(() => {
    if (gltf.animations.length) {
      mixer.current = new THREE.AnimationMixer(gltf.scene);
      action.current = mixer.current.clipAction(gltf.animations[0]);

      // 设置动画参数
      action.current.clampWhenFinished = true; // 完成时保持在最后一帧
      // action.current.setLoop(THREE.LoopOnce); // 只播放一次
      action.current.play(); // 初始播放

    }
  }, [gltf]);

  useFrame((state, delta) => {
    // 只在需要时更新混合器
    if (mixer.current && !action.current?.paused) {
      mixer.current.update(delta);
    }
  });

  return <primitive object={gltf.scene} ref={myModel} {...props} />
}

useGLTF.preload('models/cute_desktop_animated_model_gltf/scene.gltf')
const Model = () => {
  return (<div className="h-2/3 w-screen ">
    <Canvas>
      <Suspense fallback={null}>
        <OrbitControls enableZoom={false} />
        <Computer scale={4} position={[0, -1, 0]} />
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
      </Suspense>
    </Canvas>
  </div>);
};
export default Model;
