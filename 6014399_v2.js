let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let inicio = 50;
let tamaño = 400;
let paso = 40;

//dibuja un punto en el canvas
function drawPoint(ctx, x, y, size) {
    ctx.fillRect(x - size / 2, y - size / 2, size, size);
}

//convierte coordenadas del canvas a plano cartesiano 
function canvasToCartesiana(p1) {
    return [p1.x, height - p1.y];
}
//dibuja la cuadrícula y los números de los ejes
function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeRect(inicio, inicio, tamaño, tamaño);
    ctx.font = "12px Arial";

    for (let i = 0; i <= tamaño; i += paso) {
        // líneas verticales
        ctx.beginPath();
        ctx.moveTo(inicio + i, inicio);
        ctx.lineTo(inicio + i, inicio + tamaño);
        ctx.stroke();

        // líneas horizontales
        ctx.beginPath();
        ctx.moveTo(inicio, inicio + i);
        ctx.lineTo(inicio + tamaño, inicio + i);
        ctx.stroke();

        // números eje X
        ctx.fillText(i / paso, inicio + i - 5, inicio + tamaño + 15);

        // números eje Y
        ctx.fillText((tamaño - i) / paso, inicio - 20, inicio + i + 5);
    }
}
//convierte coordenadas del plano a posición del canvas
function convertX(x) {
    return inicio + x * paso;
}

function convertY(y) {
    return inicio + tamaño - y * paso;
}
//verifica si los tres puntos forman un triángulo
function esTriangulo(x1, y1, x2, y2, x3, y3) {
    //verifica que ambas rectas sean verticales
    if ((x2 == x1) && (x3 == x1)) return false;
    //cuando una recta es vertical, las pendientes no pueden ser iguales
    if ((x2 == x1) || (x3 == x1)) return true;
    //si ninguna es vertical, la pendiente se calcula normal
    let m1 = (y2 - y1) / (x2 - x1);
    let m2 = (y3 - y1) / (x3 - x1);
    return m1 !== m2;
}
//algoritmo DDA usa incrementos pequeños para aproximar la línea
function drawDDA(x1, y1, x2, y2, size) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    let pasos = Math.max(Math.abs(dx), Math.abs(dy));
    let xinc = dx / pasos;
    let yinc = dy / pasos;
    let x = x1;
    let y = y1;

    for (let i = 0; i <= pasos; i++) {
        drawPoint(ctx, Math.round(x), Math.round(y), size);
        x += xinc;
        y += yinc;
    }
}
//algoritmo Bresenham usa solo números enteros y decide qué pixel usar 
function drawBresenham(x1, y1, x2, y2, size) {
    let dx = Math.abs(x2 - x1);
    let dy = Math.abs(y2 - y1);
    let sx = (x1 < x2) ? 1 : -1;
    let sy = (y1 < y2) ? 1 : -1;
    let err = dx - dy;
    while (true) {
        drawPoint(ctx, x1, y1, size);
        if (x1 == x2 && y1 == y2) break;
        let e2 = 2 * err;
        if (e2 > -dy) {err -= dy; x1 += sx;}
        if (e2 < dx) {err += dx; y1 += sy;}
    }
}
//función general para dibujar línea
function drawLine(x1, y1, x2, y2, size, method) {
    (method === "dda" ? drawDDA : drawBresenham)(x1, y1, x2, y2, size);
}
//función principal del programa
function crearTriangulo() {
    let x1 = parseInt(document.getElementById("x1").value);
    let y1 = parseInt(document.getElementById("y1").value);
    let x2 = parseInt(document.getElementById("x2").value);
    let y2 = parseInt(document.getElementById("y2").value);
    let x3 = parseInt(document.getElementById("x3").value);
    let y3 = parseInt(document.getElementById("y3").value);
    let metodo = document.getElementById("metodo").value;
    let grosor = parseInt(document.getElementById("grosor").value);
    let mensaje = document.getElementById("mensaje");

    //verifica si se forma un triángulo
    if (!esTriangulo(x1, y1, x2, y2, x3, y3)) {
        mensaje.innerHTML = "Los puntos están alineados, no se forma el triángulo";
        return;
    }
    mensaje.innerHTML = "Sí se forma un triángulo";
    //dibuja la cuadrícula
    drawGrid();
    //convierte las coordenadas del canvas
    let cx1 = convertX(x1);
    let cy1 = convertY(y1);
    let cx2 = convertX(x2);
    let cy2 = convertY(y2);
    let cx3 = convertX(x3);
    let cy3 = convertY(y3);

    //uso de la función canvasToCartesiana
    let p1Canvas = {
        x: cx1,
        y: cy1
    };
    let p1Cart = canvasToCartesiana(p1Canvas, canvas.height);
    //dibuja las líneas
    drawLine(cx1, cy1, cx2, cy2, grosor, metodo);
    drawLine(cx2, cy2, cx3, cy3, grosor, metodo);
    drawLine(cx3, cy3, cx1, cy1, grosor, metodo);
}
//limpia el canvas
function limpiarCanvas() {
    drawGrid();
    document.getElementById("mensaje").innerHTML = "";
}
//dibuja la cuadrícula
drawGrid();