// Esquema de evaluación psicológica — Observador Psicológico
// Define las 8 categorías con sus métricas numéricas (0-10) y campos de texto

export const evaluationCategories = [
  {
    id: 'atencion',
    label: 'Atención y concentración',
    icon: '🎯',
    color: '#3b82f6',
    metrics: [
      { id: 'atencion_mantiene', label: 'Mantiene la atención', min: 0, max: 10 },
      { id: 'atencion_relevante', label: 'Atiende a la información relevante', min: 0, max: 10 },
      { id: 'atencion_recupera', label: 'Recupera rápidamente la concentración tras interrupción/error', min: 0, max: 10 },
      { id: 'atencion_fatiga', label: 'Mantiene la concentración cuando aumenta la fatiga o presión', min: 0, max: 10 },
    ],
    textFields: [
      { id: 'atencion_conductas', label: 'Conductas observadas', placeholder: 'Describe las conductas observadas...' },
    ],
  },
  {
    id: 'error',
    label: 'Respuesta ante el error',
    icon: '🔄',
    color: '#ef4444',
    metrics: [
      { id: 'error_reaccion_proporcional', label: 'Tiene una reacción emocional proporcionada', min: 0, max: 10 },
      { id: 'error_recuperacion_rapida', label: 'Recuperación rápida después del error', min: 0, max: 10 },
      { id: 'error_implicacion_siguiente', label: 'Mantiene la implicación en la siguiente acción', min: 0, max: 10 },
      { id: 'error_evita_enganche', label: 'Evita quedarse enganchada al error', min: 0, max: 10 },
    ],
    textFields: [
      { id: 'error_conducta_despues', label: '¿Qué hace inmediatamente después del error?', placeholder: 'Describe la conducta post-error...' },
    ],
  },
  {
    id: 'confianza',
    label: 'Confianza y seguridad',
    icon: '💪',
    color: '#22c55e',
    metrics: [
      { id: 'confianza_decidida', label: 'Se muestra decidida en sus acciones', min: 0, max: 10 },
      { id: 'confianza_responsabilidad', label: 'Asume responsabilidad', min: 0, max: 10 },
      { id: 'confianza_sigue_intentando', label: 'Sigue intentando acciones después de fallar', min: 0, max: 10 },
      { id: 'confianza_presion', label: 'Mantiene su comportamiento habitual en situaciones de presión', min: 0, max: 10 },
    ],
    textFields: [
      { id: 'confianza_conductas', label: 'Conductas observadas', placeholder: 'Describe las conductas observadas...' },
    ],
  },
  {
    id: 'regulacion',
    label: 'Regulación emocional',
    icon: '🧘',
    color: '#f59e0b',
    metrics: [
      { id: 'regulacion_frustracion', label: 'Gestiona adecuadamente frustración/enfado', min: 0, max: 10 },
      { id: 'regulacion_estabilidad', label: 'Recupera estabilidad emocional rápidamente', min: 0, max: 10 },
      { id: 'regulacion_funcional', label: 'Mantiene conductas funcionales cuando algo no sale como espera', min: 0, max: 10 },
      { id: 'regulacion_tolera_adverso', label: 'Tolera correcciones, decisiones arbitrales o situaciones adversas', min: 0, max: 10 },
    ],
    textFields: [
      { id: 'regulacion_desencadenantes', label: 'Situaciones desencadenantes observadas', placeholder: 'Describe las situaciones desencadenantes...' },
    ],
  },
  {
    id: 'comunicacion',
    label: 'Comunicación',
    icon: '🗣️',
    color: '#8b5cf6',
    metrics: [
      { id: 'comunicacion_companeras', label: 'Se comunica con compañeras', min: 0, max: 10 },
      { id: 'comunicacion_constructiva', label: 'Comunicación constructiva', min: 0, max: 10 },
      { id: 'comunicacion_info_util', label: 'Da información útil', min: 0, max: 10 },
      { id: 'comunicacion_escucha', label: 'Escucha/acepta indicaciones', min: 0, max: 10 },
      { id: 'comunicacion_adversa', label: 'Se sigue comunicando en situaciones adversas', min: 0, max: 10 },
    ],
    textFields: [
      { id: 'comunicacion_observaciones', label: 'Observaciones', placeholder: 'Observaciones sobre comunicación...' },
    ],
  },
  {
    id: 'motivacion',
    label: 'Motivación e implicación',
    icon: '🔥',
    color: '#ec4899',
    metrics: [
      { id: 'motivacion_intensidad', label: 'Intensidad e implicación con el equipo', min: 0, max: 10 },
      { id: 'motivacion_persistencia', label: 'Persistencia cuando la tarea es difícil', min: 0, max: 10 },
      { id: 'motivacion_protagonismo', label: 'Actitud en momentos de menor protagonismo', min: 0, max: 10 },
      { id: 'motivacion_no_destaca', label: 'Actitud cuando no gana/no destaca/no consigue el objetivo', min: 0, max: 10 },
    ],
    textFields: [
      { id: 'motivacion_observaciones', label: 'Observaciones', placeholder: 'Observaciones sobre motivación...' },
    ],
  },
  {
    id: 'mejora',
    label: 'Conductas de mejora y aprendizaje',
    icon: '📈',
    color: '#14b8a6',
    metrics: [
      { id: 'mejora_escucha', label: 'Escucha', min: 0, max: 10 },
      { id: 'mejora_pregunta', label: 'Pregunta', min: 0, max: 10 },
      { id: 'mejora_aplica', label: 'Aplica', min: 0, max: 10 },
      { id: 'mejora_justifica', label: 'Se justifica', min: 0, max: 10 },
      { id: 'mejora_enfada', label: 'Se molesta/enfada', min: 0, max: 10 },
      { id: 'mejora_disminuye', label: 'Disminuye su implicación', min: 0, max: 10 },
    ],
    textFields: [
      { id: 'mejora_otro', label: 'Otro', placeholder: 'Otras conductas observadas...' },
    ],
  },
  {
    id: 'presion',
    label: 'Conductas ante situaciones de presión',
    icon: '⚡',
    color: '#f97316',
    metrics: [],
    textFields: [
      { id: 'presion_marcador_adverso', label: 'Marcador adverso', placeholder: 'Comportamiento ante marcador adverso...' },
      { id: 'presion_final_partido', label: 'Final de partido', placeholder: 'Comportamiento en final de partido...' },
      { id: 'presion_error_propio', label: 'Error propio', placeholder: 'Comportamiento tras error propio...' },
      { id: 'presion_error_companera', label: 'Error de compañera', placeholder: 'Comportamiento tras error de compañera...' },
      { id: 'presion_correccion_entrenador', label: 'Corrección del entrenador', placeholder: 'Reacción ante corrección del entrenador...' },
      { id: 'presion_decision_arbitral', label: 'Decisión arbitral', placeholder: 'Reacción ante decisión arbitral...' },
    ],
  },
];

// Helper: obtener todos los IDs de métricas numéricas
export function getAllMetricIds() {
  const ids = [];
  evaluationCategories.forEach((cat) => {
    cat.metrics.forEach((m) => ids.push(m.id));
  });
  return ids;
}

// Helper: obtener todos los IDs de campos de texto
export function getAllTextFieldIds() {
  const ids = [];
  evaluationCategories.forEach((cat) => {
    cat.textFields.forEach((f) => ids.push(f.id));
  });
  return ids;
}

// Helper: crear evaluación vacía (todas las categorías activas por defecto)
export function createEmptyEvaluation(playerId) {
  const evaluation = {
    playerId,
    evalDate: new Date().toISOString().split('T')[0],
    sessionType: 'Entrenamiento',
    evaluator: '',
    observaciones_generales: '',
    excludedCategories: [], // Ninguna excluida en cada nueva evaluación
  };

  evaluationCategories.forEach((cat) => {
    cat.metrics.forEach((m) => {
      evaluation[m.id] = 5; // Valor por defecto: 5
    });
    cat.textFields.forEach((f) => {
      evaluation[f.id] = '';
    });
  });

  return evaluation;
}

// Helper: verificar si una categoría está excluida
export function isCategoryExcluded(evaluation, categoryId) {
  if (!evaluation || !evaluation.excludedCategories) return false;
  return evaluation.excludedCategories.includes(categoryId);
}

// Helper: calcular promedio de una categoría (devuelve null si está excluida)
export function getCategoryAverage(evaluation, categoryId) {
  if (isCategoryExcluded(evaluation, categoryId)) return null;
  const category = evaluationCategories.find((c) => c.id === categoryId);
  if (!category || category.metrics.length === 0) return null;

  const values = category.metrics.map((m) => evaluation[m.id] ?? 5);
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

// Helper: calcular promedios de todas las categorías activas para spider chart
export function getAllCategoryAverages(evaluation) {
  return evaluationCategories
    .filter((c) => c.metrics.length > 0 && !isCategoryExcluded(evaluation, c.id))
    .map((cat) => ({
      id: cat.id,
      label: cat.label,
      shortLabel: cat.label.split(' ')[0],
      value: getCategoryAverage(evaluation, cat.id),
      color: cat.color,
    }));
}

