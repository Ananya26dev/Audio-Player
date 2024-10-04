import { useRef, useState, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faVolumeUp,
  faVolumeDown,
  faVolumeMute,
  faVolumeOff,
} from "@fortawesome/free-solid-svg-icons";
const formWaveSurferOption = (ref) => ({
  container: ref,
  waveColor: "#ccc",
  progressColor: "#0178ff",
  cursorColor: "transparent",
  responsive: true,
  height: 80,
  normalize: true,
  backend: "WebAudio",
  barWidth: 2,
  barGap: 3,
});
function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(
    2,
    "0"
  )}`;
}

const AudioPlayer = ({ audiofile }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [volume, setVolume] = useState(0.5);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioFileName, setAudioFileName] = useState("");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const options = formWaveSurferOption(waveformRef.current);
    wavesurfer.current = WaveSurfer.create(options);
    wavesurfer.current.load(audiofile);

    wavesurfer.current.on("ready", () => {
      setVolume(wavesurfer.current.getVolume());
      setDuration(wavesurfer.current.getDuration());
      setAudioFileName(audiofile.split("/").pop());
      setIsReady(true);
    });
    wavesurfer.current.on("audioprocess", () => {
      setCurrentTime(wavesurfer.current.getCurrentTime());
    });
    return () => {
      try {
        if (wavesurfer.current) {
          wavesurfer.current.destroy();
        }
      } catch (error) {
        console.error("WaveSurfer destruction failed: ", error);
      }
    };
  }, [audiofile]);

  const handlePlayPause = () => {
    if (!isReady) return;
    setPlaying((prev) => {
      const newPlaying = !prev;
      if (newPlaying) {
        wavesurfer.current.play();
      } else {
        wavesurfer.current.pause();
      }
      return newPlaying;
    });
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    wavesurfer.current.setVolume(newVolume);
    setMuted(newVolume === 0);
  };

  const handleMute = () => {
    setMuted(!muted);
    wavesurfer.current.setVolume(muted ? volume : 0);
  };

  const handleVolumeUp = () => {
    handleVolumeChange(Math.min(volume + 0.1, 1));
  };

  const handleVolumeDown = () => {
    handleVolumeChange(Math.max(volume - 0.1, 0));
  };

  return (
    <div className="container">
      <div id="waveform" ref={waveformRef} style={{ width: "100%" }}></div>
      <div className="controls">
        <button onClick={handlePlayPause}>
          <FontAwesomeIcon icon={playing ? faPause : faPlay} />
        </button>
        <button onClick={handleMute}>
          <FontAwesomeIcon icon={muted ? faVolumeOff : faVolumeMute} />
        </button>
        <input
          type="range"
          name="volume"
          id="volume"
          min="0"
          max="1"
          step="0.05"
          value={muted ? 0 : volume}
          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
        />
        <button onClick={handleVolumeDown}>
          <FontAwesomeIcon icon={faVolumeDown} />
        </button>
        <button onClick={handleVolumeUp}>
          <FontAwesomeIcon icon={faVolumeUp} />
        </button>
        <div className="audio-info">
          <span>
            Playing:{audioFileName}
            <br />
          </span>
          <span>
            Duration: {formatTime(duration)} | Current Time:{""}
            {formatTime(currentTime)}
            <br />
          </span>
          <span>Volume: {Math.round(volume * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
