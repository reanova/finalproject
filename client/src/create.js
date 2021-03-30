import React from "react";
import { Song, Track, Instrument } from "reactronica";

function Create() {
    const [isPlaying, setIsPlaying] = React.useState(false);

    return (
        <div className="Create">
            <Song isPlaying={isPlaying}>
                <Track steps={["C3", "E3", "G3", null]}>
                    <Instrument type="synth" />
                </Track>
            </Song>
            <button
                style={{
                    fontSize: "2rem",
                }}
                onClick={() => {
                    setIsPlaying(!isPlaying);
                }}
            >
                {isPlaying ? "Stop sound" : "Play sound"}
            </button>
        </div>
    );
}

export default Create;
