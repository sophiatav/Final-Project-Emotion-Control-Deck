// import { addData } from './firebase.js';

let particles = [];
let table;
const noiseScale = 0.01;
let gradients = {};
let counter = 0;
let currentNum = 0;
let maxVals = 100;
let startingVal = 0;
let endingVal = 0;
let setupDone = false;
function preload() {
    // table = loadTable("data.csv", "csv", "header");

    // var that = this;
    // window.readData().then((data) => {
    //     // data.forEach(entry => that.addParticle);
    // });
}
function populateTerminal(entry){
    // console.log(counter)
    // if(counter>=startingVal && counter <= endingVal){
    if(counter<maxVals || setupDone ){
        const terminalOutput = document.querySelector(".terminal-output");
        const line = document.createElement("div");
        line.classList.add("terminal-line");
        line.textContent = `[${entry.status.toUpperCase()}] ${entry.response}`;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    counter++;
}

function setup() {

    window.readData().then(data => {
        console.log("data: ", data)
        console.log(data.length)
        var numVals = data.length;
        endingVal = numVals;
        startingVal = endingVal-maxVals;
        if(startingVal<0){
            startingVal=0;
        }
        // currentNumVals =
        // Show in terminal
        // Sort by timestamp descending
        data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Limit to maxVals
        const latestData = data.slice(0, maxVals);

        // Reset counter
        counter = 0;

        // Show in terminal and add particles
        latestData.forEach(entry => {
            populateTerminal(entry);
        });
        counter = 0;
        console.log("latestData: ", latestData)
        latestData.forEach(entry => {
            addParticle(entry);
        });
        currentNum = counter;
        setupDone = true;

        
    })


    // Delay canvas creation to ensure DOM is fully loaded
    let container = document.getElementById('sketchCanvas');
    let canvas = createCanvas(container.clientWidth, container.clientHeight);
    canvas.parent('sketchCanvas');
    setupGradients();
    strokeWeight(20);

    // for (let r = 0; r < table.getRowCount(); r++) {
    //     let response = table.getString(r, "response").trim().toLowerCase();
    //     let x = random(width);
    //     let y = random(height);
    //     let gradient, speed, direction;

    //     if (response.includes("always been hopeful")) {
    //         gradient = gradients.hopeful;
    //         speed = 1;
    //         direction = p5.Vector.random2D().mult(0.5).add(0.5, -0.5);
    //     } else if (response.includes("used to be more hopeful")) {
    //         gradient = gradients.pastHopeful;
    //         speed = 1.2;
    //         direction = p5.Vector.random2D().mult(0.5).add(-0.5, 0.5);
    //     } else if (response.includes("always been fearful")) {
    //         gradient = gradients.fearful;
    //         speed = 2.2;
    //         direction = p5.Vector.random2D().mult(0.5).add(-0.5, 0.5);
    //     } else if (response.includes("used to be more fearful")) {
    //         gradient = gradients.pastFearful;
    //         speed = 2;
    //         direction = p5.Vector.random2D().mult(0.5).add(0.5, -0.5);
    //     } else {
    //         gradient = gradients.neutral;
    //         speed = 0.8;
    //         direction = p5.Vector.random2D();
    //     }

    //     particles.push({
    //         pos: createVector(x, y),
    //         gradient: gradient,
    //         speed: speed,
    //         direction: direction
    //     });
    // }

    setTimeout(function () {
        resizeCanvas(container.clientWidth, container.clientHeight);
    }, 1);
}

function draw() {
    background(255, 10);
    for (let p of particles) {
        let g = p.gradient;
        setRadialGradient(p.pos.x, p.pos.y, 18, g[0], g[1], g[2]);

        let n = noise(p.pos.x * noiseScale, p.pos.y * noiseScale);
        let movement = p.direction.copy().mult(p.speed);
        p.pos.add(movement);

        if (!onScreen(p.pos)) {
            p.pos = createVector(random(width / 3, 2 * width / 3), random(height / 3, 2 * height / 3));
        }
    }
}

function setupGradients() {
    gradients.hopeful = [color(232, 89, 217), color(238, 129, 11), color(255, 241, 120)];
    gradients.pastHopeful = [color(11, 237, 96), color(45, 90, 205), color(129, 150, 205)];
    gradients.fearful = [color(72, 33, 95), color(31, 6, 60), color(129, 150, 205)];
    gradients.pastFearful = [color(11, 237, 96), color(255, 198, 0), color(255, 241, 120)];
    gradients.neutral = [color(200, 200, 200), color(180, 180, 180), color(150, 150, 150)];
}

function setRadialGradient(x, y, r, c1, c2, c3) {
    for (let i = r; i > 0; i--) {
        let inter = map(i, 0, r, 0, 1);
        let c = inter < 0.5 ? lerpColor(c1, c2, inter * 2) : lerpColor(c2, c3, (inter - 0.5) * 2);
        stroke(c);
        ellipse(x, y, i * 2, i * 2);
    }
}

function onScreen(v) {
    return v.x >= 0 && v.x <= width && v.y >= 0 && v.y <= height;
}

function windowResized() {
    let container = document.getElementById('sketchCanvas');
    resizeCanvas(container.clientWidth, container.clientHeight);
}

// New function to add a particle based on response status
function addParticle(entry) {
    // if(counter>=startingVal && counter <= endingVal){
        if(counter<maxVals || setupDone ){
    let x = random(width);
    let y = random(height);
    let gradient, speed, direction;

    if (entry.status === "hopeful") {
        gradient = gradients.hopeful;
        speed = 1;
        direction = p5.Vector.random2D().mult(0.5).add(0.5, -0.5);
    } else if (entry.status === "hopeful-fearful") {
        gradient = gradients.pastHopeful;
        speed = 1.2;
        direction = p5.Vector.random2D().mult(0.5).add(-0.5, 0.5);
    } else if (entry.status === "fearful") {
        gradient = gradients.fearful;
        speed = 2.2;
        direction = p5.Vector.random2D().mult(0.5).add(-0.5, 0.5);
    } else if (entry.status === "fearful-hopeful") {
        gradient = gradients.pastFearful;
        speed = 2;
        direction = p5.Vector.random2D().mult(0.5).add(0.5, -0.5);
    } else {
        gradient = gradients.neutral;
        speed = 0.8;
        direction = p5.Vector.random2D();
    }

    // if(particles.length >= 10)
    // {
    //     particles.shift();
    // }
    if (particles.length >= maxVals) {
        particles.shift();
        const terminalOutput = document.querySelector(".terminal-output");
        terminal_lines = terminalOutput.getElementsByClassName("terminal-line");
        console.log(terminal_lines);

        if (terminal_lines.length > 0) {
            terminal_lines[0].remove();
        }
        // terminal_lines.shift();
    }
    
    particles.push({
        pos: createVector(x, y),
        gradient: gradient,
        speed: speed,
        direction: direction
    });
    }
    counter++;
}

document.addEventListener("DOMContentLoaded", function () {
    const statusItems = document.querySelectorAll(".status-item.clickable");
    const textArea = document.getElementById("fear-text");
    const submitButton = document.getElementById("submit-button");

    let selectedStatus = null;
    let responses = [];

    statusItems.forEach(item => {
        item.addEventListener("click", () => {
            statusItems.forEach(i => i.classList.remove("selected"));
            item.classList.add("selected");
            selectedStatus = item.dataset.status;
        });
    });

    // include particle addition
    // submitButton.addEventListener("click", () => {
    //   const userInput = textArea.value.trim();

    //   if (!selectedStatus) {
    //     alert("Please select an emotional status.");
    //     return;
    //   }

    //   if (!userInput) {
    //     alert("Please enter a response.");
    //     return;
    //   }

    //   const entry = {
    //     timestamp: new Date().toISOString(),
    //     status: selectedStatus,
    //     response: userInput
    //   };

    //   responses.push(entry);
    //   console.log("Saved Entry:", entry);

    //         // Add the new response to the particles array and update visualization
    //   addParticle(entry);
    //   textArea.value = "";
    //   selectedStatus = null;
    //   statusItems.forEach(i => i.classList.remove("selected"));
    // });


    submitButton.addEventListener("click", () => {
        const userInput = textArea.value.trim();

        if (!selectedStatus) {
            alert("Please select an emotional status.");
            return;
        }

        if (!userInput) {
            alert("Please enter a response.");
            return;
        }

        const entry = {
            timestamp: new Date().toISOString(),
            status: selectedStatus,
            response: userInput
        };
        console.log("entry: ", entry)
        window.addData(entry);


        // console.log(window.addDataToFirebase);
        // if(window.addDataToFirebase)
        // {
        //     window.addDataToFirebase(entry);
        // }

        responses.push(entry);
        console.log("Saved Entry:", entry);


        // this is where we'll save to firebase

        // Add particle
        // if the value of numbers is above max - then delete the first one on
        addParticle(entry);

        // Show in terminal
        const terminalOutput = document.querySelector(".terminal-output");
        const line = document.createElement("div");
        line.classList.add("terminal-line");
        line.textContent = `[${entry.status.toUpperCase()}] ${entry.response}`;
        terminalOutput.appendChild(line);

        // Limit number of terminal lines
if (terminalOutput.children.length >= maxVals) {
    terminalOutput.removeChild(terminalOutput.firstChild);
}

        terminalOutput.scrollTop = terminalOutput.scrollHeight;

        // Reset input
        textArea.value = "";
        selectedStatus = null;
        statusItems.forEach(i => i.classList.remove("selected"));
    });


});

// function windowResized(){
//   resizeCanvas(container.offsetWidth, container.offsetHeight);
// }