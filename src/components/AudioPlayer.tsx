import {
  useState,
  useRef,
  BaseSyntheticEvent,
  useContext,
  createContext,
  type Dispatch,
  type SetStateAction,
  useEffect,
} from "react";
import {
  BackwardIcon,
  ForwardIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  PlayIcon,
  PauseIcon,
} from "@heroicons/react/24/outline";
import { number } from "zod";

const skipTime = 15;

const buttonStyles = `
  w-6 items-center
`;

const AudioPlayer = () => {
  const [audioContext, setAudioContext] = useContext(AudioContext);
  const audioRef = useRef<HTMLAudioElement>(null);
  const seekRef = useRef<HTMLInputElement>(null);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playing, setPlaying] = useState(false);
  const [speedIdx, setSpeedIdx] = useState<number>(2); // todo: save speed for user;
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 1.6, 1.7, 1.8, 1.9, 2];

  useEffect(() => {
    if (audioRef && audioRef.current) {
      audioRef.current.load()
      audioRef.current.play().catch(e => {console.error(e)})
      setPlaying(true)
    }
  }, [audioContext])

  return (
    <>
      <audio
        ref={audioRef}
        onDurationChange={(e: BaseSyntheticEvent) => {
          const _duration: number = e.target.duration;
          setDuration(_duration);
        }}
        onTimeUpdate={(e: BaseSyntheticEvent) => {
          if (seekRef && seekRef.current) {
            seekRef.current.value = e.target.currentTime;
          }
          setCurrentTime(e.target.currentTime);
        }}
        onPause={(e: BaseSyntheticEvent) => {
          setDuration(e.target.duration);
        }}
        onPlay={(e: BaseSyntheticEvent) => {
          setDuration(e.target.duration);
        }}
      >
        <source
          src={
            audioContext &&
            audioContext.tracks &&
            audioContext.tracks.length > 0
              ? audioContext!.tracks![audioContext!.currentTrack]
              : ""
          }
          type="audio/mpeg"
        />
        Your browser does not support the audio element.
      </audio>
      <div
        className={`
          align-center fixed
          flex
          w-screen flex-col
          justify-center
          bg-gray-800 text-white
      `}
        style={{
          bottom:
            audioContext &&
            audioContext.tracks &&
            audioContext.tracks.length > 0
              ? 0
              : -72,
          transition: "bottom .25s ease-in-out"
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
            onChange={(e: BaseSyntheticEvent) => {
              if (audioRef && audioRef.current) {
                audioRef.current.currentTime = e.target.value;
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
            // disabled={audioContext!.tracks!.length === 0}
            className={`${buttonStyles}`}
            onClick={() => {
              if (
                audioRef &&
                audioRef.current &&
                audioRef.current.currentTime! < 3 &&
                audioContext!.currentTrack > 0
              ) {
                setAudioContext!({
                  ...audioContext!,
                  currentTrack:
                    (audioContext!.currentTrack - 1) %
                    audioContext!.tracks!.length,
                });
              } else {
                audioRef.current!.currentTime = 0;
                seekRef.current!.value = "0";
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
                  audioRef.current.play().catch(e => console.error(e));
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
              if (
                audioContext &&
                audioContext.currentTrack < audioContext.tracks!.length - 1
              ) {
                setAudioContext!({
                  ...audioContext!,
                  currentTrack:
                    (audioContext!.currentTrack + 1) %
                    audioContext!.tracks!.length,
                });
              } else {
                setAudioContext!({
                  currentTrack: 0,
                  tracks: []
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

// const temp: Dispatch<
//   SetStateAction<{
//     currentTrack: number;
//     tracks?: string[]; // Should be | undefined after testing
//   }>
// > = useState<{ currentTrack: number; tracks?: string[] }>({
//   currentTrack: 0,
//   tracks: [],
// })[1];



export const AudioContext = createContext<
  [
    {
      currentTrack: number;
      tracks?: string[];
    },
    Dispatch<
      SetStateAction<{
        currentTrack: number;
        tracks?: string[]; // Should be | undefined after testing
      }>
    >?
  ]
>([{ currentTrack: 0 }, undefined]);

export const AudioContextProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [audioContext, setAudioContext] = useState<{
    currentTrack: number;
    tracks?: string[];
  }>({
    currentTrack: 0,
    tracks: [],
  });
  return (
    <AudioContext.Provider value={[audioContext, setAudioContext!]}>
      {children}
    </AudioContext.Provider>
  );
};

export default AudioPlayer;
