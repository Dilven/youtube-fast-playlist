import create from "zustand";

type State = {
  selectedTrackNumber?: number;
  selectedTrack?: string;
  setSelectedTrack: (
    selectedTrack?: string,
    selectedTrackNumber?: number
  ) => void;
};

export const useStore = create<State>((set) => ({
  selectedTrack: undefined,
  selectedTrackNumber: undefined,
  setSelectedTrack: (selectedTrack, selectedTrackNumber) =>
    set({ selectedTrack, selectedTrackNumber }),
}));
