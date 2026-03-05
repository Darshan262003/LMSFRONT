import { create } from 'zustand';

export const videoStore = create((set) => ({
  currentVideoId: null,
  subjectId: null,
  currentTime: 0,
  duration: 0,
  isPlaying: false,
  isCompleted: false,
  nextVideoId: null,
  prevVideoId: null,

  setCurrentVideoId: (videoId) => set({ currentVideoId: videoId }),
  setSubjectId: (subjectId) => set({ subjectId }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  setIsCompleted: (isCompleted) => set({ isCompleted }),
  setNextVideoId: (nextVideoId) => set({ nextVideoId }),
  setPrevVideoId: (prevVideoId) => set({ prevVideoId }),

  resetVideoState: () =>
    set({
      currentVideoId: null,
      currentTime: 0,
      duration: 0,
      isPlaying: false,
      isCompleted: false,
      nextVideoId: null,
      prevVideoId: null,
    }),
}));
