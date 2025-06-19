// Quiz functionality for FHIR course sessions
class QuizManager {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.totalQuestions = 0;
    }

    // Initialize quiz for a specific session
    initQuiz(sessionId, questions) {
        this.sessionId = sessionId;
        this.questions = questions;
        this.totalQuestions = questions.length;
        this.currentQuestion = 0;
        this.score = 0;
        
        this.renderQuiz();
    }

    // Render the quiz interface
    renderQuiz() {
        const quizContainer = document.getElementById('quiz-container');
        if (!quizContainer) return;

        quizContainer.innerHTML = `
            <div class="quiz-header bg-blue-50 p-4 rounded-lg mb-6">
                <h3 class="text-xl font-bold text-blue-800 mb-2">📝 Evaluación del Módulo</h3>
                <div class="flex justify-between items-center text-sm text-blue-700">
                    <span>Pregunta <span id="current-question-num">${this.currentQuestion + 1}</span> de ${this.totalQuestions}</span>
                    <span>Puntuación: <span id="current-score">${this.score}</span>/${this.totalQuestions}</span>
                </div>
            </div>
            
            <div id="question-container" class="mb-6">
                ${this.renderQuestion()}
            </div>
            
            <div id="quiz-controls" class="flex gap-4">
                <button id="check-answer-btn" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                    <i class="fas fa-check mr-2"></i>Verificar Respuesta
                </button>
                <button id="next-question-btn" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors hidden">
                    <i class="fas fa-arrow-right mr-2"></i>Siguiente Pregunta
                </button>
                <button id="finish-quiz-btn" class="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors hidden">
                    <i class="fas fa-trophy mr-2"></i>Finalizar Quiz
                </button>
            </div>
            
            <div id="result-container" class="hidden mt-6 p-4 rounded-lg"></div>
        `;

        this.attachEventListeners();
    }

    // Render current question
    renderQuestion() {
        const question = this.questions[this.currentQuestion];
        const options = question.options.map((option, index) => `
            <label class="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="radio" name="answer" value="${index}" class="mr-3 text-blue-600">
                <span class="text-gray-700">${option}</span>
            </label>
        `).join('');

        return `
            <div class="question-card bg-white p-6 rounded-lg shadow-md">
                <h4 class="text-lg font-semibold text-gray-800 mb-4">
                    ${this.currentQuestion + 1}. ${question.question}
                </h4>
                <div class="space-y-3">
                    ${options}
                </div>
            </div>
        `;
    }

    // Attach event listeners to buttons
    attachEventListeners() {
        const checkBtn = document.getElementById('check-answer-btn');
        const nextBtn = document.getElementById('next-question-btn');
        const finishBtn = document.getElementById('finish-quiz-btn');

        checkBtn.addEventListener('click', () => this.checkAnswer());
        nextBtn.addEventListener('click', () => this.nextQuestion());
        finishBtn.addEventListener('click', () => this.finishQuiz());
    }

    // Check the selected answer
    checkAnswer() {
        const selectedAnswer = document.querySelector('input[name="answer"]:checked');
        if (!selectedAnswer) {
            alert('Por favor selecciona una respuesta antes de continuar.');
            return;
        }

        const selectedIndex = parseInt(selectedAnswer.value);
        const question = this.questions[this.currentQuestion];
        const isCorrect = selectedIndex === question.correctAnswer;

        // Disable all radio buttons
        document.querySelectorAll('input[name="answer"]').forEach(input => {
            input.disabled = true;
        });

        // Show correct answer and explanation
        this.showAnswer(selectedIndex, isCorrect, question);

        // Update score
        if (isCorrect) {
            this.score++;
            document.getElementById('current-score').textContent = this.score;
        }

        // Show next button or finish button
        const checkBtn = document.getElementById('check-answer-btn');
        const nextBtn = document.getElementById('next-question-btn');
        const finishBtn = document.getElementById('finish-quiz-btn');

        checkBtn.classList.add('hidden');
        
        if (this.currentQuestion < this.totalQuestions - 1) {
            nextBtn.classList.remove('hidden');
        } else {
            finishBtn.classList.remove('hidden');
        }
    }

    // Show the correct answer and explanation
    showAnswer(selectedIndex, isCorrect, question) {
        const options = document.querySelectorAll('label');
        
        options.forEach((option, index) => {
            const radio = option.querySelector('input');
            const text = option.querySelector('span');
            
            if (index === question.correctAnswer) {
                // Correct answer
                option.classList.add('bg-green-100', 'border-green-500');
                text.classList.add('text-green-800', 'font-semibold');
                text.innerHTML += ' <i class="fas fa-check-circle text-green-600 ml-2"></i>';
            } else if (index === selectedIndex && !isCorrect) {
                // Wrong selected answer
                option.classList.add('bg-red-100', 'border-red-500');
                text.classList.add('text-red-800', 'font-semibold');
                text.innerHTML += ' <i class="fas fa-times-circle text-red-600 ml-2"></i>';
            }
        });

        // Show explanation
        const resultContainer = document.getElementById('result-container');
        resultContainer.classList.remove('hidden');
        resultContainer.innerHTML = `
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <i class="fas fa-info-circle text-blue-400"></i>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-blue-700">
                            <strong>Explicación:</strong> ${question.explanation}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }

    // Move to next question
    nextQuestion() {
        this.currentQuestion++;
        document.getElementById('current-question-num').textContent = this.currentQuestion + 1;
        
        // Reset interface
        document.getElementById('check-answer-btn').classList.remove('hidden');
        document.getElementById('next-question-btn').classList.add('hidden');
        document.getElementById('finish-quiz-btn').classList.add('hidden');
        document.getElementById('result-container').classList.add('hidden');
        
        // Render new question
        document.getElementById('question-container').innerHTML = this.renderQuestion();
    }

    // Finish the quiz
    finishQuiz() {
        const percentage = Math.round((this.score / this.totalQuestions) * 100);
        const resultContainer = document.getElementById('result-container');
        
        let message, colorClass;
        if (percentage >= 80) {
            message = '¡Excelente! Has demostrado un dominio sólido del contenido.';
            colorClass = 'bg-green-50 border-green-400 text-green-700';
        } else if (percentage >= 60) {
            message = '¡Buen trabajo! Tienes una comprensión adecuada del material.';
            colorClass = 'bg-yellow-50 border-yellow-400 text-yellow-700';
        } else {
            message = 'Te recomendamos revisar el material antes de continuar.';
            colorClass = 'bg-red-50 border-red-400 text-red-700';
        }

        resultContainer.innerHTML = `
            <div class="${colorClass} border-l-4 p-6 rounded-lg">
                <h3 class="text-xl font-bold mb-4">Resultado Final</h3>
                <p class="text-lg mb-2">Puntuación: ${this.score}/${this.totalQuestions} (${percentage}%)</p>
                <p class="mb-4">${message}</p>
                <button onclick="location.reload()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                    <i class="fas fa-redo mr-2"></i>Reintentar Quiz
                </button>
            </div>
        `;
        
        resultContainer.classList.remove('hidden');
        document.getElementById('quiz-controls').classList.add('hidden');
    }
}

// Global quiz manager instance
const quizManager = new QuizManager();

// Function to start quiz for a specific session
function startQuiz(sessionId) {
    const questions = getQuestionsForSession(sessionId);
    quizManager.initQuiz(sessionId, questions);
}

// Function to get questions for each session
function getQuestionsForSession(sessionId) {
    const questionSets = {
        'session1': [
            {
                question: "¿Cuál de los siguientes NO es un mecanismo de intercambio de información en FHIR?",
                options: [
                    "Transacciones REST",
                    "Operaciones en lote (Batch)",
                    "Mensajería asíncrona",
                    "Protocolo FTP directo"
                ],
                correctAnswer: 3,
                explanation: "FHIR utiliza REST, operaciones en lote y mensajería, pero no FTP directo. Los mecanismos estándar son transacciones REST, operaciones en lote, mensajería y suscripciones."
            },
            {
                question: "En el contexto de FHIR, ¿qué significa 'pull' en el intercambio de datos?",
                options: [
                    "El servidor envía datos automáticamente al cliente",
                    "El cliente solicita datos específicos al servidor",
                    "Los datos se sincronizan bidireccionalmente",
                    "Los datos se transmiten en tiempo real"
                ],
                correctAnswer: 1,
                explanation: "El modelo 'pull' significa que el cliente solicita datos específicos al servidor cuando los necesita, en lugar de recibirlos automáticamente."
            },
            {
                question: "¿Cuál es la principal ventaja de usar operaciones en lote (Batch) en FHIR?",
                options: [
                    "Mayor velocidad de transmisión",
                    "Reducción del número de conexiones HTTP",
                    "Mejor seguridad en la transmisión",
                    "Compresión automática de datos"
                ],
                correctAnswer: 1,
                explanation: "Las operaciones en lote permiten agrupar múltiples operaciones en una sola petición HTTP, reduciendo significativamente el número de conexiones necesarias."
            },
            {
                question: "¿Qué tipo de intercambio es más apropiado para alertas clínicas urgentes?",
                options: [
                    "Operaciones en lote",
                    "Suscripciones con notificaciones push",
                    "Transacciones REST síncronas",
                    "Transferencias masivas"
                ],
                correctAnswer: 1,
                explanation: "Las suscripciones con notificaciones push son ideales para alertas urgentes porque permiten la entrega inmediata de información crítica."
            },
            {
                question: "En FHIR, ¿qué recurso se utiliza típicamente para las suscripciones?",
                options: [
                    "Subscription",
                    "Notification",
                    "Message",
                    "Event"
                ],
                correctAnswer: 0,
                explanation: "El recurso Subscription en FHIR se utiliza para definir qué eventos debe monitorear el servidor y cómo notificar al cliente."
            },
            {
                question: "¿Cuál es la diferencia principal entre mensajería y transacciones REST en FHIR?",
                options: [
                    "Las transacciones son más rápidas",
                    "La mensajería es asíncrona, las transacciones son síncronas",
                    "Solo las transacciones soportan autenticación",
                    "La mensajería requiere menos ancho de banda"
                ],
                correctAnswer: 1,
                explanation: "La mensajería en FHIR es asíncrona y permite el procesamiento diferido, mientras que las transacciones REST son síncronas y requieren respuesta inmediata."
            },
            {
                question: "¿Qué estrategia de intercambio es más eficiente para sincronizar grandes volúmenes de datos?",
                options: [
                    "Transacciones individuales",
                    "Transferencias masivas (Bulk)",
                    "Mensajería en tiempo real",
                    "Suscripciones periódicas"
                ],
                correctAnswer: 1,
                explanation: "Las transferencias masivas están diseñadas específicamente para sincronizar grandes volúmenes de datos de manera eficiente."
            },
            {
                question: "¿Cuál de los siguientes criterios NO es relevante para seleccionar una estrategia de intercambio?",
                options: [
                    "Volumen de datos",
                    "Frecuencia de actualización",
                    "Color de la interfaz de usuario",
                    "Requisitos de latencia"
                ],
                correctAnswer: 2,
                explanation: "El color de la interfaz de usuario no es un criterio técnico relevante para seleccionar estrategias de intercambio de datos."
            },
            {
                question: "En FHIR, ¿qué significa 'push' en el contexto de intercambio de datos?",
                options: [
                    "El servidor envía datos al cliente sin solicitud previa",
                    "El cliente fuerza una actualización en el servidor",
                    "Los datos se comprimen antes de la transmisión",
                    "Se establece una conexión persistente"
                ],
                correctAnswer: 0,
                explanation: "El modelo 'push' significa que el servidor envía datos al cliente automáticamente cuando están disponibles, sin necesidad de solicitud previa."
            },
            {
                question: "¿Qué ventaja ofrece la mensajería asíncrona sobre las transacciones síncronas?",
                options: [
                    "Mayor velocidad de procesamiento",
                    "Mejor tolerancia a fallos y escalabilidad",
                    "Menor uso de memoria",
                    "Conexiones más seguras"
                ],
                correctAnswer: 1,
                explanation: "La mensajería asíncrona ofrece mejor tolerancia a fallos y escalabilidad porque no requiere conexiones persistentes y puede manejar picos de carga."
            }
        ],
        'session2': [
            {
                question: "¿Qué significa CDA en el contexto de estándares de salud?",
                options: [
                    "Clinical Document Architecture",
                    "Computerized Data Access",
                    "Clinical Data Analysis",
                    "Centralized Document Archive"
                ],
                correctAnswer: 0,
                explanation: "CDA significa Clinical Document Architecture, un estándar para documentos clínicos electrónicos desarrollado por HL7."
            },
            {
                question: "¿Cuál es la principal diferencia entre CDA R2 y FHIR DocumentReference?",
                options: [
                    "CDA R2 es más moderno",
                    "FHIR DocumentReference es más simple y basado en REST",
                    "CDA R2 no soporta metadatos",
                    "FHIR DocumentReference no puede contener contenido clínico"
                ],
                correctAnswer: 1,
                explanation: "FHIR DocumentReference es más simple y está basado en REST, mientras que CDA R2 es más complejo y basado en XML."
            },
            {
                question: "¿Qué tipo de mensaje HL7 V2 se utiliza para admisiones de pacientes?",
                options: [
                    "ORU (Observation Result)",
                    "ADT (Admission, Discharge, Transfer)",
                    "ORM (Order Message)",
                    "SIU (Scheduling Information)"
                ],
                correctAnswer: 1,
                explanation: "ADT (Admission, Discharge, Transfer) es el tipo de mensaje HL7 V2 utilizado para gestionar eventos de admisión, alta y transferencia de pacientes."
            },
            {
                question: "¿Cuál es el propósito principal de la transformación de estándares heredados a FHIR?",
                options: [
                    "Reducir costos de implementación",
                    "Mantener interoperabilidad durante la transición",
                    "Eliminar todos los estándares anteriores",
                    "Simplificar la arquitectura de sistemas"
                ],
                correctAnswer: 1,
                explanation: "La transformación permite mantener la interoperabilidad durante la transición gradual de estándares heredados a FHIR."
            },
            {
                question: "¿Qué recurso FHIR se utiliza para representar documentos clínicos?",
                options: [
                    "Document",
                    "DocumentReference",
                    "ClinicalDocument",
                    "HealthRecord"
                ],
                correctAnswer: 1,
                explanation: "DocumentReference es el recurso FHIR utilizado para referenciar y gestionar documentos clínicos."
            },
            {
                question: "¿Cuál de los siguientes NO es un desafío en la transformación de HL7 V2 a FHIR?",
                options: [
                    "Diferencias en el modelo de datos",
                    "Mapeo de códigos de terminología",
                    "Compatibilidad de versiones",
                    "Color de la interfaz de usuario"
                ],
                correctAnswer: 3,
                explanation: "El color de la interfaz de usuario no es un desafío técnico en la transformación de estándares de datos."
            },
            {
                question: "¿Qué significa CCDA en el contexto de estándares de salud?",
                options: [
                    "Clinical Care Document Architecture",
                    "Consolidated Clinical Document Architecture",
                    "Computerized Clinical Data Access",
                    "Centralized Clinical Document Archive"
                ],
                correctAnswer: 1,
                explanation: "CCDA significa Consolidated Clinical Document Architecture, una implementación específica de CDA para documentos de resumen clínico."
            },
            {
                question: "¿Cuál es la ventaja principal de usar FHIR sobre HL7 V2?",
                options: [
                    "Mayor velocidad de procesamiento",
                    "API REST moderna y fácil de implementar",
                    "Menor tamaño de mensajes",
                    "Mejor compatibilidad con sistemas legacy"
                ],
                correctAnswer: 1,
                explanation: "FHIR ofrece una API REST moderna que es más fácil de implementar y mantener que los mensajes HL7 V2."
            },
            {
                question: "¿Qué recurso FHIR se utiliza para representar observaciones clínicas?",
                options: [
                    "ClinicalObservation",
                    "Observation",
                    "TestResult",
                    "Measurement"
                ],
                correctAnswer: 1,
                explanation: "El recurso Observation en FHIR se utiliza para representar observaciones clínicas como resultados de laboratorio, signos vitales, etc."
            },
            {
                question: "¿Cuál es el enfoque recomendado para la coexistencia de estándares?",
                options: [
                    "Migración inmediata y completa",
                    "Transformación gradual con mapeo bidireccional",
                    "Mantenimiento de sistemas separados",
                    "Eliminación de estándares heredados"
                ],
                correctAnswer: 1,
                explanation: "La transformación gradual con mapeo bidireccional permite una transición suave sin interrumpir los sistemas existentes."
            }
        ],
        'session3': [
            {
                question: "¿Cuál de los siguientes NO es un componente esencial en una implementación FHIR?",
                options: [
                    "Servidor de autenticación",
                    "Servicio de terminología",
                    "Motor de búsqueda",
                    "Servidor de correo electrónico"
                ],
                correctAnswer: 3,
                explanation: "Un servidor de correo electrónico no es un componente esencial para una implementación FHIR. Los componentes esenciales incluyen autenticación, terminología, búsqueda y gestión de consentimientos."
            },
            {
                question: "¿Qué recurso FHIR se utiliza para gestionar consentimientos de pacientes?",
                options: [
                    "Permission",
                    "Consent",
                    "Authorization",
                    "PatientAgreement"
                ],
                correctAnswer: 1,
                explanation: "El recurso Consent en FHIR se utiliza para gestionar y representar los consentimientos informados de los pacientes."
            },
            {
                question: "¿Cuál es el propósito principal de un servicio de terminología en FHIR?",
                options: [
                    "Traducir documentos clínicos",
                    "Gestionar códigos y vocabularios estandarizados",
                    "Comprimir datos de transmisión",
                    "Validar certificados digitales"
                ],
                correctAnswer: 1,
                explanation: "Un servicio de terminología gestiona códigos y vocabularios estandarizados como SNOMED CT, LOINC, ICD-10, etc."
            },
            {
                question: "¿Qué componente es responsable de la autorización en una arquitectura FHIR?",
                options: [
                    "Servidor de autenticación",
                    "Servidor de autorización",
                    "Proxy de seguridad",
                    "Todas las anteriores"
                ],
                correctAnswer: 3,
                explanation: "La autorización puede ser manejada por múltiples componentes: servidor de autorización, proxy de seguridad, o integrada en el servidor de autenticación."
            },
            {
                question: "¿Cuál es la función principal de un registro maestro de pacientes (MPI)?",
                options: [
                    "Almacenar historias clínicas completas",
                    "Gestionar identidades únicas de pacientes",
                    "Procesar transacciones de pago",
                    "Validar certificados médicos"
                ],
                correctAnswer: 1,
                explanation: "Un MPI (Master Patient Index) gestiona identidades únicas de pacientes para evitar duplicados y mantener consistencia en los datos."
            },
            {
                question: "¿Qué patrón arquitectónico es más común en implementaciones FHIR?",
                options: [
                    "Arquitectura monolítica",
                    "Arquitectura de microservicios",
                    "Arquitectura de capas",
                    "Arquitectura orientada a eventos"
                ],
                correctAnswer: 1,
                explanation: "Las implementaciones FHIR modernas típicamente utilizan arquitectura de microservicios para mayor escalabilidad y mantenibilidad."
            },
            {
                question: "¿Cuál de los siguientes es un componente opcional en una implementación FHIR?",
                options: [
                    "Servidor FHIR",
                    "Servicio de autenticación",
                    "Sistema de facturación",
                    "Servicio de terminología"
                ],
                correctAnswer: 2,
                explanation: "Un sistema de facturación es un componente opcional que puede integrarse con FHIR pero no es esencial para la funcionalidad básica."
            },
            {
                question: "¿Qué recurso FHIR se utiliza para auditar el acceso a datos?",
                options: [
                    "AuditLog",
                    "AuditEvent",
                    "SecurityEvent",
                    "AccessLog"
                ],
                correctAnswer: 1,
                explanation: "El recurso AuditEvent en FHIR se utiliza para registrar y auditar eventos de acceso y modificación de datos."
            },
            {
                question: "¿Cuál es la ventaja principal de usar un proxy de seguridad en FHIR?",
                options: [
                    "Mayor velocidad de respuesta",
                    "Centralización de políticas de seguridad",
                    "Reducción de costos de infraestructura",
                    "Mejor compatibilidad con sistemas legacy"
                ],
                correctAnswer: 1,
                explanation: "Un proxy de seguridad centraliza las políticas de seguridad y simplifica la gestión de autenticación y autorización."
            },
            {
                question: "¿Qué componente es esencial para la interoperabilidad entre diferentes sistemas FHIR?",
                options: [
                    "Servidor de correo",
                    "Servicio de transformación de datos",
                    "Motor de reglas de negocio",
                    "Sistema de gestión de archivos"
                ],
                correctAnswer: 1,
                explanation: "Un servicio de transformación de datos es esencial para mapear y convertir datos entre diferentes implementaciones FHIR."
            }
        ],
        'session4': [
            {
                question: "¿Cuál de los siguientes NO es un modelo de seguridad compatible con FHIR?",
                options: [
                    "OAuth 2.0",
                    "SMART on FHIR",
                    "X-Road",
                    "FTP básico"
                ],
                correctAnswer: 3,
                explanation: "FTP básico no es un modelo de seguridad compatible con FHIR. Los modelos estándar incluyen OAuth 2.0, SMART on FHIR y X-Road."
            },
            {
                question: "¿Qué recurso FHIR se utiliza para registrar eventos de auditoría?",
                options: [
                    "AuditLog",
                    "AuditEvent",
                    "SecurityEvent",
                    "LogEntry"
                ],
                correctAnswer: 1,
                explanation: "El recurso AuditEvent en FHIR se utiliza para registrar eventos de auditoría relacionados con el acceso y modificación de datos."
            },
            {
                question: "¿Cuál es el propósito principal de SMART on FHIR?",
                options: [
                    "Acelerar la transmisión de datos",
                    "Proporcionar un marco de seguridad para aplicaciones FHIR",
                    "Comprimir datos clínicos",
                    "Validar certificados digitales"
                ],
                correctAnswer: 1,
                explanation: "SMART on FHIR proporciona un marco de seguridad estandarizado para aplicaciones que acceden a datos FHIR."
            },
            {
                question: "¿Qué recurso FHIR se utiliza para gestionar la procedencia de datos?",
                options: [
                    "DataOrigin",
                    "Provenance",
                    "Source",
                    "Origin"
                ],
                correctAnswer: 1,
                explanation: "El recurso Provenance en FHIR se utiliza para rastrear el origen y la procedencia de los datos clínicos."
            },
            {
                question: "¿Cuál es la ventaja principal de usar OAuth 2.0 en FHIR?",
                options: [
                    "Mayor velocidad de autenticación",
                    "Estándar ampliamente adoptado y probado",
                    "Menor uso de ancho de banda",
                    "Compatibilidad con sistemas legacy"
                ],
                correctAnswer: 1,
                explanation: "OAuth 2.0 es un estándar ampliamente adoptado y probado que proporciona un marco de seguridad robusto y flexible."
            },
            {
                question: "¿Qué componente es esencial para probar la seguridad de aplicaciones FHIR?",
                options: [
                    "Servidor de pruebas",
                    "Herramientas de análisis de vulnerabilidades",
                    "Sistema de monitoreo de rendimiento",
                    "Base de datos de prueba"
                ],
                correctAnswer: 1,
                explanation: "Las herramientas de análisis de vulnerabilidades son esenciales para identificar y corregir problemas de seguridad en aplicaciones FHIR."
            },
            {
                question: "¿Cuál es el propósito del recurso Consent en FHIR?",
                options: [
                    "Gestionar permisos de acceso",
                    "Representar consentimientos informados de pacientes",
                    "Validar certificados digitales",
                    "Auditar eventos de seguridad"
                ],
                correctAnswer: 1,
                explanation: "El recurso Consent en FHIR se utiliza para representar y gestionar los consentimientos informados de los pacientes."
            },
            {
                question: "¿Qué estrategia de seguridad es más apropiada para datos altamente sensibles?",
                options: [
                    "Autenticación básica",
                    "Autenticación multifactor con encriptación de extremo a extremo",
                    "Tokens simples",
                    "Contraseñas compartidas"
                ],
                correctAnswer: 1,
                explanation: "Para datos altamente sensibles, se recomienda autenticación multifactor combinada con encriptación de extremo a extremo."
            },
            {
                question: "¿Cuál de los siguientes NO es un componente de seguridad recomendado en FHIR?",
                options: [
                    "HTTPS/TLS",
                    "Validación de tokens",
                    "Contraseñas en texto plano",
                    "Auditoría de acceso"
                ],
                correctAnswer: 2,
                explanation: "Las contraseñas en texto plano no son seguras. Siempre se deben encriptar las contraseñas y usar métodos de autenticación seguros."
            },
            {
                question: "¿Qué es X-Road en el contexto de seguridad FHIR?",
                options: [
                    "Un protocolo de red",
                    "Una plataforma de intercambio de datos segura",
                    "Un estándar de encriptación",
                    "Un sistema de autenticación"
                ],
                correctAnswer: 1,
                explanation: "X-Road es una plataforma de intercambio de datos segura utilizada en varios países para la interoperabilidad de sistemas de salud."
            }
        ],
        'session5': [
            {
                question: "¿Cuál es la ventaja principal de usar servidores FHIR nativos en la nube?",
                options: [
                    "Menor costo inicial",
                    "Escalabilidad automática y gestión simplificada",
                    "Mayor velocidad de procesamiento",
                    "Mejor compatibilidad con sistemas legacy"
                ],
                correctAnswer: 1,
                explanation: "Los servidores FHIR nativos en la nube ofrecen escalabilidad automática y gestión simplificada, eliminando la necesidad de administrar infraestructura."
            },
            {
                question: "¿Qué característica es más importante para la escalabilidad en la nube?",
                options: [
                    "Velocidad de procesamiento",
                    "Capacidad de auto-escalado",
                    "Tamaño de almacenamiento",
                    "Ancho de banda de red"
                ],
                correctAnswer: 1,
                explanation: "La capacidad de auto-escalado es crucial para manejar picos de demanda automáticamente sin intervención manual."
            },
            {
                question: "¿Cuál de los siguientes NO es un proveedor de servidores FHIR en la nube?",
                options: [
                    "Microsoft Azure",
                    "Google Cloud Healthcare API",
                    "AWS HealthLake",
                    "Oracle Database"
                ],
                correctAnswer: 3,
                explanation: "Oracle Database es un sistema de gestión de bases de datos, no un proveedor específico de servidores FHIR en la nube."
            },
            {
                question: "¿Qué consideración es más importante para la flexibilidad en la nube?",
                options: [
                    "Configuración fija",
                    "Arquitectura modular y APIs abiertas",
                    "Procesamiento centralizado",
                    "Almacenamiento local"
                ],
                correctAnswer: 1,
                explanation: "Una arquitectura modular con APIs abiertas permite mayor flexibilidad para adaptarse a diferentes necesidades y requisitos."
            },
            {
                question: "¿Cuál es el beneficio principal de usar contenedores en implementaciones FHIR en la nube?",
                options: [
                    "Mayor velocidad de red",
                    "Portabilidad y consistencia entre entornos",
                    "Menor uso de memoria",
                    "Mejor seguridad"
                ],
                correctAnswer: 1,
                explanation: "Los contenedores proporcionan portabilidad y consistencia, permitiendo que las aplicaciones FHIR funcionen igual en diferentes entornos."
            },
            {
                question: "¿Qué característica es esencial para la alta disponibilidad en la nube?",
                options: [
                    "Replicación de datos",
                    "Backup manual",
                    "Procesamiento secuencial",
                    "Almacenamiento local"
                ],
                correctAnswer: 0,
                explanation: "La replicación de datos es esencial para garantizar alta disponibilidad y recuperación ante fallos en entornos cloud."
            },
            {
                question: "¿Cuál de los siguientes es un desafío específico de FHIR en la nube?",
                options: [
                    "Compatibilidad con navegadores",
                    "Cumplimiento de regulaciones de datos de salud",
                    "Velocidad de procesamiento",
                    "Tamaño de archivos"
                ],
                correctAnswer: 1,
                explanation: "El cumplimiento de regulaciones de datos de salud (como HIPAA, GDPR) es un desafío específico y crítico en implementaciones cloud."
            },
            {
                question: "¿Qué servicio de nube es más apropiado para almacenar datos FHIR?",
                options: [
                    "Servicio de correo electrónico",
                    "Base de datos gestionada con encriptación",
                    "Almacenamiento de archivos simple",
                    "Servicio de streaming"
                ],
                correctAnswer: 1,
                explanation: "Una base de datos gestionada con encriptación es la opción más apropiada para almacenar datos FHIR de manera segura."
            },
            {
                question: "¿Cuál es la ventaja de usar servicios gestionados para FHIR en la nube?",
                options: [
                    "Menor control sobre la configuración",
                    "Reducción de tareas de administración",
                    "Mayor costo operativo",
                    "Dependencia de un solo proveedor"
                ],
                correctAnswer: 1,
                explanation: "Los servicios gestionados reducen significativamente las tareas de administración, permitiendo enfocarse en la lógica de negocio."
            },
            {
                question: "¿Qué estrategia es más efectiva para optimizar costos en FHIR en la nube?",
                options: [
                    "Usar siempre la configuración más potente",
                    "Implementar auto-escalado y monitoreo de uso",
                    "Almacenar todos los datos localmente",
                    "Usar un solo proveedor de nube"
                ],
                correctAnswer: 1,
                explanation: "Implementar auto-escalado y monitoreo de uso permite optimizar costos ajustando recursos según la demanda real."
            }
        ]
    };

    return questionSets[sessionId] || [];
} 