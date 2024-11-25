const canvas = document.getElementById('dotCanvas');
const ctx = canvas.getContext('2d');

let points = generateOrderedPoints(10);
let currentPoint = 0;
let selectedPoints = [];

function generateOrderedPoints(numPoints) {
    const newPoints = [];
    const margin = 20;
    for (let i = 0; i < numPoints; i++) {
        newPoints.push({
            x: Math.random() * (canvas.width - 2 * margin) + margin,
            y: Math.random() * (canvas.height - 2 * margin) + margin
        });
    }
    return newPoints;
}

function drawPoints() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    points.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    });
}

function drawLines() {
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    for (let i = 1; i < points.length; i++) {
        ctx.moveTo(points[i - 1].x, points[i - 1].y);
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.closePath();
}

function highlightPoint(point) {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.fillStyle = 'white';
}

function connectPoints(x, y) {
    let closestPoint = null;
    let minDistance = Infinity;

    points.forEach(point => {
        const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
        if (distance < minDistance) {
            minDistance = distance;
            closestPoint = point;
        }
    });

    if (minDistance < 10) {
        if (selectedPoints.includes(closestPoint)) {
            selectedPoints = selectedPoints.filter(p => p !== closestPoint);
            currentPoint--;
        } else {
            selectedPoints.push(closestPoint);
            highlightPoint(closestPoint);
            currentPoint++;
        }
        drawPoints();
        drawSelectedLines();
        if (currentPoint === points.length) {
            alert('You completed the picture!');
            points = generateOrderedPoints(10);
            currentPoint = 0;
            selectedPoints = [];
            drawPoints();
        }
    } else {
        alert('Incorrect click! Try again.');
    }
}

function drawSelectedLines() {
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    for (let i = 1; i < selectedPoints.length; i++) {
        ctx.moveTo(selectedPoints[i - 1].x, selectedPoints[i - 1].y);
        ctx.lineTo(selectedPoints[i].x, selectedPoints[i].y);
    }
    ctx.stroke();
    ctx.closePath();
}

function enableClick() {
    canvas.addEventListener('click', handleClick);
}

function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (x >= 0 && x <= canvas.width && y >= 0 && y <= canvas.height) {
        connectPoints(x, y);
    } else {
        alert('Click inside the canvas!');
    }
}

drawPoints();
enableClick();
