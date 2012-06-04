var WIDTH = 800;
var HEIGHT = 600;

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

ctx.fillStyle = '#888';
ctx.fillRect(0, 0, 800, 800);
ctx.fillStyle = '#fff';
ctx.lineWidth = 2;

var w = 800 / WIDTH;
var h = 800 / HEIGHT;

function drawEllipse(cx, cy, width, height)
{
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(width / height, 1);
    ctx.beginPath();
    ctx.arc(0, 0, height/2, 0, Math.PI*2, false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, height/2, 0, Math.PI*2, false);
    ctx.stroke();
    ctx.restore();
}

function Drawable() {
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    return this;
}

var t = 0;

var figures = [];

var FIGURE_WIDTH = 300;
var FIGURE_HEIGHT = 200;


var LAYER_COUNT = 6;
var fillStyles = [
    "#aaa",
    "#939291",
    "#888786",
    "#797775",
    "#656565",
    "#494949",
];

var VELOCITY = [LAYER_COUNT*10+1];
var layerWidth = [];

function init() {
    // Set up parallax layers, starting with the closest ones
    var prevHeight = HEIGHT + FIGURE_HEIGHT/2;
    var scaleCoef = 1;
    for (var l = 0; l < LAYER_COUNT; ++l) {
        var total_width = 0;
        var i = 0;
        var list = [];
        var prevCoef = scaleCoef;
        scaleCoef /= 1.5;

        for (; total_width < WIDTH + FIGURE_WIDTH * 2; ++i) {
            var fig = new Drawable();

            fig.w = FIGURE_WIDTH * scaleCoef;
            fig.h = FIGURE_HEIGHT * scaleCoef;
            fig.x = total_width - fig.w / 2;
            fig.y = prevHeight - FIGURE_HEIGHT/2;

            total_width += fig.w - Math.random() * 15;
            list.push(fig);
            //initialX.push(Math.random() * WIDTH);
            //initialY.push(HEIGHT - Math.random() * HEIGHT / 2);
            //velocity.push(.9 + Math.random() * .2);
            //amplitude.push(10 + Math.random() * 10);
            //phase.push(Math.random());
            //frequency.push(.4 + Math.random() * .8);
        }
        prevHeight -= FIGURE_HEIGHT / 2.5 * scaleCoef;// * scaleCoef/1.62;
        figures.push(list);
        layerWidth.push(total_width);
        VELOCITY.push(VELOCITY[l] / 1.5);
    }
};

var draw = function() {
    ctx.fillStyle = '#666';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.fillStyle = '#aaa';
//    drawEllipse(elliX, elliY, 200, 120);
}

init();

function update(sign) {
    draw();

    t += .08;

    for (var l = LAYER_COUNT-1; l >= 0; --l) {
        ctx.fillStyle = fillStyles[l];
        var list = figures[l];
        for (var i = 0; i < list.length; ++i) {
            var fig = list[i];
            fig.x -= VELOCITY[l] / 10 * sign;
            if (fig.x < -fig.w/2)
                fig.x += layerWidth[l];
            if (fig.x > layerWidth[l] - fig.w/2)
                fig.x -= layerWidth[l];

            drawEllipse(fig.x, fig.y, fig.w, fig.h);
        }
    }

    ctx.fillStyle = '#fff';
    ctx.fillRect(100, HEIGHT  - (1 + Math.sin(t * 3)) * 20- 100, 50, 80);
};
/*
setInterval(function() {
}, 20);
*/

var LEFT_ARROW_KEY = 37;
var RIGHT_ARROW_KEY = 39;
window.addEventListener('keydown', function(evt) {
    if (evt.keyCode === LEFT_ARROW_KEY)
        update(-1);
    if (evt.keyCode === RIGHT_ARROW_KEY)
        update(1);
});
