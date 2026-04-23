
/* ===========================
   UX CAROUSEL (dinámico por área)
   - Agrupa todas las secciones (`.ux-step`) en `allSteps`.
   - Construye `visibleSteps` según el área seleccionada.
   - Genera indicadores dinámicos en `.progress`.
=========================== */
const allSteps = Array.from(document.querySelectorAll('.ux-step'));
const progressContainer = document.querySelector('.progress');
const areaSelect = document.getElementById('areaSelect');
let visibleSteps = [];
let indicators = [];
let currentStep = 0;

function renderIndicators(count) {
    progressContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step';
        stepDiv.textContent = i + 1;
        progressContainer.appendChild(stepDiv);

        if (i < count - 1) {
            const line = document.createElement('div');
            line.className = 'line';
            progressContainer.appendChild(line);
        }
    }
    indicators = Array.from(progressContainer.querySelectorAll('.step'));
}

function buildVisibleSteps(area) {
    if (!area) {
        // por defecto, solo el primer paso (datos generales)
        visibleSteps = allSteps.filter(s => s.dataset.area === 'all');
    } else {
        visibleSteps = allSteps.filter(s => s.dataset.area === 'all' || s.dataset.area === area);
    }
    renderIndicators(visibleSteps.length);
    currentStep = 0;
    updateSteps();
}
function updateSteps() {
    allSteps.forEach(step => step.classList.remove('active'));

    visibleSteps.forEach((step, i) => {
        if (i === currentStep) {
            step.classList.add('active');
        }

        if (indicators[i]) {
            indicators[i].classList.toggle('active', i <= currentStep);
        }
    });
}


// Inicializar vista (sin área seleccionada)
buildVisibleSteps(areaSelect ? areaSelect.value : '');

document.addEventListener('click', e => {
    if (!e.target.classList.contains('next')) return;

    const currentStepEl = visibleSteps[currentStep];
    const requiredInputs = currentStepEl.querySelectorAll('input[required], select[required]');
    for (const input of requiredInputs) {
        if (!input.checkValidity()) {
            input.reportValidity();
            return;
        }
    }

    // Validar radio groups
    const radioGroups = [...currentStepEl.querySelectorAll('input[type="radio"]')]
        .reduce((groups, radio) => {
            groups[radio.name] = groups[radio.name] || [];
            groups[radio.name].push(radio);
            return groups;
        }, {});

    for (const group of Object.values(radioGroups)) {
        if (!group.some(r => r.checked)) {
            alert('Por favor selecciona una opción');
            return;
        }
    }


    currentStep = Math.min(currentStep + 1, visibleSteps.length - 1);
    updateSteps();
});

// Cambiar área -> reconstruir pasos
if (areaSelect) {
    areaSelect.addEventListener('change', () => {
        buildVisibleSteps(areaSelect.value);
    });
}

/* ===========================
   FORM SUBMIT
=========================== */
const form = document.getElementById('encuestaForm');
const loading = document.getElementById('loadingOverlay');
const confirm = document.getElementById('confirmMessage');
const confirmTextEl = document.querySelector('.confirm-text');

function activateConfirmMarker(autoShow = true) {
    const el = document.querySelector('.confirm-text');
    if (!el) return;
    el.classList.add('marker');
    if (autoShow) setTimeout(() => el.classList.add('show'), 60);
}

// activar efecto marcatexto al cargar la página (funciona si DOM ya está listo)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => activateConfirmMarker(true));
} else {
    activateConfirmMarker(true);
}
const egg = document.querySelector('.egg');
const loadingImg = document.getElementById('loadingImg');
const confirmImg = document.getElementById('confirmImg');
const companySelect = document.querySelector('select[name="empresa"]');

function setGifsForCompany(company) {
    if (!company) company = '';
    const key = company.toString().toLowerCase();
    // Map company -> {loading, confirm} using option values
    if (key === 'le_king_poulet') {
        if (loadingImg) loadingImg.src = 'https://iili.io/f4gv9Pp.gif'; // Le King Poulet cargando
        if (confirmImg) confirmImg.src = 'https://iili.io/fs15yRS.md.png'; // Le King Poulet adios https://iili.io/f4gvXOg.gif
    } else if (key === 'guillegg') {
        if (loadingImg) loadingImg.src = 'https://iili.io/f4gwWrX.gif'; // Guillegg cargando
        if (confirmImg) confirmImg.src = 'https://iili.io/fs1R1YN.png'; // Guillegg adios https://iili.io/f4gOTUF.gif
    } else if (key === 'corporativo') {
        if (loadingImg) loadingImg.src = 'https://iili.io/f4gyK4S.gif'; // Corporativo cargando
        if (confirmImg) confirmImg.src = 'https://iili.io/fs1TVTu.md.png'; // Corporativo adios
    } else {
        // default: huevo
        if (loadingImg) loadingImg.src = '/assets/cargando_huevo.gif';
        if (confirmImg) confirmImg.src = '/assets/listo_huevo.gif';
    }
}

// update GIFs when the user selects a company
if (companySelect) {
    companySelect.addEventListener('change', (e) => {
        setGifsForCompany(e.target.value);
    });
    // init on load based on current value
    setGifsForCompany(companySelect.value);
} else {
    // fallback init
    setGifsForCompany();
}

/* ===========================
   CONFETTI (simple, no deps)
   - launchConfetti(count): crea piezas de confeti con estilos aleatorios
   - clearConfetti(): remueve piezas y limpia timeouts
=========================== */
const _confettiTimeouts = new Set();
function launchConfetti(count = 80) {
    const colors = ['#FF7A7A', '#FFD96B', '#9EE493', '#7AD3FF', '#D39EFF', '#FFAB66'];
    const maxDuration = 3500; // ms

    for (let i = 0; i < count; i++) {
        const el = document.createElement('div');
        el.className = 'confetti-piece';
        const left = Math.random() * 100; // percent
        const color = colors[Math.floor(Math.random() * colors.length)];
        const rotate = Math.floor(Math.random() * 360);
        const dur = 1500 + Math.random() * (maxDuration - 1500); // 1.5s - max
        const delay = Math.random() * 300; // small stagger

        el.style.left = left + 'vw';
        el.style.background = color;
        el.style.transform = `rotate(${rotate}deg)`;
        el.style.animationDuration = dur + 'ms';
        el.style.animationDelay = delay + 'ms';

        document.body.appendChild(el);

        // programar limpieza individual
        const to = setTimeout(() => {
            if (el && el.parentNode) el.parentNode.removeChild(el);
            _confettiTimeouts.delete(to);
        }, dur + delay + 400);

        _confettiTimeouts.add(to);
    }
}

function clearConfetti() {
    // clear timeouts
    for (const t of Array.from(_confettiTimeouts)) {
        clearTimeout(t);
        _confettiTimeouts.delete(t);
    }
    // remove any remaining elements
    document.querySelectorAll('.confetti-piece').forEach(el => el.remove());
}

form.addEventListener('submit', e => {
    e.preventDefault();
    // mostrar overlay y reiniciar animación del huevo
    loading.style.display = 'flex';
    if (egg) {
        egg.classList.remove('run');
        void egg.offsetWidth; // forzar reflow para reiniciar animación
        egg.classList.add('run');
    }

    fetch(
        'https://script.google.com/macros/s/AKfycbyKXnmF2pqD6IHw1SM8PINlHwlhmQAHtqazW0IEpImRNgWMOUfZand5Uu-YBdoCIDitFw/exec',
        {
            method: 'POST',
            body: new FormData(form)
        }
    )
        .then(() => {
            form.reset();
            loading.style.display = 'none';
            if (egg) egg.classList.remove('run');
            // Mostrar confirmación en overlay y mantener hasta cierre manual
            confirm.classList.add('show');
            // activar efecto marcatexto en el texto de confirmación
            activateConfirmMarker(true);
            // lanzar confeti mientras la confirmación esté visible
            try { launchConfetti(90); } catch (err) { /* no bloquear si falla */ }
        })
        .catch(() => {
            loading.style.display = 'none';
            alert('Error al enviar la encuesta');
        });

});
    // Cerrar confirmación manualmente
    const confirmClose = document.querySelector('.confirm-close');
    if (confirmClose) {
        confirmClose.addEventListener('click', () => {
            confirm.classList.remove('show');
            // limpiar confeti activo
            try { clearConfetti(); } catch (err) { /* ignore */ }
            // remover efecto marcatexto
            if (confirmTextEl) confirmTextEl.classList.remove('show');
            currentStep = 0;
            updateSteps();
        });
    }
// NO uses .then(res => res.json())
// NO uses .catch()
// En no-cors no hay respuesta legible


// Marker
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".marker").forEach((el, i) => {
    setTimeout(() => el.classList.add("show"), i * 200);
  });
});

/* ===========================
     Reemplazar textos de rating por caritas coloreadas
     - Inserta un span.face en cada label de .rating según el value del input
     - Maneja el estado seleccionado (clase .selected)
     - Mantiene el texto original para accesibilidad en .option-text
=========================== */
function ratingValueToFace(value) {
    // normalizar
    const vRaw = String(value).trim();
    const v = vRaw.toLowerCase();

    // intentar parsear número (1-5)
    const n = parseFloat(vRaw.replace(',', '.'));
    if (!Number.isNaN(n)) {
        if (n <= 1) return {type: 'sad', cls: 'face--1'};
        if (n === 2) return {type: 'disappointed', cls: 'face--2'};
        if (n === 3) return {type: 'neutral', cls: 'face--3'};
        if (n === 4) return {type: 'smile', cls: 'face--4'};
        if (n >= 5) return {type: 'happy', cls: 'face--5'};
    }

    // valores textuales
    if (v === 'no' || v === 'n' || v === 'false') return {type: 'cross', cls: 'face--0'};
    if (v === 'si' || v === 's' || v === 'true' || v === 'yes') return {type: 'check', cls: 'face--yes'};
    if (v.includes('parcial') || v === '.5' || v === '0.5') return {type: 'half', cls: 'face--half'};

    // palabras de frecuencia / satisfacción heurísticas
    if (v.includes('malo') || v.includes('mala') || v.includes('nada') || v.includes('muy malo') ) return {type: 'sad', cls: 'face--1'};
    if (v.includes('regular') || v.includes('poco')) return {type: 'disappointed', cls: 'face--2'};
    if (v.includes('satis') || v.includes('a tiempo') || v.includes('ok')) return {type: 'neutral', cls: 'face--3'};
    if (v.includes('bueno') || v.includes('rapido') || v.includes('bien')) return {type: 'smile', cls: 'face--4'};
    if (v.includes('excelente') || v.includes('totalmente') || v.includes('si ')) return {type: 'happy', cls: 'face--5'};

    // fallback neutral
    return {type: 'dot', cls: 'face--neutral'};
}

// Determina tipo/cls según el número de opciones en un grupo
function getTypeForOption(inputValue, index, total) {
    if (total === 2) {
        // 2 opciones: primero = negativo (rojo), segundo = positivo (verde)
        return index === 0 ? {type: 'cross', cls: 'face--0'} : {type: 'happy', cls: 'face--5'};
    }
    if (total === 3) {
        // 3 opciones: 0 = rojo, 1 = neutral/amarillo, 2 = verde
        if (index === 0) return {type: 'cross', cls: 'face--0'};
        if (index === 1) return {type: 'neutral', cls: 'face--3'};
        return {type: 'happy', cls: 'face--5'};
    }
    // más de 3: mantener comportamiento actual intentando usar el value
    return ratingValueToFace(inputValue);
}

function initColoredFaces() {
    document.querySelectorAll('.rating').forEach(rating => {
        const labels = Array.from(rating.querySelectorAll('label'));
        labels.forEach(label => {
            const input = label.querySelector('input[type="radio"]');
            if (!input) return;

            // extraer el texto existente (si hay)
            const textNodes = Array.from(label.childNodes).filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
            const originalText = textNodes.map(n => n.textContent.trim()).join(' ').trim();

            // crear span.face y span.option-text
            const idx = labels.indexOf(label);
            const {type, cls} = getTypeForOption(input.value, idx, labels.length);
            const face = document.createElement('span');
            face.className = 'face ' + cls;
            face.setAttribute('aria-hidden', 'true');
            // crear icono SVG según tipo
            const svg = createFaceSVG(type);
            face.appendChild(svg);

            const hidden = document.createElement('span');
            hidden.className = 'option-text';
            hidden.textContent = originalText || input.value;

            // limpiar nodos de texto visibles para que solo quede el face
            textNodes.forEach(n => n.remove());

            // si ya existe un face, no duplicar
            if (!label.querySelector('.face')) {
                label.appendChild(face);
            }
            // asegurar que el texto accesible esté presente
            if (!label.querySelector('.option-text')) {
                label.appendChild(hidden);
            }

            // marcar label seleccionado según input
            const setSelected = () => {
                // remover selected en hermanos
                labels.forEach(l => l.classList.remove('selected'));
                if (input.checked) label.classList.add('selected');
            };

            // evento change
            input.addEventListener('change', setSelected);
            // estado inicial
            if (input.checked) label.classList.add('selected');
        });
    });
}

// inicializar caritas tras DOM listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initColoredFaces);
} else {
    initColoredFaces();
}

/* Crear elementos SVG simples para cada tipo de cara/icono
     Usa stroke/fill con `currentColor` para adaptar al color de la .face
*/
function createFaceSVG(type) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '20');
    svg.setAttribute('height', '20');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-hidden', 'true');

    // ojos (dos círculos)
    const leftEye = document.createElementNS(ns, 'circle');
    leftEye.setAttribute('cx', '8');
    leftEye.setAttribute('cy', '9');
    leftEye.setAttribute('r', '1.2');
    leftEye.setAttribute('fill', 'currentColor');

    const rightEye = document.createElementNS(ns, 'circle');
    rightEye.setAttribute('cx', '16');
    rightEye.setAttribute('cy', '9');
    rightEye.setAttribute('r', '1.2');
    rightEye.setAttribute('fill', 'currentColor');

    svg.appendChild(leftEye);
    svg.appendChild(rightEye);

    const nsEl = (name) => document.createElementNS(ns, name);

    if (type === 'sad') {
        const mouth = nsEl('path');
        mouth.setAttribute('d', 'M7 15c2-3 6-3 8 0');
        mouth.setAttribute('stroke', 'currentColor');
        mouth.setAttribute('stroke-width', '1.6');
        mouth.setAttribute('fill', 'none');
        mouth.setAttribute('stroke-linecap', 'round');
        svg.appendChild(mouth);
    } else if (type === 'disappointed') {
        const mouth = nsEl('path');
        mouth.setAttribute('d', 'M7 15c2-1.8 6-1.8 8 0');
        mouth.setAttribute('stroke', 'currentColor');
        mouth.setAttribute('stroke-width', '1.6');
        mouth.setAttribute('fill', 'none');
        mouth.setAttribute('stroke-linecap', 'round');
        svg.appendChild(mouth);
    } else if (type === 'neutral') {
        const mouth = nsEl('line');
        mouth.setAttribute('x1', '8');
        mouth.setAttribute('y1', '15');
        mouth.setAttribute('x2', '16');
        mouth.setAttribute('y2', '15');
        mouth.setAttribute('stroke', 'currentColor');
        mouth.setAttribute('stroke-width', '1.6');
        mouth.setAttribute('stroke-linecap', 'round');
        svg.appendChild(mouth);
    } else if (type === 'smile' || type === 'happy') {
        const mouth = nsEl('path');
        mouth.setAttribute('d', 'M7 13c2 2.5 6 2.5 10 0');
        mouth.setAttribute('stroke', 'currentColor');
        mouth.setAttribute('stroke-width', '1.6');
        mouth.setAttribute('fill', 'none');
        mouth.setAttribute('stroke-linecap', 'round');
        svg.appendChild(mouth);
    } else if (type === 'check') {
        const check = nsEl('path');
        check.setAttribute('d', 'M6 12l3 3 6-6');
        check.setAttribute('stroke', 'currentColor');
        check.setAttribute('stroke-width', '1.6');
        check.setAttribute('fill', 'none');
        check.setAttribute('stroke-linecap', 'round');
        check.setAttribute('stroke-linejoin', 'round');
        svg.appendChild(check);
    } else if (type === 'cross') {
        const l1 = nsEl('path');
        l1.setAttribute('d', 'M7 7l10 10');
        l1.setAttribute('stroke', 'currentColor');
        l1.setAttribute('stroke-width', '1.6');
        l1.setAttribute('stroke-linecap', 'round');
        const l2 = nsEl('path');
        l2.setAttribute('d', 'M17 7l-10 10');
        l2.setAttribute('stroke', 'currentColor');
        l2.setAttribute('stroke-width', '1.6');
        l2.setAttribute('stroke-linecap', 'round');
        svg.appendChild(l1);
        svg.appendChild(l2);
    } else if (type === 'half') {
        const mouth = nsEl('path');
        mouth.setAttribute('d', 'M7 15c2-1 6-1 8 0');
        mouth.setAttribute('stroke', 'currentColor');
        mouth.setAttribute('stroke-width', '1.6');
        mouth.setAttribute('fill', 'none');
        mouth.setAttribute('stroke-linecap', 'round');
        svg.appendChild(mouth);
    } else {
        const dot = nsEl('circle');
        dot.setAttribute('cx', '12');
        dot.setAttribute('cy', '15');
        dot.setAttribute('r', '1.6');
        dot.setAttribute('fill', 'currentColor');
        svg.appendChild(dot);
    }

    return svg;
}

