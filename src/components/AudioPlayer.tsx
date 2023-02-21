import { useState, useRef, useContext, createContext, useEffect } from "react";
import {
  BackwardIcon,
  ForwardIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  PlayIcon,
  PauseIcon,
} from "@heroicons/react/24/outline";

const skipTime = 15;

const buttonStyles = `
  w-6 items-center
`;

const AudioPlayer = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [audioContext, setAudioContext] = useContext(AudioContext);
  const audioRef = useRef<HTMLAudioElement>(null);
  const seekRef = useRef<HTMLInputElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState<number>(2); // todo: save speed for user;
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.6, 1.7, 1.8, 1.9, 2];

  useEffect(() => {
    if (audioRef && audioRef.current && audioContext.tracks.length !== 0) {
      audioRef.current.load();
      audioRef.current.play().catch((e) => {
        console.error(e);
      });
      setPlaying(true);
    }
  }, [audioContext]);

  return (
    <>
      <audio
        ref={audioRef}
        onDurationChange={(e) => {
          const target = e.target as HTMLAudioElement;
          setDuration(target.duration);
        }}
        onTimeUpdate={(e) => {
          const target = e.target as HTMLAudioElement;
          if (seekRef && seekRef.current) {
            seekRef.current.value = target.currentTime.toString();
          }
          setCurrentTime(target.currentTime);
        }}
        onPlay={(e) => {
          const target = e.target as HTMLAudioElement;
          setDuration(target.duration);
        }}
        onEnded={() => {
          if (audioContext.currentTrack < audioContext.tracks.length - 1) {
            const currentTrack = audioContext.currentTrack;
            setAudioContext({
              ...audioContext,
              currentTrack: currentTrack + 1,
            });
          }
        }}
      >
        <source
          src={audioContext.tracks[audioContext.currentTrack]}
          type="audio/mpeg"
        />
        Your browser does not support the audio element.
      </audio>
      <div
        style={{
          paddingBottom:
            audioContext &&
            audioContext.tracks &&
            audioContext.tracks.length > 0
              ? 96
              : 0,
        }}
      >
        {children}
      </div>
      <div
        className={`
          align-center fixed
          flex
          w-full flex-col
          justify-center
          bg-slate-700 text-slate-100
      `}
        style={{
          bottom:
            audioContext &&
            audioContext.tracks &&
            audioContext.tracks.length > 0
              ? 96
              : -72,
          transition: "bottom .25s ease-in-out",
        }}
      >
        <div className={`flex h-8 w-full items-center justify-center pt-2`}>
          <span className="mx-2 w-8">
            {Math.floor(currentTime / 60).toFixed()}:
            {String((currentTime % 60).toFixed()).padStart(2, "0")}
          </span>
          <input
            type="range"
            min={0}
            max={duration}
            ref={seekRef}
            className="h-0.5 cursor-pointer appearance-none rounded bg-white"
            onChange={(e) => {
              const target = e.target as HTMLInputElement;
              if (audioRef && audioRef.current) {
                audioRef.current.currentTime = Number(target.value);
              }
            }}
          />
          <span className="mx-2 w-8">
            {duration ? Math.floor(duration / 60).toFixed() : 0}:
            {duration
              ? String((duration % 60).toFixed()).padStart(2, "0")
              : "00"}
          </span>
        </div>
        <div
          className={`
        flex w-full justify-center gap-4 pb-4
        `}
        >
          <button
            className={`${buttonStyles}`}
            onClick={() => {
              if (
                audioRef &&
                audioRef.current &&
                audioRef.current.currentTime < 3 &&
                audioContext.currentTrack > 0
              ) {
                setAudioContext({
                  ...audioContext,
                  currentTrack:
                    (audioContext.currentTrack - 1) %
                    audioContext.tracks.length,
                });
              } else if (
                audioRef &&
                audioRef.current &&
                seekRef &&
                seekRef.current
              ) {
                audioRef.current.currentTime = 0;
                seekRef.current.value = "0";
              }
            }}
          >
            <BackwardIcon />
          </button>
          <button
            // disabled={audioContext!.tracks!.length === 0}
            className={`${buttonStyles}`}
            onClick={() => {
              if (audioRef && audioRef.current) {
                audioRef.current.currentTime = Math.max(
                  audioRef.current.currentTime - skipTime,
                  0
                );
              }
            }}
          >
            <ArrowUturnLeftIcon />
          </button>
          <button
            // disabled={audioContext!.tracks!.length === 0}
            className={`${buttonStyles}`}
            onClick={() => {
              if (audioRef && audioRef.current) {
                if (playing) {
                  audioRef.current.pause();
                } else {
                  audioRef.current.play().catch((e) => console.error(e));
                }
              }
              setPlaying(!playing);
            }}
          >
            {playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            // disabled={audioContext!.tracks!.length === 0}
            className={`${buttonStyles}`}
            onClick={() => {
              if (audioRef && audioRef.current) {
                audioRef.current.currentTime = Math.min(
                  audioRef.current.currentTime + skipTime,
                  duration
                );
              }
            }}
          >
            <ArrowUturnRightIcon />
          </button>
          <button
            // disabled={audioContext!.tracks!.length === 0}
            className={`${buttonStyles}`}
            onClick={() => {
              if (audioContext.currentTrack < audioContext.tracks.length - 1) {
                setAudioContext({
                  ...audioContext,
                  currentTrack:
                    (audioContext.currentTrack + 1) %
                    audioContext.tracks.length,
                });
              } else {
                setAudioContext({
                  currentTrack: 0,
                  tracks: [],
                });
              }
            }}
          >
            <ForwardIcon />
          </button>
          <button
            onClick={() => {
              const newIdx = (speedIdx + 1) % speeds.length;
              if (audioRef && audioRef.current) {
                audioRef.current.playbackRate = Number(speeds[newIdx]);
              }
              setSpeedIdx(newIdx);
            }}
            className={`${buttonStyles}`}
          >
            {speeds[speedIdx]}x
          </button>
        </div>
      </div>
    </>
  );
};

type AudioState = {
  currentTrack: number;
  tracks: string[];
};

type AudioContext = [
  AudioState,
  ({ currentTrack, tracks }: AudioState) => void
];

export const AudioContext = createContext<AudioContext>([
  { currentTrack: 0, tracks: [] },
  (input: AudioState) => {
    if (!input) {
      // This enforces that input is used for linting purposes
      return;
    }
    return;
  },
]);

export const AudioContextProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [audioContext, setAudioContext] = useState<AudioState>({
    currentTrack: 0,
    tracks: [],
  });
  return (
    <AudioContext.Provider value={[audioContext, setAudioContext]}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioPlayer;
