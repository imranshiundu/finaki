"use client";

import SvgSprite from "@/components/SvgSprite";
import Loader from "@/components/Loader";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import Manifesto from "@/components/Manifesto";
import Why from "@/components/Why";
import Work from "@/components/Work";
import Agents from "@/components/Agents";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  return (
    <>
      <SvgSprite />
      <Loader />
      <Nav />

      <div className="torch" id="torch" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="progress" id="progress" aria-hidden="true" />

      <main id="top">
        <Hero />
        <Marquee />
        <Services />
        <Manifesto />
        <Why />
        <Work />
        <Agents />
        <Contact />
      </main>

      <Footer />
      <CustomCursor />
    </>
  );
}
