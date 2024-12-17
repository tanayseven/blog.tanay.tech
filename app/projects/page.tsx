import React from "react";
import {fetchTech} from "@/app/projects/types";
import {projects} from "@/app/projects/projectList";

export default function Projects() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="font-bold text-4xl text-center mb-6 text-gray-800">Projects</h1>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                I have worked on several software projects ranging from web applications to desktop tools. Here are some of the highlights.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                {projects.map((project, index) => (
                    <div
                        key={index}
                        className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">{project.name}</h2>
                            <p className="text-gray-600 mb-4">{project.description}</p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.tech.map((tech, i) => {
                                    const {name, icon: Icon} = fetchTech(tech);
                                    return (
                                        <span
                                            key={i}
                                            className="text-sm text-gray-800 bg-gray-100 px-2 py-1 rounded"
                                        >
                                            <Icon className="inline-block w-4 h-4 mb-0.5 mr-0.5" />
                                            {name}
                                        </span>
                                    );
                                })}
                            </div>
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block text-blue-600 font-medium hover:underline"
                            >
                                View Project →
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
