//GLOBAL SELECTIONS AND VARS
const colorDivs = document.querySelectorAll(".colour");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".colour h2");
let initialColor;


//eventlisteners

sliders.forEach(slider => {
    slider.addEventListener('input', hslControls);
})


//FUNCTIONS
// colour generator
function generateHex(){
    const hexColor = chroma.random();
    return hexColor;
}

function randomColor(){
    colorDivs.forEach((div,index) => {
        const hexText = div.children[0];
        const randomColor = generateHex();

        // Add the colour to the bg
        div.style.backgroundColor = randomColor;
        hexText.innerText = randomColor;

        checkTextContrast(randomColor, hexText);
        //Initial colorize sliders
        const color = chroma(randomColor);
        const sliders = div.querySelectorAll(".sliders input");   
        const hue = sliders[0];
        const brightness = sliders[1];
        const saturation = sliders[2];

        colorizeSliders(color,hue,brightness,saturation);
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

function colorizeSliders(color, hue, brightness, saturation){
    //scale saturation
    const noSat = color.set("hsl.s", 0);
    const fullSat = color.set("hsl.s", 1);
    const scaleSat = chroma.scale([noSat, color, fullSat]);
    //scale brightness
    const midBright = color.set("hsl.l", 0.5);
    const scaleBright = chroma.scale(["black",midBright,"white"]);

    //update input colours
    saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(0)}, ${scaleSat(1)})`;
    brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(0)}, ${scaleBright(0.5)},${scaleBright(1)})`;
    hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75,204,75), rgb(75,204,204),rgb(75,75,204), rgb(204,75,204),rgb(204,75,75))`;


}

function hslControls(e) {
    const index = 
    e.target.getAttribute("data-bright") || 
    e.target.getAttribute("data-sat") || 
    e.target.getAttribute("data-hue");

    let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];

    const bgColor = colorDivs[index].querySelector("h2").innerText;

    let color = chroma (bgColor)
        .set("hsl.s",saturation.value)
        .set("hsl.l",brightness.value)
        .set("hsl.h",hue.value);

    colorDivs[index].style.backgroundColor = color; 
}

randomColor();


