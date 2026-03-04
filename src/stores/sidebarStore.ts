import { create } from 'zustand';
// import apiClient from '../services/apiClient';

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
      // TODO: Replace with actual API call when backend is available
      // const response = await apiClient.get(`/subjects/${subjectId}/tree`);
      // set({ tree: response.data, loading: false });
      
      // Mock tree data for demonstration (remove when backend is connected)
      const mockTree = {
        id: subjectId,
        title: 'Sample Subject',
        sections: [
          {
            id: '1',
            title: 'Introduction',
            videos: [
              { id: '1', title: 'Welcome Video', completed: false },
              { id: '2', title: 'Getting Started', completed: false },
            ],
          },
          {
            id: '2',
            title: 'Advanced Topics',
            videos: [
              { id: '3', title: 'Deep Dive', completed: false },
              { id: '4', title: 'Best Practices', completed: false },
            ],
          },
        ],
      };
      
      set({ tree: mockTree, loading: false });
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
