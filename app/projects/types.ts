import {
    IconBrandAndroid,
    IconBrandApple,
    IconBrandCss3,
    IconBrandDebian,
    IconBrandDocker,
    IconBrandGolang,
    IconBrandHtml5,
    IconBrandJavascript,
    IconBrandNextjs,
    IconBrandPython,
    IconBrandReact,
    IconBrandSvelte,
    IconBrandTailwind,
    IconBrandTypescript,
    IconBrandWindows, IconCoffee,
    IconDeviceGamepad2,
    IconExclamationCircle,
    IconMarkdown,
    IconWorldWww
} from "@tabler/icons-react";
import React from "react";

export type Project = {
    name: string;
    description: string;
    link: string;
    tech: Tech[];
}

export type Tech = "js" | "ts" | "react" | "svelte" | "sveltekit"
    | "next" | "tauri" | "html" | "css" | "mdx" | "tailwind" | "golang" | "java"
    | "python" | "docker" | "linux" | "windows" | "mac" | "android"
    | "markdown" | "game" | "web"
;

export const techNameMap: Record<Tech, string> = {
    js: "JavaScript",
    ts: "TypeScript",
    react: "React",
    svelte: "Svelte",
    sveltekit: "SvelteKit",
    next: "Next.js",
    tauri: "Tauri",
    html: "HTML",
    css: "CSS",
    mdx: "MDX",
    tailwind: "Tailwind CSS",
    golang: "Go",
    java: "Java",
    python: "Python",
    docker: "Docker",
    linux: "Linux",
    windows: "Windows",
    mac: "macOS",
    android: "Android",
    markdown: "Markdown",
    game: "Game Development",
    web: "Web Development",
}

type Icon = React.ForwardRefExoticComponent<any>

const NoIconAvailable = IconExclamationCircle

export const techIconMap: Record<Tech, Icon> = {
    js: IconBrandJavascript,
    ts: IconBrandTypescript,
    react: IconBrandReact,
    svelte: IconBrandSvelte,
    sveltekit: IconBrandSvelte,
    next: IconBrandNextjs,
    tauri: NoIconAvailable,
    html: IconBrandHtml5,
    css: IconBrandCss3,
    mdx: NoIconAvailable,
    tailwind: IconBrandTailwind,
    golang: IconBrandGolang,
    java: IconCoffee,
    python: IconBrandPython,
    docker: IconBrandDocker,
    linux: IconBrandDebian,
    windows: IconBrandWindows,
    mac: IconBrandApple,
    android: IconBrandAndroid,
    markdown: IconMarkdown,
    game: IconDeviceGamepad2,
    web: IconWorldWww,
}

export const fetchTech = (tech: Tech) => (
    {
        name: techNameMap[tech],
        icon: techIconMap[tech],
    }
)
