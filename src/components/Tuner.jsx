

export default function Tuner ({hz}){

    const notes = {
        "C": [16.35, 32.70, 65.41, 130.81, 261.63, 523.25, 1046.50, 2093.00, 4186.01],
        "D": [18.35, 36.71, 73.42, 146.83, 293.66, 587.33, 1174.66, 2349.32, 4698.63],
        "E": [20.60, 41.20, 82.41, 164.81, 329.63, 659.25, 1318.51, 2637.02, 5274.04],
        "F": [21.83, 43.65, 87.31, 174.61, 349.23, 698.46, 1396.91, 2793.83, 5587.65],
        "G": [24.50, 49.00, 98.00, 196.00, 392.00, 783.99, 1567.98, 3135.96, 6271.93],
        "A": [27.50, 55.00, 110.00, 220.00, 440.00, 880.00, 1760.00, 3520.00, 7040.00],
        "B": [30.87, 61.74, 123.47, 246.94, 493.88, 987.77, 1975.53, 3951.07, 7902.13]
    };

    const getNote = ()=>{
        
        if (hz < 16.35 || hz > 7902.13){
            return undefined
        }

        

        let nearestNote = null;
        let smallestDifference = Infinity;

        for (const [note, frequencies] of Object.entries(notes)) {
            for (const frequency of frequencies) {
                const difference = Math.abs(frequency - hz);

                if (difference < smallestDifference) {
                    smallestDifference = difference;
                    nearestNote = note;
                }
            }
        }

        return nearestNote;
        
    }


    return (
        <div id="tunning-container">{getNote()} - {hz}</div>
    )
}