let fields = [null, null, null, null, null, null, null, null, null];
let currentPlayer = "circle"; // 'circle' beginnt

function init() {
    render();
}

function render() {
    const contentDiv = document.getElementById("content");
    const table = document.createElement("table");
    for (let i = 0; i < 3; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < 3; j++) {
            const cell = document.createElement("td");
            const index = i * 3 + j;
            if (fields[index]) {
                cell.innerHTML = fields[index] === "circle" ? generateAnimatedCircleSVG() : generateAnimatedCrossSVG();
            }
            cell.addEventListener("click", function () {
                handleCellClick(cell, index);
            });
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    contentDiv.innerHTML = "";
    if (currentPlayer == "circle") {
        whoIsPlaying("circle");
    } else {
        whoIsPlaying("cross");
    }
    contentDiv.appendChild(table);
}

function handleCellClick(cell, index) {
    if (!fields[index]) {
        fields[index] = currentPlayer;
        cell.innerHTML = currentPlayer === "circle" ? generateAnimatedCircleSVG() : generateAnimatedCrossSVG();
        cell.removeEventListener("click", handleCellClick);
        currentPlayer = currentPlayer === "circle" ? "cross" : "circle";
        if (currentPlayer == "circle") {
            whoIsPlaying("circle");
        } else {
            whoIsPlaying("cross");
        }
        checkForGameEnd();
    }
}

function whoIsPlaying(string){
    const contentDiv = document.getElementById("content");
    const notificationDiv = document.createElement("div");
    notificationDiv.classList.add("notification");
    const svgSymbol = string === "circle" ? generateAnimatedCircleSVG() : generateAnimatedCrossSVG();
    contentDiv.appendChild(notificationDiv);
    const text = document.createElement("p");
    text.innerHTML = `
            <div class = "center">
                <div style="transform: scale(0.5);">${svgSymbol}</div> 
                <div> ist am Zug!</div>
            </div>`;
    notificationDiv.appendChild(text);
}

function checkForGameEnd() {
    // Gewinnkombinationen (Indexe der Zellen, die einen Gewinn ergeben)
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], // Horizontale Reihen
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], // Vertikale Reihen
        [0, 4, 8],
        [2, 4, 6], // Diagonale Reihen
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (fields[a] && fields[a] === fields[b] && fields[a] === fields[c]) {
            // Ein Spieler hat gewonnen
            drawWinningLine(a, c); // Zeichne die siegreiche Linie
            congratulateWinner(fields[a]);
            return;
        }
    }

    if (fields.every((cell) => cell)) {           // Überprüfen, ob das Spielfeld voll ist (Unentschieden)
        const contentDiv = document.getElementById("content");
        const notificationDiv = document.createElement("div");
        notificationDiv.classList.add("notification");
        contentDiv.appendChild(notificationDiv);
        const text = document.createElement("p");
        text.innerHTML = `<div class = "center">${scaleCircleSVG()} Unentschieden ${scaleCrossSVG()} </div>`;
        notificationDiv.appendChild(text);
    }
}

function scaleCrossSVG() {
    // Fügen Sie die Skalierung zur "transform"-Eigenschaft des SVG-HTML-Texts hinzu
    return `<div style="transform: scale(0.5);">${generateAnimatedCrossSVG()}</div>`;
}

function scaleCircleSVG() {
    // Fügen Sie die Skalierung zur "transform"-Eigenschaft des SVG-HTML-Texts hinzu
    return `<div style="transform: scale(0.5);">${generateAnimatedCircleSVG()}</div>`;
}

function congratulateWinner(player) {
    const contentDiv = document.getElementById("content");
    // Erstelle ein DIV-Element für die Benachrichtigung
    const notificationDiv = document.createElement("div");
    notificationDiv.classList.add("notification");
    // Erzeuge das SVG-Symbol für den Gewinner
    const svgSymbol = player === "circle" ? generateAnimatedCircleSVG() : generateAnimatedCrossSVG();
    // Füge die Benachrichtigung in den DIV-Container ein
    contentDiv.appendChild(notificationDiv);
    // Benachrichtigungstext hinzufügen
    const text = document.createElement("p");
    text.innerHTML = `
            <div class = "center">
                <div style="transform: scale(0.5);">${svgSymbol}</div> 
                <div> hat gewonnen!</div>
            </div>`;
    notificationDiv.appendChild(text);
}

function resetGame() {
    fields = [null, null, null, null, null, null, null, null, null];
    render();
}

function drawWinningLine(startIndex, endIndex) {
    const contentDiv = document.getElementById("content");
    const cellSize = 105.04;

    const startRow = Math.floor(startIndex / 3);
    const startCol = startIndex % 3;
    const endRow = Math.floor(endIndex / 3);
    const endCol = endIndex % 3;

    // Erstellen Sie das SVG-Element für die siegreiche Linie
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", cellSize * 3);
    svg.setAttribute("height", cellSize * 3);
    svg.classList.add("winning-line");

    // Zeichnen Sie die Linie
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", (startCol + 0.5) * cellSize);
    line.setAttribute("y1", (startRow + 0.5) * cellSize);
    line.setAttribute("x2", (endCol + 0.5) * cellSize);
    line.setAttribute("y2", (endRow + 0.5) * cellSize);
    line.setAttribute("stroke", "white");
    line.setAttribute("stroke-width", "5");

    svg.appendChild(line);
    contentDiv.appendChild(svg);
}

function generateAnimatedCircleSVG() {
    const size = 70;
    const color = "#00B0EF";
    const svgHTML = `
        <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
            <circle cx="${size / 2}" cy="${size / 2}" r="${
        size / 2 - 4
    }" fill="transparent" stroke="${color}" stroke-width="8" stroke-dasharray="0, 440">
                <animate attributeName="stroke-dasharray" from="0, 440" to="440, 0" dur="500ms" begin="0s" fill="freeze" />
            </circle>
        </svg>
    `;
    return svgHTML;
}

function generateAnimatedCrossSVG() {
    //xmlns="http://www.w3.org/2000/svg"
    const size = 70;
    const color = "#FFC000";
    const svgHTML = `
        <svg width="${size}" height="${size}"           >               
            <line x1="0" y1="0" x2="${size}" y2="${size}" stroke="${color}" stroke-width="8" >
                <animate attributeName="opacity" from="0" to="1" dur="0.5s" />
                <animate attributeName="x1" from="0" to="${size}" dur="0s" />
                <animate attributeName="y1" from="0" to="${size}" dur="0s" />
            </line>
            <line x1="${size}" y1="0" x2="0" y2="${size}" stroke="${color}" stroke-width="8" >
                <animate attributeName="opacity" from="0" to="1" dur="0.5s" />
                <animate attributeName="x1" from="${size}" to="0" dur="0s" />
                <animate attributeName="y1" from="0" to="${size}" dur="0s" />
            </line>
        </svg>
    `;
    return svgHTML;
}
