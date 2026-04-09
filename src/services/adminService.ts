/**
 * Admin Service: Simulated Data Layer
 * 
 * Provides mock CRUD operations for projects, skills, blogs, and comms.
 * Uses localStorage for local session persistence to simulate a persistent database.
 */

import { projects as initialProjects, blogEntries as initialBlogs, skills as initialSkills, Project, BlogEntry, SkillPanel } from "@/constants/siteData";

const STORAGE_KEYS = {
  PROJECTS: "neo_tokyo_projects",
  BLOGS: "neo_tokyo_blogs",
  SKILLS: "neo_tokyo_skills",
  COMMS: "neo_tokyo_comms",
};

// Initial Comms Mock
const initialComms = [
  { id: "cm-01", type: "UPLINK", name: "Elon Musk", purpose: "Startup_Collab", message: "Love the terminal look. Let's talk X integration.", timestamp: new Date().toISOString() },
  { id: "cm-02", type: "TOPIC", name: "Quant Intern", purpose: "General_Inquiry", message: "How do you handle memory fragments in your order engine?", timestamp: new Date().toISOString() },
];

export const adminService = {
  // ── PROJECTS ──
  getProjects: (): Project[] => {
    if (typeof window === "undefined") return initialProjects;
    const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(initialProjects));
      return initialProjects;
    }
    return JSON.parse(stored);
  },

  updateProject: (updated: Project) => {
    const list = adminService.getProjects();
    const newList = list.map(p => p.slug === updated.slug ? updated : p);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(newList));
    return newList;
  },

  addProject: (project: Project) => {
    const list = adminService.getProjects();
    const newList = [project, ...list];
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(newList));
    return newList;
  },

  deleteProject: (slug: string) => {
    const list = adminService.getProjects();
    const newList = list.filter(p => p.slug !== slug);
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(newList));
    return newList;
  },

  // ── SKILLS ──
  getSkills: (): SkillPanel[] => {
    if (typeof window === "undefined") return initialSkills;
    const stored = localStorage.getItem(STORAGE_KEYS.SKILLS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(initialSkills));
      return initialSkills;
    }
    return JSON.parse(stored);
  },

  updateSkillPanel: (panel: SkillPanel, index: number) => {
    const list = adminService.getSkills();
    list[index] = panel;
    localStorage.setItem(STORAGE_KEYS.SKILLS, JSON.stringify(list));
    return list;
  },

  // ── BLOG LOGS ──
  getBlogs: (): BlogEntry[] => {
    if (typeof window === "undefined") return initialBlogs;
    const stored = localStorage.getItem(STORAGE_KEYS.BLOGS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(initialBlogs));
      return initialBlogs;
    }
    return JSON.parse(stored);
  },

  updateBlog: (updated: BlogEntry) => {
    const list = adminService.getBlogs();
    const newList = list.map(b => b.id === updated.id ? updated : b);
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(newList));
    return newList;
  },

  addBlog: (blog: BlogEntry) => {
    const list = adminService.getBlogs();
    const newList = [blog, ...list];
    localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(newList));
    return newList;
  },

  // ── INCOMING COMMS ──
  getComms: () => {
    if (typeof window === "undefined") return initialComms;
    const stored = localStorage.getItem(STORAGE_KEYS.COMMS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEYS.COMMS, JSON.stringify(initialComms));
      return initialComms;
    }
    return JSON.parse(stored);
  }
};
