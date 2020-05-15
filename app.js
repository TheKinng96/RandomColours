//GLOBAL SELECTIONS AND VARS
const colorDivs = document.querySelectorAll(".colour");
const generateBtn = document.querySelector(".generate");
const sliders = document.querySelectorAll('input[type="range"]');
const currentHexes = document.querySelectorAll(".colour h2");
let initialColor;


//eventlisteners

sliders.forEach(slider => {
    slider.addEventListener('input', hslControls);
});
colorDivs.forEach((div, index)=>{
    div.addEventListener("change", ()=>{
        updateTextUI(index);
    });
});


//FUNCTIONS
// colour generator
function generateHex(){
    const hexColor = chroma.random();
    return hexColor;
}

function randomColor(){

    initialColor = [];
    colorDivs.forEach((div,index) => {
        const hexText = div.children[0];
        const randomColor = generateHex();
        //add to the array
        initialColor.push(chroma(randomColor).hex());

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
    //reset input sliders
    resetInputs();
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

    const bgColor = initialColor[index];

    let color = chroma (bgColor)
        .set("hsl.s",saturation.value)
        .set("hsl.l",brightness.value)
        .set("hsl.h",hue.value);

    colorDivs[index].style.backgroundColor = color; 
    colorizeSliders(color, hue, brightness, saturation);
}

function updateTextUI (index) {
    const activeDiv = colorDivs[index];
    const color = chroma(activeDiv.style.backgroundColor);
    const textHex = activeDiv.querySelector('h2');
    const icons = activeDiv.querySelectorAll(".controls button");
    textHex.innerText = color.hex();

    //check contrast
    checkTextContrast(color,textHex);
    for (icon of icons){
        checkTextContrast(color,icon);
    }
}

function resetInputs () {
    const sliders = document.querySelectorAll(".sliders input");
    sliders.forEach(slider => {
        if(slider.name === "hue"){
            const hueColor = initialColor[slider.getAttribute('data-hue')];
            const hueValue = chroma(hueColor).hsl()[0];
            slider.value = Math.floor(hueValue);
        }
        if(slider.name === "brightness"){
            const brightColor = initialColor[slider.getAttribute('data-bright')];
            const brightValue = chroma(brightColor).hsl()[2];
            slider.value = Math.floor(brightValue * 100)/ 100;
        }
        if(slider.name === "saturation"){
            const saturationColor = initialColor[slider.getAttribute('data-sat')];
            const saturationValue = chroma(saturationColor).hsl()[1];
            slider.value = Math.floor(saturationValue*100)/100;
        }
    })
}

randomColor();


