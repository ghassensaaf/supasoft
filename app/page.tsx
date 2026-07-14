import React from "react";
import Particles from "./components/particles";
import { Hero } from "./components/hero";
import { LogoMarquee } from "./components/logo-marquee";
import { TechMarquee } from "./components/tech-marquee";
import { FooterCta } from "./components/cta";
import { UpworkScene } from "./components/upwork-scene";
import { ScrollScenes } from "./components/scenes";

export default function Home() {
  return (
    <main className="relative overflow-x-clip">
      {/*
        Persistent backdrop: the gradient and particle field are fixed to
        the viewport, behind the scene stage, so they run uninterrupted
        through every scene transition.
      */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-tl from-black via-zinc-600/20 to-black" />
      <Particles
        className="fixed inset-0 -z-10 animate-fade-in"
        quantity={100}
      />

      {/*
        Scene-based presentation: scrolling scrubs between fullscreen
        scenes cross-fading in place — the page itself never visibly
        scrolls. See scenes.tsx for the mechanics.
      */}
      <ScrollScenes>
        <Hero />
        <LogoMarquee />
        <TechMarquee />
        <UpworkScene />
        <FooterCta />
      </ScrollScenes>
    </main>
  );
}
