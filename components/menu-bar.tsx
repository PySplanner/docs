'use client';

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DiscordSVG, GithubSVG } from "@/components/media-icons";
import { Separator } from "@/components/ui/separator";

interface MenuBarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export function MenuBar({ currentTab, onTabChange }: MenuBarProps) {
  return (
    <div className="sticky top-0 z-50 w-full h-16 border-b flex items-center justify-between px-6 bg-background/75 shrink-0 backdrop-blur-md">
        <div className="flex flex-1 items-center gap-3 font-bold text-lg">
            <img src="./logo.svg" alt="PySplanner Logo" width={40} height={40} className="rounded-md" />
            <span className="text-primary">PySplanner</span>
        </div>

      <Tabs value={currentTab} onValueChange={onTabChange}>
        <TabsList variant="line">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="visualizer">Visualizer</TabsTrigger>
            <TabsTrigger value="docs">Docs</TabsTrigger>
        </TabsList>
        </Tabs>

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