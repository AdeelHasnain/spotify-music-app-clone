import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
    // Define refs for audio player and UI elements
    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

    // State for current track, player status, and time tracking
    const [track, setTrack] = useState(songsData[0]);
    const [playerStatus, setPlayerStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: {
            second: 0,
            minutes: 0
        },
        totalTime: {
            second: 0,
            minutes: 0
        }
    });

    // Effect to handle time updates from the audio element
    useEffect(() => {
        const audioElement = audioRef.current;

        // Ensure audioRef is defined
        if (audioElement) {
            audioElement.ontimeupdate = () => {
                seekBar.current.style.width=(Math.floor(audioRef.current.currentTime/audioRef.current.duration*100))+"%";
                setTime({
                    currentTime: {
                        second: Math.floor(audioElement.currentTime % 60),
                        minutes: Math.floor(audioElement.currentTime / 60)
                    },
                    totalTime: {
                        second: isNaN(audioElement.duration) ? 0 : Math.floor(audioElement.duration % 60),
                        minutes: isNaN(audioElement.duration) ? 0 : Math.floor(audioElement.duration / 60)
                    }
                });
            };
        }

        // Cleanup the event listener when the component unmounts
        return () => {
            if (audioElement) {
                audioElement.ontimeupdate = null; // Remove event listener
            }
        };
    }, [audioRef, setTime]);

    // Play and pause controls
    const play = () => {
        audioRef.current.play();
        setPlayerStatus(true);
    };

    const pause = () => {
        audioRef.current.pause();
        setPlayerStatus(false);
    };
    const playWithId= async (id)=>{
        await setTrack(songsData[id]);
        await audioRef.current.play();
        setPlayerStatus(true);
    }
    const previous=async ()=>{
        if(track.id>0){
            await setTrack(songsData[track.id-1]);
            await audioRef.current.play();
            setPlayerStatus(true);
        }
    }
    const next=async ()=>{
        if(track.id<songsData.length-1){
            await setTrack(songsData[track.id+1]);
            await audioRef.current.play();
            setPlayerStatus(true);
        }
    }
    const seekSong= async (e)=>{
       audioRef.current.currentTime=((e.nativeEvent.offsetX/seekBg.current.offsetWidth)*audioRef.current.duration)
    }
    // Context value to be provided
    const contextValue = {
        audioRef,
        seekBg,
        seekBar,
        track, setTrack,
        playerStatus, setPlayerStatus,
        time, setTime,
        play, pause,
        playWithId,
        next,previous,
        seekSong
    };

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    );
};

export default PlayerContextProvider;
