import { useEffect, useState } from 'react';
import './App.css';
import Tuner from './components/Tuner';

function App() {
    let audioContext
    let microphoneStream = null;
    let analyserNode
    let audioData
    let corrolatedSignal
    let localMaxima = new Array(10);

    const [pitch, setPitch] = useState('')

    const createAudioContext = ()=>{
        if (!audioContext) {
            // Create a new AudioContext
            audioContext = new (window.AudioContext || window.webkitAudioContext)()
            analyserNode = audioContext.createAnalyser()
            analyserNode.fftSize = 4096;
            audioData = new Float32Array(analyserNode.fftSize)
            corrolatedSignal = new Float32Array(analyserNode.fftSize)
        } else {
            // Resume the AudioContext if it's in a suspended state
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }
        }
    }

    const startDetection = ()=>{
        createAudioContext()
        navigator.mediaDevices.getUserMedia({audio: true}).then((stream) =>{
            // setStartListening(true)

            microphoneStream = audioContext.createMediaStreamSource(stream);
            microphoneStream.connect(analyserNode);

            audioData = new Float32Array(analyserNode.fftSize);
            corrolatedSignal = new Float32Array(analyserNode.fftSize);

            setInterval(() => {
                analyserNode.getFloatTimeDomainData(audioData);

                let newPitch = getAutocorrolatedPitch();
                const smoothingFactor = 0.8;
                const smoothedHz = smoothingFactor * newPitch + (1 - smoothingFactor) * pitch;
                setPitch(smoothedHz);

            }, 200);
        }).catch(err =>{
            console.log(err)
        })
    }

    function getAutocorrolatedPitch(){
        // First: autocorrolate the signal

        let maximaCount = 0;

        for (let l = 0; l < analyserNode.fftSize; l++) {
            corrolatedSignal[l] = 0;
            for (let i = 0; i < analyserNode.fftSize - l; i++) {
                corrolatedSignal[l] += audioData[i] * audioData[i + l];
            }
            if (l > 1) {
                if ((corrolatedSignal[l - 2] - corrolatedSignal[l - 1]) < 0
                    && (corrolatedSignal[l - 1] - corrolatedSignal[l]) > 0) {
                    localMaxima[maximaCount] = (l - 1);
                    maximaCount++;
                    if ((maximaCount >= localMaxima.length))
                        break;
                }
            }
        }

        // Second: find the average distance in samples between maxima

        let maximaMean = localMaxima[0];

        for (let i = 1; i < maximaCount; i++)
            maximaMean += localMaxima[i] - localMaxima[i - 1];

        maximaMean /= maximaCount;

        return audioContext.sampleRate / maximaMean;
    }

    

    useEffect(()=>{
        
    },[])

    return (
        <div id='structure'>
            <div id='header'>
                <img id='logo' src="/logo.png" alt="logo" />
                <h1>Guitar Tune</h1>
            </div>
            <button id='start' onClick={startDetection}>Start</button>
            <Tuner hz={pitch}/>

        </div>
  );
}

export default App;
