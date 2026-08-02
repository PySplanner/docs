'use client';

import { useRouter, usePathname } from 'next/navigation';

import { DiscordSVG, GithubSVG } from "@/components/media-icons";
import { Separator } from "@/components/ui/separator";

export function DocsMenuBar() {
  const router = useRouter();

  return (
    <div className="sticky top-0 z-50 w-full h-16 border-b flex items-center justify-between px-6 bg-background/75 shrink-0 backdrop-blur-md">
        <div className="flex flex-1 items-center font-bold text-lg">
            <div onClick={() => (router.push("/"))} className="flex items-center gap-2 cursor-pointer">
              <img src="./logo.svg" alt="PySplanner Logo" width={40} height={40} className="rounded-md" />
              <span className="text-primary">PySplanner</span>
            </div>
        </div>

      <div className="flex flex-1 items-center justify-end">
        {/* <ThemeSwitch /> (Will add back later, too hard to maintain right now) */}
        <Separator orientation="vertical" className="h-8" />
        <div className="flex ml-4 gap-4">
          <a href="https://discord.gg/peMVWcuzdJ" target="_blank" rel="noopener noreferrer"><DiscordSVG /></a>
          <a href="https://github.com/pysplanner" target="_blank" rel="noopener noreferrer"><GithubSVG /></a>
        </div>
      </div>
    </div>
  );
}