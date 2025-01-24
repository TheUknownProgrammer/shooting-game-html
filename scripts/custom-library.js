const randomColor = () => `rgb(${Math.floor(Math.random() * 166) + 60},${Math.floor(Math.random() * 166) + 60},${Math.floor(Math.random() * 166) + 60})`;

function randomRLG() {
    var colorsAmount = Math.floor(Math.random() * 11) + 5;
    var colors = [randomColor()];
    var angle = Math.floor(Math.random() * 361);
    var gap = Math.floor(Math.random() * 16) + 15;
    for(let i = 1; i <= colorsAmount; i++) {
        colors.push(`${randomColor()} ${i * gap}px`);
    }

    return `repeating-linear-gradient(${angle}deg in hsl longer hue,${[colors]})`;
}

const randomColorBackground = (ele) => ele.style.backgroundImage = randomRLG();

function playSound(sound) {
    if(!sound.paused) {
        sound.currentTime = 0;
    }
    sound.play();
}

function loadSequence(root,name,file_extension,startingPoint,endingPoint) {
    var sequence = [];
    for(let i = startingPoint; i <= endingPoint; i++) {
        sequence.push(root + "/" + name + i + file_extension);
    }
    return sequence;
}

function runSequence(sequence,imgElement,timeInMille) {
    var index = 0;

    var running = setInterval(() => {
        imgElement.src = sequence[index];

        if(index >= sequence.length-1) {
            clearInterval(running);
        }

        index++;
    }, timeInMille);
}

function fadeAway(node, miliTotalTime = 1000) {
    if(!node instanceof Element) return false;

    var opacity = 1;
    var eachInterval = miliTotalTime / 10;
   
    var opacityInterval = setInterval(() => {
        opacity -= 0.1;
        opacity = parseFloat(opacity.toFixed(1));
        node.style.opacity = opacity;

        if(opacity <= 0) {
            clearInterval(opacityInterval);
            node.remove();
        }
    }, eachInterval);
}

