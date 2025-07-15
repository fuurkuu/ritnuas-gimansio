// Estado de la aplicación
let currentObjective = null;
let selectedDays = [];
let currentRoutine = null;
let currentUser = null;
let isLoggedIn = false;

// Función para marcar el día como cumplido
function markDayAsComplete() {
    if (!isLoggedIn || !currentUser) {
        showMessage('Debes iniciar sesión para marcar días como cumplidos', 'error');
        return;
    }
    
    const today = new Date().toDateString();
    
    // Verificar si ya se marcó el día de hoy
    if (currentUser.completedDays && currentUser.completedDays.includes(today)) {
        showMessage('¡Ya has marcado el día de hoy como cumplido!', 'info');
        return;
    }
    
    // Inicializar array si no existe
    if (!currentUser.completedDays) {
        currentUser.completedDays = [];
    }
    
    // Añadir el día de hoy
    currentUser.completedDays.push(today);
    
    // Actualizar el streak
    updateStreak();
    
    // Guardar en localStorage
    saveUserData();
    
    // Actualizar UI
    updateDashboardStats();
    
    showMessage('¡Día marcado como cumplido! 🎉', 'success');
}

// Función para calcular el streak de días consecutivos
function updateStreak() {
    if (!currentUser || !currentUser.completedDays) {
        currentUser.stats.currentStreak = 0;
        return;
    }
    
    const completedDays = currentUser.completedDays.sort((a, b) => new Date(b) - new Date(a));
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < completedDays.length; i++) {
        const completedDate = new Date(completedDays[i]);
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);
        
        // Verificar si es el día consecutivo esperado
        if (completedDate.toDateString() === expectedDate.toDateString()) {
            streak++;
        } else {
            break;
        }
    }
    
    currentUser.stats.currentStreak = streak;
}

// Función para guardar datos del usuario
function saveUserData() {
    if (currentUser) {
        const success = saveUser(currentUser);
        if (success) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    }
}

// Base de datos de ejercicios
const exerciseDatabase = {
    chest: [
        { name: 'Press de banca', icon: 'PE', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=rT7DgCr-3pg' },
        { name: 'Flexiones', icon: 'PE', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
        { name: 'Press inclinado', icon: 'PE', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=IP8uyAPLcfw' },
        { name: 'Aperturas con mancuernas', icon: 'PE', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=eozdVDA78K0' },
        { name: 'Fondos en paralelas', icon: 'PE', difficulty: 'advanced', tutorial: 'https://www.youtube.com/watch?v=2z8JmcrW-As' },
        { name: 'Press con mancuernas', icon: 'PE', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=QsYre__-aro' },
        { name: 'Cruces en polea', icon: 'PE', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=taI4XduLpTk' },
        { name: 'Press declinado', icon: 'PE', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=Lj8XDFRLvZk' }
    ],
    back: [
        { name: 'Dominadas', icon: 'ES', difficulty: 'advanced', tutorial: 'https://www.youtube.com/watch?v=eGo4IYlbE5g' },
        { name: 'Remo con barra', icon: 'ES', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=foa7vSfnJtE' },
        { name: 'Jalones al pecho', icon: 'ES', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=JgeGBU5h9hI' },
        { name: 'Remo con mancuernas', icon: 'ES', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=pYcpY20QaE8' },
        { name: 'Peso muerto', icon: 'ES', difficulty: 'advanced', tutorial: 'https://www.youtube.com/watch?v=ytGaGIn3SjE' },
        { name: 'Remo en polea baja', icon: 'ES', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=xQNrFHEMhI4' },
        { name: 'Pullover', icon: 'ES', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=J2mALzEqNjY' },
        { name: 'Face pulls', icon: 'ES', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=rep-qVOkqgk' }
    ],
    triceps: [
        { name: 'Press francés', icon: 'TR', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=d_KZxkY_0cM' },
        { name: 'Extensiones en polea', icon: 'TR', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=2-LAMcpzODU' },
        { name: 'Fondos en banco', icon: 'TR', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=6kALZikXxLc' },
        { name: 'Patadas de tríceps', icon: 'TR', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=B4-VULqOxNQ' },
        { name: 'Press cerrado', icon: 'TR', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=nEF0bv2FW94' },
        { name: 'Extensiones sobre cabeza', icon: 'TR', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=nRiJVZDpdL0' }
    ],
    biceps: [
        { name: 'Curl con barra', icon: 'BI', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo' },
        { name: 'Curl con mancuernas', icon: 'BI', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo' },
        { name: 'Curl martillo', icon: 'BI', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=zC3nLlEvin4' },
        { name: 'Curl en polea', icon: 'BI', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=kwG2ipFRgfo' },
        { name: 'Curl concentrado', icon: 'BI', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=0AUGkch3tzI' },
        { name: 'Curl 21s', icon: 'BI', difficulty: 'advanced', tutorial: 'https://www.youtube.com/watch?v=7sHdKJrJzSw' }
    ],
    legs: [
        { name: 'Sentadillas', icon: 'PI', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=YaXPRqUwItQ' },
        { name: 'Prensa de piernas', icon: 'PI', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ' },
        { name: 'Peso muerto rumano', icon: 'PI', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=jEy_czb3RKA' },
        { name: 'Zancadas', icon: 'PI', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=D7KaRcUTQeE' },
        { name: 'Extensiones de cuádriceps', icon: 'PI', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=YyvSfVjQeL0' },
        { name: 'Curl femoral', icon: 'PI', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=ELOCsoDSmrg' },
        { name: 'Sentadilla búlgara', icon: 'PI', difficulty: 'advanced', tutorial: 'https://www.youtube.com/watch?v=2C-uNgKwPLE' },
        { name: 'Elevaciones de gemelos', icon: 'PI', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=gwLzBJYoWlI' }
    ],
    abs: [
        { name: 'Crunches', icon: 'AB', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=Xyd_fa5zoEU' },
        { name: 'Plancha', icon: 'AB', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=ASdvN_XEl_c' },
        { name: 'Bicycle crunches', icon: 'AB', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=9FGilxCbdz8' },
        { name: 'Mountain climbers', icon: 'AB', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=nmwgirgXLYM' },
        { name: 'Russian twists', icon: 'AB', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=wkD8rjkodUI' },
        { name: 'Elevaciones de piernas', icon: 'AB', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=JB2oyawG9KI' },
        { name: 'Dead bug', icon: 'AB', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=hlaHGn5CFNI' },
        { name: 'Hollow body hold', icon: 'AB', difficulty: 'advanced', tutorial: 'https://www.youtube.com/watch?v=LlDNef_Ztsc' }
    ],
    shoulders: [
        { name: 'Press militar', icon: 'HO', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=qEwKCR5JCog' },
        { name: 'Elevaciones laterales', icon: 'HO', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=3VcKaas9EgY' },
        { name: 'Elevaciones frontales', icon: 'HO', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=qEwKCR5JCog' },
        { name: 'Press con mancuernas', icon: 'HO', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=qEwKCR5JCog' },
        { name: 'Remo al mentón', icon: 'HO', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=095PGVvA-wU' },
        { name: 'Pájaro', icon: 'HO', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=rep-qVOkqgk' },
        { name: 'Arnold press', icon: 'HO', difficulty: 'advanced', tutorial: 'https://www.youtube.com/watch?v=6Z15_WdXmVw' }
    ],
    cardio: [
        { name: 'Burpees', icon: 'CA', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=818SkLY1KDF' },
        { name: 'Jumping jacks', icon: 'CA', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=iSSAk4XCsRA' },
        { name: 'High knees', icon: 'CA', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=8opcQdC-V-U' },
        { name: 'Correr en el lugar', icon: 'CA', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=30hFXaQ6ul8' },
        { name: 'Escaladores', icon: 'CA', difficulty: 'intermediate', tutorial: 'https://www.youtube.com/watch?v=nmwgirgXLYM' },
        { name: 'Saltos de tijera', icon: 'CA', difficulty: 'beginner', tutorial: 'https://www.youtube.com/watch?v=c4DAnQ6DtF8' },
        { name: 'Sprint intervals', icon: 'CA', difficulty: 'advanced', tutorial: 'https://www.youtube.com/watch?v=0xBS-a-8n-8' }
    ]
};

// Configuración de rutinas por objetivo
const routineConfig = {
    'weight-loss': {
        name: 'Pérdida de Peso',
        icon: 'PP',
        sets: { min: 3, max: 4 },
        reps: { min: 12, max: 20 },
        rest: { min: 30, max: 60 },
        cardioTime: 20,
        focus: 'cardio'
    },
    'muscle-gain': {
        name: 'Ganancia Muscular',
        icon: 'GM',
        sets: { min: 3, max: 5 },
        reps: { min: 6, max: 12 },
        rest: { min: 60, max: 90 },
        cardioTime: 10,
        focus: 'strength'
    },
    'maintenance': {
        name: 'Mantenimiento',
        icon: 'MA',
        sets: { min: 3, max: 4 },
        reps: { min: 8, max: 15 },
        rest: { min: 45, max: 75 },
        cardioTime: 15,
        focus: 'balanced'
    }
};

// Configuración de días de entrenamiento
const dayConfig = {
    1: [{ muscle: 'fullbody', name: 'Cuerpo completo', icon: 'CC' }],
    2: [
        { muscle: 'upper', name: 'Tren superior', icon: 'TS' },
        { muscle: 'lower', name: 'Tren inferior', icon: 'TI' }
    ],
    3: [
        { muscle: 'chest_triceps', name: 'Pecho y tríceps', icon: 'PT' },
        { muscle: 'back_biceps', name: 'Espalda y bíceps', icon: 'EB' },
        { muscle: 'legs_abs', name: 'Piernas y abdomen', icon: 'PA' }
    ],
    4: [
        { muscle: 'chest_triceps', name: 'Pecho y tríceps', icon: 'PT' },
        { muscle: 'back_biceps', name: 'Espalda y bíceps', icon: 'EB' },
        { muscle: 'legs', name: 'Piernas', icon: 'PI' },
        { muscle: 'shoulders_abs', name: 'Hombros y abdomen', icon: 'HA' }
    ],
    5: [
        { muscle: 'chest_triceps', name: 'Pecho y tríceps', icon: 'PT' },
        { muscle: 'back_biceps', name: 'Espalda y bíceps', icon: 'EB' },
        { muscle: 'legs_abs', name: 'Piernas y abdomen', icon: 'PA' },
        { muscle: 'shoulders_cardio', name: 'Hombros y cardio', icon: 'HC' },
        { muscle: 'fullbody', name: 'Cuerpo completo', icon: 'CC' }
    ]
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Mensaje de bienvenida y debug
    console.log('🏋️ Aplicación de Gimnasio iniciada');
    console.log('📝 Funciones de debug disponibles:');
    console.log('   - debugUsers() - Ver todos los usuarios');
    console.log('   - clearAllUsers() - Limpiar todos los usuarios');
    
    initializeApp();
});

function initializeApp() {
    // Configurar tema
    initializeTheme();
    
    // Event listeners
    setupEventListeners();
    
    // Sistema de autenticación
    setupAuthSystem();
    
    // Cargar preferencias guardadas
    loadUserPreferences();
}

function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', toggleTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function setupEventListeners() {
    // Botones de objetivo
    document.querySelectorAll('.objective-btn').forEach(btn => {
        btn.addEventListener('click', () => selectObjective(btn.dataset.objective));
    });
    
    // Botones de días
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.addEventListener('click', () => toggleDay(btn.dataset.day));
    });
    
    // Botón generar rutina
    document.getElementById('generateRoutine').addEventListener('click', generateRoutine);
    
    // Botón regenerar
    document.getElementById('regenerateBtn').addEventListener('click', regenerateRoutine);
    
    // Botón descargar PDF
    document.getElementById('downloadBtn').addEventListener('click', downloadPDF);
}

function selectObjective(objective) {
    currentObjective = objective;
    
    // Actualizar UI
    document.querySelectorAll('.objective-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelector(`[data-objective="${objective}"]`).classList.add('active');
    
    // Guardar preferencia
    localStorage.setItem('selectedObjective', objective);
    
    validateForm();
}

function toggleDay(day) {
    const dayBtn = document.querySelector(`[data-day="${day}"]`);
    
    if (selectedDays.includes(day)) {
        selectedDays = selectedDays.filter(d => d !== day);
        dayBtn.classList.remove('active');
    } else {
        selectedDays.push(day);
        dayBtn.classList.add('active');
    }
    
    // Guardar preferencia
    localStorage.setItem('selectedDays', JSON.stringify(selectedDays));
    
    validateForm();
}

function validateForm() {
    const generateBtn = document.getElementById('generateRoutine');
    const isValid = currentObjective && selectedDays.length > 0;
    
    generateBtn.disabled = !isValid;
    generateBtn.style.opacity = isValid ? '1' : '0.6';
}

function generateRoutine() {
    if (!currentObjective || selectedDays.length === 0) return;
    
    const generateBtn = document.getElementById('generateRoutine');
    const originalText = generateBtn.innerHTML;
    
    // Mostrar loading
    generateBtn.innerHTML = '<span class="loading"></span> Generando rutina...';
    generateBtn.disabled = true;
    
    setTimeout(() => {
        currentRoutine = createRoutine();
        displayRoutine();
        
        // Restaurar botón
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;
        
        // Mostrar sección de rutina
        if (isLoggedIn) {
            hideAllSections();
        }
        document.getElementById('routineSection').classList.add('show');
        
        // Mostrar mensaje de login si no está logueado
        if (!isLoggedIn) {
            showRoutineLoginMessage();
        }
        
        // Scroll suave a la rutina
        document.getElementById('routineSection').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }, 1500);
}

function createRoutine() {
    const config = routineConfig[currentObjective];
    const dayCount = selectedDays.length;
    const dayTypes = dayConfig[Math.min(dayCount, 5)];
    
    const routine = {
        objective: currentObjective,
        config: config,
        days: []
    };
    
    selectedDays.forEach((day, index) => {
        const dayType = dayTypes[index % dayTypes.length];
        const exercises = generateExercisesForDay(dayType.muscle, config);
        
        routine.days.push({
            day: day,
            dayName: getDayName(day),
            type: dayType,
            exercises: exercises
        });
    });
    
    return routine;
}

function generateExercisesForDay(muscleGroup, config) {
    const exercises = [];
    
    switch(muscleGroup) {
        case 'chest_triceps':
            exercises.push(...getRandomExercises('chest', 3));
            exercises.push(...getRandomExercises('triceps', 2));
            break;
        case 'back_biceps':
            exercises.push(...getRandomExercises('back', 3));
            exercises.push(...getRandomExercises('biceps', 2));
            break;
        case 'legs_abs':
            exercises.push(...getRandomExercises('legs', 4));
            exercises.push(...getRandomExercises('abs', 2));
            break;
        case 'shoulders_cardio':
            exercises.push(...getRandomExercises('shoulders', 3));
            exercises.push(...getRandomExercises('cardio', 2));
            break;
        case 'shoulders_abs':
            exercises.push(...getRandomExercises('shoulders', 3));
            exercises.push(...getRandomExercises('abs', 2));
            break;
        case 'legs':
            exercises.push(...getRandomExercises('legs', 5));
            break;
        case 'upper':
            exercises.push(...getRandomExercises('chest', 2));
            exercises.push(...getRandomExercises('back', 2));
            exercises.push(...getRandomExercises('shoulders', 1));
            break;
        case 'lower':
            exercises.push(...getRandomExercises('legs', 4));
            exercises.push(...getRandomExercises('abs', 2));
            break;
        case 'fullbody':
            exercises.push(...getRandomExercises('chest', 1));
            exercises.push(...getRandomExercises('back', 1));
            exercises.push(...getRandomExercises('legs', 2));
            exercises.push(...getRandomExercises('shoulders', 1));
            exercises.push(...getRandomExercises('abs', 1));
            break;
    }
    
    return exercises.map(exercise => ({
        ...exercise,
        sets: getRandomInRange(config.sets.min, config.sets.max),
        reps: getRandomInRange(config.reps.min, config.reps.max),
        rest: getRandomInRange(config.rest.min, config.rest.max)
    }));
}

function getRandomExercises(muscleGroup, count) {
    const exercises = exerciseDatabase[muscleGroup];
    const shuffled = [...exercises].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function displayRoutine() {
    const routineContent = document.getElementById('routineContent');
    routineContent.innerHTML = '';
    
    currentRoutine.days.forEach(dayData => {
        const dayCard = createDayCard(dayData);
        routineContent.appendChild(dayCard);
    });
    
    // Añadir animación
    routineContent.classList.add('fade-in');
}

function createDayCard(dayData) {
    const dayCard = document.createElement('div');
    dayCard.className = 'day-routine fade-in';
    
    dayCard.innerHTML = `
        <div class="day-header">
            <div class="day-icon">${dayData.type.icon}</div>
            <div>
                <div class="day-title">${dayData.dayName}</div>
                <div class="day-subtitle">${dayData.type.name}</div>
            </div>
        </div>
        <div class="exercises-grid">
            ${dayData.exercises.map(exercise => `
                <div class="exercise-card">
                    <div class="exercise-name">
                        <span class="exercise-stat-icon">${exercise.icon}</span>
                        <span>${exercise.name}</span>
                        <a href="${exercise.tutorial}" target="_blank" class="exercise-tutorial">Ver cómo hacer</a>
                    </div>
                    <div class="exercise-details">
                        <div class="exercise-stat">
                            <span class="exercise-stat-icon">S</span>
                            <span>${exercise.sets} series</span>
                        </div>
                        <div class="exercise-stat">
                            <span class="exercise-stat-icon">R</span>
                            <span>${exercise.reps} reps</span>
                        </div>
                        <div class="exercise-stat">
                            <span class="exercise-stat-icon">T</span>
                            <span>${exercise.rest}s descanso</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    return dayCard;
}

function getDayName(day) {
    const days = {
        monday: 'Lunes',
        tuesday: 'Martes',
        wednesday: 'Miércoles',
        thursday: 'Jueves',
        friday: 'Viernes',
        saturday: 'Sábado',
        sunday: 'Domingo'
    };
    return days[day];
}

function regenerateRoutine() {
    if (!currentRoutine) return;
    
    const regenerateBtn = document.getElementById('regenerateBtn');
    const originalText = regenerateBtn.innerHTML;
    
    regenerateBtn.innerHTML = '<span class="loading"></span> Regenerando...';
    regenerateBtn.disabled = true;
    
    setTimeout(() => {
        currentRoutine = createRoutine();
        displayRoutine();
        
        regenerateBtn.innerHTML = originalText;
        regenerateBtn.disabled = false;
    }, 1000);
}

function downloadPDF() {
    if (!currentRoutine) return;
    
    const downloadBtn = document.getElementById('downloadBtn');
    const originalText = downloadBtn.innerHTML;
    
    downloadBtn.innerHTML = '<span class="loading"></span> Generando PDF...';
    downloadBtn.disabled = true;
    
    // Simular descarga (en un caso real, usarías una librería como jsPDF)
    setTimeout(() => {
        const content = generatePDFContent();
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `rutina-${currentRoutine.objective}-${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
    }, 1000);
}

function generatePDFContent() {
    const config = routineConfig[currentObjective];
    let content = `RUTINA DE ${config.name.toUpperCase()}\n`;
    content += `Generada el: ${new Date().toLocaleDateString()}\n\n`;
    
    currentRoutine.days.forEach(dayData => {
        content += `${dayData.dayName.toUpperCase()} - ${dayData.type.name}\n`;
        content += '='.repeat(50) + '\n\n';
        
        dayData.exercises.forEach(exercise => {
            content += `${exercise.name}\n`;
            content += `- ${exercise.sets} series x ${exercise.reps} repeticiones\n`;
            content += `- Descanso: ${exercise.rest} segundos\n\n`;
        });
        
        content += '\n';
    });
    
    content += 'CONSEJOS:\n';
    content += '- Mantén una buena técnica en todos los ejercicios\n';
    content += '- Ajusta el peso según tu nivel\n';
    content += '- Descansa al menos 1 día entre entrenamientos intensos\n';
    content += '- Mantente hidratado durante el entrenamiento\n';
    
    return content;
}

// Función para mostrar mensajes generales
function showMessage(text, type = 'info') {
    switch(type) {
        case 'success':
            showSuccessMessage(text);
            break;
        case 'error':
            showErrorMessage(text);
            break;
        case 'info':
            showInfoMessage(text);
            break;
        default:
            showInfoMessage(text);
    }
}

// Función para mostrar mensajes de información
function showInfoMessage(text) {
    const message = document.createElement('div');
    message.className = 'info-message';
    message.innerHTML = `
        <div class="info-message-content">
            <div class="info-message-icon">ℹ️</div>
            <div class="info-message-text">${text}</div>
        </div>
    `;
    
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .info-message-content {
            background: var(--primary);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .info-message-icon {
            font-size: 18px;
        }
        
        .info-message-text {
            font-weight: 500;
            font-size: 14px;
        }
        
        .info-message {
            max-width: 300px;
            word-wrap: break-word;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(message);
    
    setTimeout(() => {
        if (message.parentElement) {
            message.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (message.parentElement) {
                    message.remove();
                }
            }, 300);
        }
    }, 3000);
}

// Funciones mejoradas para persistencia de usuarios
function saveUser(user) {
    try {
        const users = JSON.parse(localStorage.getItem('gymUsers') || '[]');
        const existingUserIndex = users.findIndex(u => u.id === user.id);
        
        if (existingUserIndex !== -1) {
            users[existingUserIndex] = user;
        } else {
            users.push(user);
        }
        
        localStorage.setItem('gymUsers', JSON.stringify(users));
        console.log('Usuario guardado correctamente:', user.email);
        return true;
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        return false;
    }
}

function getUsers() {
    try {
        const users = JSON.parse(localStorage.getItem('gymUsers') || '[]');
        console.log('Usuarios cargados:', users.length);
        return users;
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        return [];
    }
}

function findUser(email, password) {
    try {
        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        console.log('Usuario encontrado:', user ? user.email : 'No encontrado');
        return user;
    } catch (error) {
        console.error('Error al buscar usuario:', error);
        return null;
    }
}

// Funciones de debug para usuarios
function debugUsers() {
    const users = getUsers();
    console.log('=== DEBUG USUARIOS ===');
    console.log('Total usuarios:', users.length);
    users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email})`);
    });
    console.log('Usuario actual:', currentUser ? currentUser.email : 'Ninguno');
    console.log('=== FIN DEBUG ===');
}

function clearAllUsers() {
    localStorage.removeItem('gymUsers');
    localStorage.removeItem('currentUser');
    console.log('Todos los usuarios han sido eliminados');
    location.reload();
}

// Añadir funciones globales para debug (solo en desarrollo)
window.debugUsers = debugUsers;
window.clearAllUsers = clearAllUsers;

// Sistema de autenticación
function setupAuthSystem() {
    // Event listeners para login
    document.getElementById('loginBtn').addEventListener('click', showLoginModal);
    document.getElementById('closeLoginBtn').addEventListener('click', hideLoginModal);
    
    // Event listeners para tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => switchTab(e.target.dataset.tab));
    });
    
    // Event listeners para forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    
    // Event listeners para user menu
    document.getElementById('userBtn').addEventListener('click', toggleUserDropdown);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('myRoutinesBtn').addEventListener('click', showMyRoutines);
    document.getElementById('viewProfileBtn').addEventListener('click', showDashboard);
    
    // Dashboard event listeners
    document.getElementById('newRoutineBtn').addEventListener('click', showConfigSection);
    document.getElementById('viewAllRoutinesBtn').addEventListener('click', showMyRoutines);
    document.getElementById('markDayCompleteBtn').addEventListener('click', markDayAsComplete);
    document.getElementById('createRoutineBtn').addEventListener('click', showConfigSection);
    document.getElementById('backToDashboardBtn').addEventListener('click', showDashboard);
    
    // Event listeners para rutinas
    document.getElementById('saveRoutineBtn').addEventListener('click', saveCurrentRoutine);
    
    // Event listeners para filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => filterRoutines(e.target.dataset.filter));
    });
    
    // Verificar si hay usuario logueado
    checkUserSession();
    
    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.user-menu')) {
            document.getElementById('userDropdown').classList.remove('show');
        }
    });
}

function showLoginModal() {
    document.getElementById('loginSection').classList.add('show');
}

function hideLoginModal() {
    document.getElementById('loginSection').classList.remove('show');
}

function switchTab(tabName) {
    // Actualizar tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simular autenticación
    const user = findUser(email, password);
    
    if (user) {
        login(user);
        hideLoginModal();
    } else {
        alert('Email o contraseña incorrectos');
    }
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    // Validar que no exista el usuario
    const users = getUsers();
    if (users.find(u => u.email === email)) {
        alert('Este email ya está registrado');
        return;
    }
    
    // Crear nuevo usuario
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        registeredAt: new Date().toISOString(),
        routines: [],
        completedDays: [],
        stats: {
            totalRoutines: 0,
            currentStreak: 0,
            favoriteObjective: null
        }
    };
    
    saveUser(newUser);
    
    login(newUser);
    hideLoginModal();
}

function login(user) {
    currentUser = user;
    isLoggedIn = true;
    
    // Inicializar completedDays si no existe (para usuarios existentes)
    if (!currentUser.completedDays) {
        currentUser.completedDays = [];
    }
    
    // Actualizar el streak
    updateStreak();
    
    // Guardar sesión
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Limpiar dismissal del alert para futuros usuarios
    localStorage.removeItem('loginAlertDismissed');
    
    // Actualizar UI
    updateUserInterface();
    showDashboard();
}

function handleLogout() {
    currentUser = null;
    isLoggedIn = false;
    
    // Limpiar sesión
    localStorage.removeItem('currentUser');
    
    // Actualizar UI
    updateUserInterface();
    hideAllSections();
    document.getElementById('configSection').style.display = 'block';
}

function checkUserSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isLoggedIn = true;
        updateUserInterface();
        showDashboard();
    } else {
        // Si no hay usuario logueado, mostrar sección de configuración
        hideAllSections();
        document.getElementById('configSection').style.display = 'block';
    }
}

function updateUserInterface() {
    const loginBtn = document.getElementById('loginBtn');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const userAvatar = document.querySelector('.user-avatar');
    const saveBtn = document.getElementById('saveRoutineBtn');
    const loginAlert = document.getElementById('loginAlert');
    
    if (isLoggedIn) {
        loginBtn.style.display = 'none';
        userMenu.style.display = 'block';
        userName.textContent = currentUser.name;
        userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
        saveBtn.style.display = 'flex';
        loginAlert.classList.remove('show');
    } else {
        loginBtn.style.display = 'block';
        userMenu.style.display = 'none';
        saveBtn.style.display = 'none';
        showLoginAlert();
    }
}

function showLoginAlert() {
    const loginAlert = document.getElementById('loginAlert');
    const alertDismissed = localStorage.getItem('loginAlertDismissed');
    
    if (!alertDismissed && !isLoggedIn) {
        loginAlert.classList.add('show');
    }
}

function hideLoginAlert() {
    const loginAlert = document.getElementById('loginAlert');
    loginAlert.classList.remove('show');
    localStorage.setItem('loginAlertDismissed', 'true');
}

function showRoutineLoginMessage() {
    // Crear mensaje temporal
    const message = document.createElement('div');
    message.className = 'routine-login-message';
    message.innerHTML = `
        <div class="login-message-content">
            <div class="login-message-icon">💡</div>
            <div class="login-message-text">
                <strong>¡Rutina generada!</strong>
                <span>Inicia sesión para guardar esta rutina y acceder a ella siempre</span>
            </div>
            <button class="login-message-btn" onclick="showLoginModal()">Iniciar Sesión</button>
            <button class="login-message-close" onclick="this.parentElement.parentElement.remove()">✕</button>
        </div>
    `;
    
    // Agregar estilos inline para el mensaje
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 1rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Agregar estilos para el contenido
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .login-message-content {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .login-message-icon {
            font-size: 1.5rem;
            flex-shrink: 0;
        }
        
        .login-message-text {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }
        
        .login-message-text strong {
            font-weight: 600;
            font-size: 1rem;
        }
        
        .login-message-text span {
            font-size: 0.9rem;
            opacity: 0.9;
        }
        
        .login-message-btn {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 6px;
            padding: 0.4rem 0.8rem;
            color: white;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.85rem;
            white-space: nowrap;
        }
        
        .login-message-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        .login-message-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.1rem;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.3s ease;
            padding: 0.25rem;
            margin-left: 0.5rem;
        }
        
        .login-message-close:hover {
            opacity: 1;
        }
        
        @media (max-width: 768px) {
            .routine-login-message {
                right: 10px;
                left: 10px;
                max-width: none;
            }
            
            .login-message-content {
                flex-direction: column;
                text-align: center;
                gap: 0.75rem;
            }
            
            .login-message-text {
                order: 1;
            }
            
            .login-message-btn {
                order: 2;
            }
            
            .login-message-close {
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                margin: 0;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(message);
    
    // Auto-remove después de 10 segundos
    setTimeout(() => {
        if (message.parentElement) {
            message.remove();
        }
             }, 10000);
}

function showSuccessMessage(text) {
    // Crear mensaje de éxito
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <div class="success-message-content">
            <div class="success-message-icon">✅</div>
            <div class="success-message-text">${text}</div>
        </div>
    `;
    
    // Agregar estilos inline
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    // Agregar estilos para el contenido
    const style = document.createElement('style');
    style.textContent = `
        .success-message-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .success-message-icon {
            font-size: 1.2rem;
            flex-shrink: 0;
        }
        
        .success-message-text {
            font-weight: 500;
            font-size: 0.95rem;
        }
        
        @media (max-width: 768px) {
            .success-message {
                right: 10px;
                left: 10px;
                max-width: none;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(message);
    
    // Auto-remove después de 3 segundos
    setTimeout(() => {
        if (message.parentElement) {
            message.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (message.parentElement) {
                    message.remove();
                }
            }, 300);
        }
    }, 3000);
    
    // Agregar animación de salida
    const slideOutStyle = document.createElement('style');
    slideOutStyle.textContent = `
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(slideOutStyle);
}

function showErrorMessage(text) {
    // Crear mensaje de error
    const message = document.createElement('div');
    message.className = 'error-message';
    message.innerHTML = `
        <div class="error-message-content">
            <div class="error-message-icon">❌</div>
            <div class="error-message-text">${text}</div>
        </div>
    `;
    
    // Agregar estilos inline
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    // Agregar estilos para el contenido
    const style = document.createElement('style');
    style.textContent = `
        .error-message-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }
        
        .error-message-icon {
            font-size: 1.2rem;
            flex-shrink: 0;
        }
        
        .error-message-text {
            font-weight: 500;
            font-size: 0.95rem;
        }
        
        @media (max-width: 768px) {
            .error-message {
                right: 10px;
                left: 10px;
                max-width: none;
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(message);
    
    // Auto-remove después de 5 segundos
    setTimeout(() => {
        if (message.parentElement) {
            message.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (message.parentElement) {
                    message.remove();
                }
            }, 300);
        }
    }, 5000);
}

function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('show');
}

function showDashboard() {
    hideAllSections();
    document.getElementById('dashboardSection').classList.add('show');
    updateDashboardStats();
    loadRecentRoutines();
}

function showMyRoutines() {
    hideAllSections();
    document.getElementById('myRoutinesSection').classList.add('show');
    loadSavedRoutines();
}

function showConfigSection() {
    hideAllSections();
    document.getElementById('configSection').style.display = 'block';
}

function hideAllSections() {
    document.getElementById('dashboardSection').classList.remove('show');
    document.getElementById('myRoutinesSection').classList.remove('show');
    document.getElementById('configSection').style.display = 'none';
    document.getElementById('routineSection').classList.remove('show');
}

function updateDashboardStats() {
    if (!currentUser) return;
    
    const stats = currentUser.stats;
    document.getElementById('totalRoutines').textContent = stats.totalRoutines;
    document.getElementById('currentStreak').textContent = stats.currentStreak;
    document.getElementById('favoriteObjective').textContent = stats.favoriteObjective || '-';
}

function loadRecentRoutines() {
    if (!currentUser) return;
    
    const recentRoutines = currentUser.routines.slice(-3).reverse();
    const container = document.getElementById('recentRoutinesGrid');
    
    if (recentRoutines.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No tienes rutinas aún</h3>
                <p>Crea tu primera rutina para empezar</p>
                <button onclick="showConfigSection()">Crear Rutina</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recentRoutines.map(routine => `
        <div class="routine-preview" onclick="loadRoutine('${routine.id}')">
            <div class="routine-meta">
                <span class="routine-objective">${routineConfig[routine.objective].name}</span>
                <span class="routine-date">${new Date(routine.createdAt).toLocaleDateString()}</span>
            </div>
            <div class="routine-days">
                ${routine.days.map(day => `<span class="routine-day">${day.dayName.substring(0, 3)}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

function loadSavedRoutines() {
    if (!currentUser) return;
    
    const container = document.getElementById('savedRoutinesGrid');
    const routines = currentUser.routines.slice().reverse();
    
    if (routines.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No tienes rutinas guardadas</h3>
                <p>Guarda tus rutinas favoritas para acceder a ellas fácilmente</p>
                <button onclick="showConfigSection()">Crear Rutina</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = routines.map(routine => `
        <div class="saved-routine-card" data-objective="${routine.objective}">
            <div class="saved-routine-header">
                <div>
                    <div class="saved-routine-title">${routine.name}</div>
                    <div class="routine-objective">${routineConfig[routine.objective].name}</div>
                </div>
                <div class="saved-routine-actions">
                    <button class="routine-action-btn" onclick="loadRoutine('${routine.id}')">Ver</button>
                    <button class="routine-action-btn" onclick="deleteRoutine('${routine.id}')">Eliminar</button>
                </div>
            </div>
            <div class="saved-routine-info">
                <span>Creada: ${new Date(routine.createdAt).toLocaleDateString()}</span>
                <span>Días: ${routine.days.length}</span>
                <span>Ejercicios: ${routine.days.reduce((total, day) => total + day.exercises.length, 0)}</span>
            </div>
        </div>
    `).join('');
}

function filterRoutines(filter) {
    // Actualizar botones
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
    
    // Filtrar rutinas
    const cards = document.querySelectorAll('.saved-routine-card');
    cards.forEach(card => {
        if (filter === 'all' || card.dataset.objective === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function saveCurrentRoutine() {
    if (!currentUser || !currentRoutine) {
        if (!currentUser) {
            showLoginModal();
            return;
        }
        alert('No hay rutina para guardar. Genera una rutina primero.');
        return;
    }
    
    const routineName = prompt('Nombre para tu rutina:') || `Rutina ${currentUser.routines.length + 1}`;
    
    if (!routineName.trim()) {
        alert('El nombre de la rutina no puede estar vacío.');
        return;
    }
    
    const savedRoutine = {
        id: Date.now().toString(),
        name: routineName.trim(),
        objective: currentRoutine.objective,
        config: currentRoutine.config,
        days: currentRoutine.days,
        createdAt: new Date().toISOString()
    };
    
    // Asegurar que currentUser.routines existe
    if (!currentUser.routines) {
        currentUser.routines = [];
    }
    
    currentUser.routines.push(savedRoutine);
    currentUser.stats.totalRoutines = currentUser.routines.length;
    
    // Actualizar objetivo favorito
    const objectives = currentUser.routines.map(r => r.objective);
    const objectiveCount = {};
    objectives.forEach(obj => objectiveCount[obj] = (objectiveCount[obj] || 0) + 1);
    
    if (objectives.length > 0) {
        currentUser.stats.favoriteObjective = routineConfig[Object.keys(objectiveCount).reduce((a, b) => 
            objectiveCount[a] > objectiveCount[b] ? a : b
        )].name;
    }
    
    // Guardar en localStorage
    try {
        const success = saveUser(currentUser);
        if (success) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            console.error('Error al guardar usuario');
            showErrorMessage('Error al guardar la rutina. Intenta de nuevo.');
        }
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        showErrorMessage('Error al guardar la rutina. Intenta de nuevo.');
    }
    
    // Mostrar mensaje de confirmación
    showSuccessMessage('¡Rutina guardada exitosamente!');
    
    // Actualizar estadísticas si está en el dashboard
    if (document.getElementById('dashboardSection').classList.contains('show')) {
        updateDashboardStats();
        loadRecentRoutines();
    }
}

function loadRoutine(routineId) {
    if (!currentUser) return;
    
    const routine = currentUser.routines.find(r => r.id === routineId);
    if (!routine) return;
    
    currentRoutine = routine;
    displayRoutine();
    
    hideAllSections();
    document.getElementById('routineSection').classList.add('show');
    document.getElementById('routineSection').scrollIntoView({ behavior: 'smooth' });
}

function deleteRoutine(routineId) {
    if (!currentUser) return;
    
    if (confirm('¿Estás seguro de que quieres eliminar esta rutina?')) {
        currentUser.routines = currentUser.routines.filter(r => r.id !== routineId);
        currentUser.stats.totalRoutines = currentUser.routines.length;
        
        updateUserInStorage();
        loadSavedRoutines();
        updateDashboardStats();
    }
}



function loadUserPreferences() {
    // Solo cargar si no hay usuario logueado
    if (!isLoggedIn) {
        // Cargar objetivo guardado
        const savedObjective = localStorage.getItem('selectedObjective');
        if (savedObjective) {
            selectObjective(savedObjective);
        }
        
        // Cargar días guardados
        const savedDays = localStorage.getItem('selectedDays');
        if (savedDays) {
            const days = JSON.parse(savedDays);
            days.forEach(day => toggleDay(day));
        }
    }
} 