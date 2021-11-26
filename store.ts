import create from 'zustand'

type TrackStatus = 'finish' | 'play' | 'pause'

type State = {
  autoplay?: boolean;
  setAutoPlay: (autoplay: boolean) => void;
  trackStatus?: TrackStatus;
  setTrackStatus: (trackStatus: TrackStatus) => void;
  selectedTrackNumber?: number;
  selectedTrack?: string;
  setSelectedTrack: (
    selectedTrack?: string,
    selectedTrackNumber?: number
  ) => void;
};

export const useStore = create<State>((set) => ({
  trackStatus: undefined,
  setAutoPlay: (autoplay) => set({ autoplay }),
  setTrackStatus: (trackStatus) => set({ trackStatus }),
  selectedTrack: undefined,
  selectedTrackNumber: undefined,
  setSelectedTrack: (selectedTrack, selectedTrackNumber) =>
    set({ selectedTrack, selectedTrackNumber }),
}));
