import Link from "next/link";
import { Megaphone } from "lucide-react";

import { cn, nFormatter } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { AnimatedShinyText } from "../magicui/animated-shiny-text";
import { Icons } from "@/components/shared/icons";

export async function HeroLanding() {
  return (
    <section className="space-y-6 py-12 sm:py-20 lg:py-20">
      <div className="container flex max-w-5xl flex-col items-center gap-5 text-center">
        <Link
          href="/support"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm", rounded: "full" }),
            "animate-fade-up opacity-0",
          )}
          style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
          target="_blank"
        >
          <AnimatedShinyText className="flex flex-row items-center">
            <Megaphone className="mr-2" /> Join our Discord Server
          </AnimatedShinyText>
        </Link>

        <h1
          className={cn(
            "animate-fade-up select-none text-balance font-urban text-4xl font-extrabold tracking-tight opacity-0 sm:text-5xl md:text-6xl lg:text-7xl",
            // only makes Sentinel shine.. lol?
            "relative before:absolute before:left-0 before:top-0 before:w-full before:animate-[shine_2s_ease-in-out] before:bg-shine before:bg-[length:200%] before:bg-clip-text before:text-transparent before:content-['Protect_your_server_with_Sentinel']",
          )}
          style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
        >
          Protect your server with{" "}
          <span className="text-gradient_indigo-purple underlined relative font-extrabold">
            Sentinel
          </span>
        </h1>

        <p
          className="max-w-2xl animate-fade-up text-balance leading-normal text-muted-foreground opacity-0 sm:text-xl sm:leading-8"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          Sentinel is a bot that uses modern technology and privacy-independent
          algorithms to protect your server.
        </p>

        <div
          className="flex animate-fade-up justify-center space-x-2 opacity-0 md:space-x-4"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <Link
            href="/pricing"
            prefetch={true}
            className={cn(
              buttonVariants({ size: "lg", rounded: "full" }),
              "gap-2",
            )}
          >
            <Icons.sparkles className="mr-2 size-4" />
            <span>Subscribe</span>
          </Link>
          <Link
            href="/docs"
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
                rounded: "full",
              }),
              "px-5",
            )}
          >
            <Icons.book className="size-4 sm:mr-2" />
            <span className="hidden sm:inline-block">Documentation</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
