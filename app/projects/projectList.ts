import {Project} from "@/app/projects/types";

export const projects: Project[] = [
    {
        name: "Free Mind",
        description: "A Tauri-based note-taking app built with SvelteKit and MDX which runs on Linux, Windows, and macOS",
        link: "https://github.com/tanayseven/free-mind",
        tech: ["ts", "tauri", "svelte", "sveltekit", "mdx", "linux", "windows", "mac"],
    },
    {
        name: "Blog Platform",
        description: "A blog platform powered by React, Tailwind CSS, and Markdown",
        link: "https://blog.tanay.tech",
        tech: ["react", "tailwind", "mdx", "markdown"],
    },
    {
        name: "Left Unlocked",
        description: "Website for pranking your colleagues who leave their computer unlocked",
        link: "https://leftunlocked.tanay.tech",
        tech: ["html", "css", "js"],
    },
    {
        name: "Pong - Ebitengine",
        description: "Basic Pong game built with Ebiten game engine in Go",
        link: "https://tanayseven.itch.io/pong-ebitengine",
        tech: ["golang", "game"],
    },
    {
        name: "Breakout - Ebitengine",
        description: "Basic Breakout game built with Ebiten game engine in Go",
        link: "https://tanayseven.itch.io/breakout-ebitengine",
        tech: ["golang", "game"],
    },
    {
        name: "Wordle Solver Bot",
        description: "A bot that solves Wordle puzzles using Python",
        link: "https://www.youtube.com/watch?v=gvoLCMiBv8o",
        tech: ["python"],
    },
    {
        name: "J Tank Wars",
        description: "Battle City clone built with Java",
        link: "https://github.com/tanayseven/j-tank-wars",
        tech: ["java", "game"],
    },
    {
        name: "Techyon 2013",
        description: "A website made for Techyon 2013, the annual tech fest of my college",
        link: "https://tanay.tech/techyon2013/",
        tech: ["web", "css", "html", "js"]
    },
];