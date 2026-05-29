"use client";

import type { Ref } from "react";
import { ScrollReveal } from "@/shared/presentation/ui/scroll-reveal";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  title?: string;
  lead?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
  leadClassName?: string;
  center?: boolean;
  bg?: React.ReactNode;
  noPadding?: boolean;
  sectionRef?: Ref<HTMLElement>;
};

export default function Section({
  id,
  title,
  lead,
  children,
  className,
  contentClassName,
  titleClassName,
  leadClassName,
  center = false,
  bg,
  noPadding = false,
  sectionRef,
}: Props) {
  return (
    <section
      id={id}
      ref={sectionRef}
      className={cn("app-section", noPadding && "pt-0 pb-0 md:pt-0", className)}
    >
      {bg ? <div className="absolute inset-0 -z-10">{bg}</div> : null}

      <div
        className={cn(
          "app-container",
          center && "flex flex-col justify-center",
          contentClassName,
        )}
      >
        {title && (
          <ScrollReveal>
            <h2 className={cn("app-section-title", titleClassName)}>{title}</h2>
          </ScrollReveal>
        )}

        {lead != null && (
          <ScrollReveal delay={0.1}>
            <p className={cn("app-section-lead", leadClassName)}>{lead}</p>
          </ScrollReveal>
        )}

        <ScrollReveal delay={0.2}>{children}</ScrollReveal>
      </div>
    </section>
  );
}
