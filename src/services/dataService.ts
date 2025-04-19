"use client";

import { Module } from "@/components/modules/ModuleCard";

// Define types for our data structures
export interface LessonMetadata {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  locked: boolean;
  current: boolean;
}

export interface LessonStep {
  type:
    | "intro"
    | "content"
    | "quiz"
    | "interactive"
    | "application"
    | "complete";
  character: string;
  title: string;
  content: string;
  options?: {
    text: string;
    correct?: boolean;
    feedback: string;
  }[];
  interactiveConfig?: any; // Flexible configuration for interactive elements
}

// Data loading functions
export async function getModules(): Promise<Module[]> {
  try {
    const response = await fetch("/data/modules.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch modules: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading modules:", error);
    return [];
  }
}

export async function getLessonsMetadata(): Promise<LessonMetadata[]> {
  try {
    const response = await fetch("/data/lessons-metadata.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch lessons metadata: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading lessons metadata:", error);
    return [];
  }
}

export async function getLessonContent(
  lessonId: string
): Promise<LessonStep[]> {
  try {
    const response = await fetch(`/data/lesson-content/${lessonId}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch lesson content: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading lesson content for ${lessonId}:`, error);
    return [];
  }
}

// Function to save lesson progress to localStorage
export function saveLessonProgress(lessons: LessonMetadata[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("lessonProgress", JSON.stringify(lessons));
  }
}

// Function to load lesson progress from localStorage
export function loadLessonProgress(): LessonMetadata[] | null {
  if (typeof window !== "undefined") {
    const savedProgress = localStorage.getItem("lessonProgress");
    if (savedProgress) {
      try {
        return JSON.parse(savedProgress);
      } catch (e) {
        console.error("Error parsing saved progress:", e);
      }
    }
  }
  return null;
}
