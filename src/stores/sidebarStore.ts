import { create } from 'zustand';
import apiClient from '../services/apiClient';

interface Video {
  id: string;
  title: string;
  completed: boolean;
}

interface Section {
  id: string;
  title: string;
  videos?: Video[];
  subsections?: Section[];
}

interface Tree {
  id: string;
  title: string;
  subjectName?: string;
  sections?: Section[];
}

interface SidebarState {
  tree: Tree | null;
  loading: boolean;
  error: string | null;
  fetchTree: (subjectId: string) => Promise<void>;
  markVideoCompleted: (videoId: string) => void;
  resetTree: () => void;
}

export const sidebarStore = create<SidebarState>((set, get) => ({
  tree: null,
  loading: false,
  error: null,

  fetchTree: async (subjectId: string) => {
    set({ loading: true, error: null });
    try {
      const response = await apiClient.get(`/api/subjects/${subjectId}/tree`);
      set({ tree: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  markVideoCompleted: (videoId: string) => {
    const { tree } = get();
    if (!tree) return;

    // Deep clone the tree
    const updatedTree = JSON.parse(JSON.stringify(tree));

    // Find and mark the video as completed in sections
    const markInSections = (sections: Section[]) => {
      for (const section of sections) {
        if (section.videos) {
          const videoIndex = section.videos.findIndex((v) => v.id === videoId);
          if (videoIndex !== -1) {
            section.videos[videoIndex].completed = true;
            return true;
          }
        }
        if (section.subsections) {
          if (markInSections(section.subsections)) return true;
        }
      }
      return false;
    };

    markInSections(updatedTree.sections || []);
    set({ tree: updatedTree });
  },

  resetTree: () => {
    set({ tree: null, loading: false, error: null });
  },
}));
