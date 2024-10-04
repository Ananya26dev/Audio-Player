import React from "react";
import AudioFile from "./assets/audio.mp3";
import "./App.css";
import AudioPlayer from "./components/AudioPlayer";
const App = () => {
  return (
    <>
      <AudioPlayer audiofile={AudioFile} />
    </>
  );
};

export default App;
