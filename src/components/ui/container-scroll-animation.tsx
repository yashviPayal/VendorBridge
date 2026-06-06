import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const card = cardRef.current;
    const header = headerRef.current;

    if (!container || !card || !header) return;

    // Set initial 3D transform properties
    gsap.set(card, {
      transformPerspective: 1000,
      rotateX: 20,
      scale: isMobile ? 0.8 : 1.05,
      y: 0,
    });

    // Create GSAP ScrollTrigger timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top bottom", // trigger when top of section hits bottom of screen
        end: "bottom top",   // end when bottom of section hits top of screen
        scrub: 1,            // smooth delay catch-up (silky smooth scroll!)
      },
    });

    tl.to(header, {
      y: -100,
      ease: "none",
    }, 0)
    .to(card, {
      rotateX: 0,
      scale: 1, // Settle to standard scale
      y: -50,
      ease: "none",
    }, 0);

    return () => {
      // Clean up ScrollTrigger instances on unmount
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [isMobile]);

  return (
    <div
      className="h-[36rem] sm:h-[55rem] md:h-[80rem] flex flex-col items-center justify-center relative p-2 sm:p-10 md:p-20 overflow-hidden w-full"
      ref={containerRef}
    >
      <div
        className="py-6 sm:py-20 md:py-40 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <div ref={headerRef} className="max-w-5xl mx-auto text-center">
          {titleComponent}
        </div>
        
        <div
          ref={cardRef}
          style={{
            boxShadow:
              "0 10px 50px -12px rgba(0, 0, 0, 0.08), 0 30px 100px -30px rgba(37, 99, 235, 0.12)",
          }}
          className="max-w-5xl -mt-6 sm:-mt-12 mx-auto h-[16rem] sm:h-[28rem] md:h-[40rem] w-full border-4 border-slate-200/90 p-1 md:p-6 bg-slate-50/80 rounded-2xl md:rounded-[30px]"
        >
          <div className="h-full w-full overflow-hidden rounded-xl md:rounded-2xl bg-white md:p-4 border border-slate-100">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
