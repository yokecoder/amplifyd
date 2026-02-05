import { create } from "zustand";

// Helpers
const read = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const useTrackQueue = create((set, get) => {
    // Ensure storage keys exist
    if (!localStorage.getItem("trackQueue")) write("trackQueue", []);
    if (!localStorage.getItem("prevTrackQueue")) write("prevTrackQueue", []);

    return {
        trackQueue: read("trackQueue"),
        prevTrackQueue: read("prevTrackQueue"),
        currentTrack: read("trackQueue")[0] || null,

        setCurrentTrack: (id) =>
            set((s) => (s.currentTrack !== id ? { currentTrack: id } : s)),

        addToQueue: (id) => {
            if (!id) return;
            const { trackQueue, prevTrackQueue, currentTrack } = get();

            const newPrev = currentTrack ? [...prevTrackQueue, currentTrack] : prevTrackQueue;
            const newQueue = [id, ...trackQueue];

            write("trackQueue", newQueue);
            write("prevTrackQueue", newPrev);

            set({
                trackQueue: newQueue,
                prevTrackQueue: newPrev,
                currentTrack: id
            });
        },

        addToLast: (id) => {
            if (!id) return;
            const newQueue = [...get().trackQueue, id];

            write("trackQueue", newQueue);
            set({ trackQueue: newQueue });
        },

        skipToNext: () => {
            const { trackQueue, prevTrackQueue } = get();
            if (!trackQueue.length) return;

            const [first, ...rest] = trackQueue;
            const newPrev = [...prevTrackQueue, first];

            write("trackQueue", rest);
            write("prevTrackQueue", newPrev);

            set({
                trackQueue: rest,
                prevTrackQueue: newPrev,
                currentTrack: rest[0] || null
            });
        },

        skipToPrevious: () => {
            const { prevTrackQueue, trackQueue } = get();
            if (!prevTrackQueue.length) return;

            const prev = prevTrackQueue.at(-1);
            const newPrev = prevTrackQueue.slice(0, -1);
            const newQueue = [prev, ...trackQueue];

            write("trackQueue", newQueue);
            write("prevTrackQueue", newPrev);

            set({
                trackQueue: newQueue,
                prevTrackQueue: newPrev,
                currentTrack: prev
            });
        },

        clearTrackQueue: () => {
            write("trackQueue", []);
            set({
                trackQueue: [],
                currentTrack: null
            });
        }
    };
});

export default useTrackQueue;
