const { animated } = require("react-spring");

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var drawRect = function (coords, fillColor, lineWidth, strokeColor, ctx) {
    var left = coords[0], top = coords[1], right = coords[2], bot = coords[3];
    ctx.current.fillStyle = fillColor;
    ctx.current.lineWidth = lineWidth;
    ctx.current.strokeStyle = strokeColor;
    ctx.current.strokeRect(left, top, right - left, bot - top);
    ctx.current.fillRect(left, top, right - left, bot - top);
};
var drawCircle = function (coords, fillColor, lineWidth, strokeColor, ctx) {
    ctx.current.fillStyle = fillColor;
    ctx.current.beginPath();
    ctx.current.lineWidth = lineWidth;
    ctx.current.strokeStyle = strokeColor;
    ctx.current.arc(coords[0], coords[1], coords[2], 0, 2 * Math.PI);
    ctx.current.closePath();
    ctx.current.stroke();
    ctx.current.fill();
};
var drawPoly = function (coords, fillColor, lineWidth, strokeColor, ctx) {
    var newCoords = coords.reduce(function (a, v, i, s) { return (i % 2 ? a : __spreadArray(__spreadArray([], a, true), [s.slice(i, i + 2)], false)); }, []);
    // const first = newCoords.unshift();
    ctx.current.fillStyle = fillColor;
    ctx.current.beginPath();
    ctx.current.lineWidth = lineWidth;
    ctx.current.strokeStyle = strokeColor;
    // ctx.current.moveTo(first[0], first[1]);
    newCoords.forEach(function (c) { return ctx.current.lineTo(c[0], c[1]); });
    ctx.current.closePath();
    ctx.current.stroke();
    ctx.current.fill();
};
var drawPlayer = function (coords,strokeColor, cosmeticId, id, ctx) {
    var newCoords = coords.reduce(function (a, v, i, s) { return (i % 2 ? a : __spreadArray(__spreadArray([], a, true), [s.slice(i, i + 2)], false)); }, []);
    // get mean of x and y
    var x = newCoords.reduce(function (a, v) { return a + v[0]; }, 0) / newCoords.length;
    var y = newCoords.reduce(function (a, v) { return a + v[1]; }, 0) / newCoords.length;
    var image = document.getElementById(id) || new Image();
    if (image.id === "") {
        image.id = id;
        document.getElementsByClassName('img-mapper-canvas')[0].appendChild(image);
        image.src = process.env.PUBLIC_URL + "/images/cosmetics/cosmetic_"+cosmeticId+".jpg"
        image.onload = () => {
            ctx.current.save()
            ctx.current.beginPath();
            ctx.current.arc(x, y, 15, 0, 2 * Math.PI);
            ctx.current.lineWidth = 3;
            ctx.current.strokeStyle = strokeColor;
            ctx.current.stroke();
            ctx.current.clip();
            ctx.current.drawImage(image, x-15, y-15, 30, 30);
            ctx.current.restore();
        }
    } else {
        ctx.current.save()
        ctx.current.beginPath();
        ctx.current.arc(x, y, 15, 0, 2 * Math.PI);
        ctx.current.lineWidth = 3;
        ctx.current.strokeStyle = strokeColor;
        ctx.current.stroke();
        ctx.current.clip();
        ctx.current.drawImage(image, x-15, y-15, 30, 30);
        ctx.current.restore();
    }
};
var callingFn = function (shape, coords, fillColor, lineWidth, strokeColor, isAreaActive, ctx, cosmeticId, id) {
    if (shape === 'rect' && isAreaActive) {
        return drawRect(coords, fillColor, lineWidth, strokeColor, ctx);
    }
    if (shape === 'circle' && isAreaActive) {
        return drawCircle(coords, fillColor, lineWidth, strokeColor, ctx);
    }
    if (shape === 'poly' && isAreaActive) {
        return drawPoly(coords, fillColor, lineWidth, strokeColor, ctx);
    }
    if (shape === 'player') {
        return drawPlayer(coords, strokeColor, cosmeticId, id, ctx);
    }
    return false;
};
exports.default = callingFn;
