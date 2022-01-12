// wind script for "how to build a bird kite, html version, by laurel schwulst"
// taichi wi
// initiated january 11, 2022

// this first version considers the html matter like a kite hanging by a slightly elastic string.
// wind data from March 27, 2021, when the tutorial was filmed, pushes the kite around.

// load script data.js containing wind data as JSON
// data is in mph
// const weatherData = ...
const body = document.body.querySelector('main')
let position = {
    x: 0,
    y: 0
}
let velocity = {
    x: 0,
    y: 0
}
let mass = 1 // kg arbitrary constant
let transformFactor = -0.1 // arbitrary constant multiplied to displacement to apply as transformation
const surfaceArea = 1 // m^2, arbitrary constant
const densityOfAir = 1.2041 // kg/m^3
const windLoadFactor = 0.5 * densityOfAir * surfaceArea // F = 0.5p*(v^2)*A ... https://www.engineeringtoolbox.com/wind-load-d_1775.html
let windSpeed = {
    magnitude: 0, // m/s
    x: 0,
    y: 0
}
let windDirection = 0 // radian
const elasticStiffness = 0.2 // N/m

// convert wind speed from mph to m/s
const convertWindSpeed = function(windSpeedMagnitude) {
    return windSpeedMagnitude / 2.237
}

// convert wind direction from weather convention to trigonometry convention
const convertWindDirection = function(windDirectionAngle) {
    // wind direction indicates the source of the wind
    // 0 degrees is North and the angle is measured clockwise, so East is 90 degrees.
    // first convert the angle from wind conventions to trigonometry convention 
    // windDirection = -1 * windDirection // invert direction for trigonometry
    // windDirection = -1 * windDirection // invert it again to change from source-facing to destination-facing
    windDirectionAngle = windDirectionAngle * Math.PI / 180 // convert to radians
    // windDirectionAngle += Math.PI / 2 // turn the system by a quarter-circle
    return windDirectionAngle
}

const getWindSpeedComponents = function(windSpeedMagnitude, windDirection) {
    return {
        x: windSpeedMagnitude * Math.cos(windDirection), // extract the horizontal component
        y: windSpeedMagnitude * Math.sin(windDirection) // extract the vertical component
    }
}

const getWindLoad = function() {
    return {
        x: windLoadFactor * windSpeed.x * windSpeed.x,
        y: windLoadFactor * windSpeed.y * windSpeed.y
    }
}

const getKiteStringLoad = function() {
    return {
        x: position.x * -1 * elasticStiffness,
        y: position.y * -1 * elasticStiffness
    }
}

const data = weatherData.days[0].hours.concat(weatherData.days[1].hours).concat(weatherData.days[2].hours)
let frame = 0 // animation offset
let dataOffset = 0 // data offset
let time = 0.25 // simulated seconds per frame
const dataFrameInterval = 10 // amount of frames before using next wind data
const maxFrame = dataFrameInterval * data.length

function iterate() {
    windSpeed.magnitude = convertWindSpeed(data[dataOffset].windspeed)
    windDirection = convertWindDirection(data[dataOffset].winddir)
    const windSpeedComponents = getWindSpeedComponents(windSpeed.magnitude, windDirection)
    windSpeed.x = windSpeedComponents.x
    windSpeed.y = windSpeedComponents.y
    const windLoad = getWindLoad()
    const kiteStringLoad = getKiteStringLoad()
    const load = {
        x: windLoad.x + kiteStringLoad.x,
        y: windLoad.y + kiteStringLoad.y,
    }
    const displacement = {
        x: load.x * time,
        y: load.y * time
    }
    // const acceleration = {
    //     x: load.x / mass,
    //     y: load.y / mass
    // }
    // const displacement = {
    //     x: velocity.x * time + 0.5 * acceleration.x * time * time,
    //     y: velocity.y * time + 0.5 * acceleration.y * time * time
    // }
    // console.log(dataOffset)
    // console.log(windSpeed)
    // console.log(windDirection)
    // console.log(windLoad)
    // console.log(kiteStringLoad)
    // console.log(load)
    // console.log(displacement)
    position.x = position.x + displacement.x
    position.y = position.y + displacement.y
    velocity.x = displacement.x / time
    velocity.y = displacement.y / time
    draw()
    
    if (log) {
        console.log("Displacement")
        console.log(displacement)
        console.log("Diff")
        console.log(diff)
    }

    frame += 1;
    if (frame >= maxFrame) {
        frame = 0;
    }
    dataOffset = Math.floor(frame / dataFrameInterval)
}

function draw() {
    if (testOption == 0) {
        body.style.transform = `translate(${transformFactor * position.x}px, ${transformFactor * position.y}px)`
    } else if (testOption == 1) {
        transformFactor = -0.2
        document.querySelectorAll('h1, h2').forEach(header => {
            header.style.transform = `translate(${transformFactor * position.x}px, ${transformFactor * position.y}px)`
        });
    } else if (testOption == 2) {
        document.querySelectorAll('h1, h2, .side-b').forEach(header => {
            header.style.transform = `translate(${transformFactor * position.x}px, ${transformFactor * position.y}px)`
        });
    }
}

// Testing
const log = false // log data to console?

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
let testOption = 0
if (params.option) {
    console.log(params.option)
    testOption = parseInt(params.option)
}

// Throttle method - limit calls to <func> to once per <interval> ms. | Source: https://stackoverflow.com/questions/18177174/how-to-limit-handling-of-event-to-once-per-x-seconds-with-jquery-javascript
function throttle(func, interval) { var lastCall = 0; return function() { var now = Date.now(); if (lastCall + interval < now) { lastCall = now; return func.apply(this, arguments); } }; }
// Throttled key press
const throttledKeyEvent = throttle(event => {
	// Right: Step Forward
	if (event.keyCode == 39) {
        console.log('sdf')
		iterate();
	}
	// Left: Step Backward
	else if (event.keyCode == 37) {
		// stepBackward();
		iterate();
	}
	// Down: Print Offset
	else if (event.keyCode == 40) {
        console.log("Data Offset")
        console.log(dataOffset)
        console.log("Displacement")
		console.log(displacement);
	}
}, 100);

document.addEventListener('keydown', throttledKeyEvent);


function start() {
    setInterval(iterate, 50)
}
start();