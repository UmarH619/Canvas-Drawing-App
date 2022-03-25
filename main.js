const canvas = document.getElementById("canvas")

// dimensions for the canvas:
canvas.width = window.innerWidth - 60;
canvas.height = 800; 

// creating the canvas into a white board:
let context = canvas.getContext("2d");
let start_background_color = "white"
context.fillStyle = start_background_color;
context.fillRect(0, 0, canvas.width, canvas.height);

// variables for the default pen colour and width:
let draw_color = "black";
let draw_width = "2";

// checks if we are currently drawing:
let is_drawing = false;

// this array will be used to store each individual stroke for the purpose of undoing when needed:
let restore_array = [];
let index = -1;

// change colour function that allows the colour to be changed by the default colours or the colour picker itself:
function change_color(element) {
    draw_color = element.style.background;
}

// event listeners, touch start for mobile devices and mouse for computers:
canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);

canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mouseup", stop, false);
canvas.addEventListener("mouseout", stop, false);

//  start function to set drawing = true and then prepare to start drawing:
function start(event) {
    is_drawing = true;
    context.beginPath();
    context.moveTo(event.clientX - canvas.offsetLeft, 
                   event.clientY - canvas.offsetTop);
    event.preventDefault(); // This lets default changes disappear
}

// draw function to follow up on the start event and start drawing within the canvas following the mouse:
function draw(event) {
    if(is_drawing) {
        context.lineTo(event.clientX - canvas.offsetLeft, 
                       event.clientY - canvas.offsetTop);
        context.strokeStyle = draw_color; 
        context.lineWidth = draw_width;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.stroke();
    }
    event.preventDefault();
}

// stop function that closes the drawing path and sets drawing to false to end the current drawing:
function stop(event) {
    if ( is_drawing) {
        context.stroke();
        context.closePath();
        is_drawing = false;
    }
    event.preventDefault();

 // this will save each stroke when complete and push it into the array to be used:
    if (event.type != 'mouseout') {
    restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
    index += 1;
    }
}

// clear canvas function that will reset to the canvas to the blank state:
function clear_canvas() {
    context.fillStyle = start_background_color;
    context.clearRect (0, 0, canvas.width, canvas.height);
    context.fillRect (0, 0, canvas.width, canvas.height);
// clears the array so the undo button is also reset to the next stroke:
    restore_array = [];
    index = -1;
}

// undo last action function that will use the restore_array and remove the most recent addition:
function undo_last() {
    if ( index <= 0) {
        clear_canvas();
    } else {
        index -= 1;
        restore_array.pop();
        context.putImageData(restore_array[index], 0, 0);
    }
}