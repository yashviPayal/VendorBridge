import React from "react";
import { ContainerScroll } from "./container-scroll-animation";

export function HeroScrollDemo() {
  return (
    <div className="flex flex-col overflow-hidden pb-12 pt-6 w-full max-w-7xl mx-auto">
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight">
              Unleash the Power of <br />
              <span className="text-4xl md:text-[5.5rem] font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-none mt-2">
                Automated Procurement
              </span>
            </h1>
          </div>
        }
      >
        <img
          src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
          alt="Procurement Dashboard Screenshot"
          className="mx-auto rounded-2xl object-cover h-full object-center w-full select-none"
          draggable={false}
        />
      </ContainerScroll>
    </div>
  );
}
