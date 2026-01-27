
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
        if (confirmImg) confirmImg.src = 'https://iili.io/f6cCUDN.md.jpg'; // Le King Poulet adios https://iili.io/f4gvXOg.gif
    } else if (key === 'guillegg') {
        if (loadingImg) loadingImg.src = 'https://iili.io/f4gwWrX.gif'; // Guillegg cargando
        if (confirmImg) confirmImg.src = 'https://iili.io/f6cKvZF.png'; // Guillegg adios https://iili.io/f4gOTUF.gif
    } else if (key === 'corporativo') {
        if (loadingImg) loadingImg.src = 'https://iili.io/f4gyK4S.gif'; // Corporativo cargando
        if (confirmImg) confirmImg.src = 'https://iili.io/f4iS0IS.gif'; // Corporativo adios
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

