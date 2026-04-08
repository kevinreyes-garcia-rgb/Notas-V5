const staff = document.getElementById('staff-lines');
let currentInstrument = 'guitar';

// Configuración de instrumentos (número de líneas)
const instConfig = {
    guitar: 6,
    bass: 4,
    piano: 5,
    drums: 4
};

// 1. Cambiar instrumento y redibujar líneas
function setInstrument(type) {
    currentInstrument = type;
    
    // Actualizar botones
    document.querySelectorAll('.inst-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.innerText.toLowerCase().includes(type)) btn.classList.add('active');
    });

    drawLines();
}

// 2. Dibujar las líneas según el instrumento
function drawLines() {
    staff.innerHTML = ''; // Limpiar
    const numLines = instConfig[currentInstrument];
    const spacing = 180 / (numLines + 1);

    for (let i = 1; i <= numLines; i++) {
        const line = document.createElement('div');
        line.className = 'line';
        line.style.top = `${i * spacing}px`;
        staff.appendChild(line);
    }
}

// 3. Función para poner nota (funciona en PC y Android)
function handleAction(e) {
    e.preventDefault();
    
    // Obtener coordenadas ya sea de Touch o Mouse
    const rect = staff.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Ajustar la nota a la línea más cercana (Magnetismo)
    const numLines = instConfig[currentInstrument];
    const spacing = 180 / (numLines + 1);
    const lineIndex = Math.round(y / spacing);
    const finalY = lineIndex * spacing;

    // Limitar para que no pongan notas fuera del rango
    if (lineIndex > 0 && lineIndex <= numLines) {
        createNote(x, finalY);
    }
}

function createNote(x, y) {
    const note = document.createElement('div');
    note.className = 'note-dot';
    note.style.left = `${x}px`;
    note.style.top = `${y}px`;
    
    // Si tocas una nota existente, se borra
    note.onclick = (e) => { e.stopPropagation(); note.remove(); };
    note.ontouchstart = (e) => { e.stopPropagation(); note.remove(); };

    staff.appendChild(note);
    beep();
}

// Eventos para PC y Android
staff.addEventListener('mousedown', handleAction);
staff.addEventListener('touchstart', handleAction);

// 4. Utilidades
function clearAll() {
    drawLines();
}

function beep() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220 + (Math.random() * 200), ctx.currentTime);
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
}

function play() {
    alert("Iniciando secuencia rítmica...");
    // Aquí podrías añadir un scroll animado
}

// Iniciar con guitarra
drawLines();
