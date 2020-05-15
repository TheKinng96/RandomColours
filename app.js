//GLOBAL SELECTIONS AND VARS
const colorDivs = document.querySelectorAll(".colour");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".colour h2");
let initialColour;

//FUNCTIONS
// colour generator
function generateHex(){
    const hexColor = chroma.random();
    return hexColor;
}

function randomColour(){
    colorDivs.forEach((div,index) => {
        const hexText = div.children[0];
        const randomColour = generateHex();

        // Add the colour to the bg
        div.style.backgroundColor = randomColour;
        hexText.innerText = randomColour;

        checkTextContrast(randomColour, hexText);
    });
} 

function checkTextContrast(color,text){
    const luminance = chroma(color).luminance();
    if (luminance > 0.5){
        text.style.color = "black";
    } else {
        text.style.color = "white";
    }
}

randomColour();


