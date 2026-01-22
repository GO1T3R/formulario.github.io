
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
const egg = document.querySelector('.egg');

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
            confirm.classList.add('show');

            setTimeout(() => {
                confirm.classList.remove('show');
                currentStep = 0;
                updateSteps();
            }, 6000);
        })
        .catch(() => {
            loading.style.display = 'none';
            alert('Error al enviar la encuesta');
        });

});
// NO uses .then(res => res.json())
// NO uses .catch()
// En no-cors no hay respuesta legible

