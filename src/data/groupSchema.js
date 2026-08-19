// Esquema de Observación del Equipo (Observación Grupal) — Athletic Club Femenino

export const groupEvaluationCategories = [
  {
    id: 'cohesion',
    label: 'Cohesión',
    icon: '🤝',
    color: '#3b82f6',
    metrics: [
      { id: 'cohesion_apoyo_error', label: 'Se apoyan después de los errores', min: 0, max: 10 },
      { id: 'cohesion_ayuda_dificil', label: 'Se ayudan ante situaciones difíciles', min: 0, max: 10 },
      { id: 'cohesion_refuerzo_positivo', label: 'Existe refuerzo positivo entre ellas', min: 0, max: 10 },
      { id: 'cohesion_sensacion_equipo', label: 'Mantienen sensación de equipo en la adversidad', min: 0, max: 10 },
    ],
    textFields: [
      { id: 'cohesion_observaciones', label: 'Observaciones', placeholder: 'Notas sobre la cohesión del equipo...' },
    ],
  },
  {
    id: 'comunicacion',
    label: 'Comunicación colectiva',
    icon: '🗣️',
    color: '#8b5cf6',
    metrics: [
      { id: 'comunicacion_juego', label: 'Existe comunicación durante el juego', min: 0, max: 10 },
      { id: 'comunicacion_info_util', label: 'La comunicación aporta información útil', min: 0, max: 10 },
      { id: 'comunicacion_momentos_dificiles', label: 'La comunicación se mantiene en momentos difíciles', min: 0, max: 10 },
      { id: 'comunicacion_constructiva', label: 'Predomina comunicación constructiva frente a reproches', min: 0, max: 10 },
    ],
    textFields: [
      { id: 'comunicacion_observaciones', label: 'Observaciones', placeholder: 'Notas sobre la comunicación colectiva...' },
    ],
  },
  {
    id: 'respuesta_error',
    label: 'Respuesta colectiva al error',
    icon: '🔄',
    color: '#ef4444',
    metrics: [
      { id: 'error_continua_rapido', label: 'El equipo continúa rápidamente después de un error', min: 0, max: 10 },
      { id: 'error_reproches', label: 'Aparecen reproches después de un error', min: 0, max: 10 },
      { id: 'error_gestos_negativos', label: 'Aparecen gestos negativos después de un error', min: 0, max: 10 },
      { id: 'error_apoyo_companeras', label: 'Las compañeras apoyan después de un error', min: 0, max: 10 },
      { id: 'error_baja_comunicacion', label: 'Baja la comunicación después de un error', min: 0, max: 10 },
      { id: 'error_disminuye_intensidad', label: 'Disminuye la intensidad después de un error', min: 0, max: 10 },
      { id: 'error_precipita_acciones', label: 'Se precipitan las acciones después de un error', min: 0, max: 10 },
    ],
    textFields: [
      { id: 'error_tiempo_recuperacion', label: 'Tiempo aproximado para recuperar funcionamiento normal', placeholder: 'Ej. 2-3 minutos, inmediato, tras descanso...' },
    ],
  },
  {
    id: 'respuesta_adversidad',
    label: 'Respuesta ante la adversidad',
    icon: '🛡️',
    color: '#f97316',
    metrics: [
      { id: 'adversidad_comunicacion', label: 'Mantienen comunicación en momentos adversos', min: 0, max: 10 },
      { id: 'adversidad_intensidad', label: 'Mantienen intensidad en momentos adversos', min: 0, max: 10 },
      { id: 'adversidad_cooperacion', label: 'Mantienen cooperación en momentos adversos', min: 0, max: 10 },
      { id: 'adversidad_control_emocional', label: 'Mantienen control emocional en momentos adversos', min: 0, max: 10 },
    ],
    textFields: [
      { id: 'adversidad_que_cambia', label: '¿Qué cambia en el equipo cuando aparece la adversidad?', placeholder: 'Describe los cambios en la dinámica colectiva...' },
    ],
  },
  {
    id: 'liderazgo',
    label: 'Liderazgo',
    icon: '👑',
    color: '#ee2523',
    metrics: [],
    textFields: [
      { id: 'liderazgo_referente', label: '¿Quién aparece como referente cuando el equipo atraviesa dificultades?', placeholder: 'Jugadora(s) o líder(es) referentes en momentos difíciles...' },
    ],
  },
  {
    id: 'clima_emocional',
    label: 'Clima emocional',
    icon: '🌡️',
    color: '#f59e0b',
    metrics: [
      { id: 'clima_confianza', label: 'Confianza', min: 0, max: 10 },
      { id: 'clima_energia', label: 'Energía', min: 0, max: 10 },
      { id: 'clima_disfrute', label: 'Disfrute', min: 0, max: 10 },
      { id: 'clima_tension', label: 'Tensión', min: 0, max: 10 },
      { id: 'clima_frustracion', label: 'Frustración', min: 0, max: 10 },
      { id: 'clima_pasividad', label: 'Pasividad', min: 0, max: 10 },
      { id: 'clima_nerviosismo', label: 'Nerviosismo', min: 0, max: 10 },
      { id: 'clima_competitividad', label: 'Competitividad', min: 0, max: 10 },
    ],
    textFields: [
      { id: 'clima_otro', label: 'Otro', placeholder: 'Otras emociones observadas...' },
      { id: 'clima_cambios_relevantes', label: 'Cambios relevantes', placeholder: 'Cambios emocionales durante la sesión/partido...' },
    ],
  },
  {
    id: 'reaccion_cuerpo_tecnico',
    label: 'Reacción al cuerpo técnico',
    icon: '📋',
    color: '#14b8a6',
    metrics: [
      { id: 'tecnico_atencion', label: 'Atención a las explicaciones/correcciones', min: 0, max: 10 },
      { id: 'tecnico_receptividad', label: 'Receptividad al feedback', min: 0, max: 10 },
      { id: 'tecnico_aplicacion', label: 'Aplicación de las correcciones', min: 0, max: 10 },
      { id: 'tecnico_confianza_comunicar', label: 'Confianza para preguntar/comunicarse', min: 0, max: 10 },
    ],
    textFields: [
      { id: 'tecnico_observaciones', label: 'Observaciones', placeholder: 'Notas sobre la interacción con el cuerpo técnico...' },
    ],
  },
  {
    id: 'momentos_clave',
    label: 'Momentos clave',
    icon: '⚡',
    color: '#ec4899',
    metrics: [],
    textFields: [
      { id: 'momentos_situaciones_informativas', label: 'Situaciones especialmente informativas', placeholder: 'Momentos clave, jugadas o eventos significativos...' },
    ],
  },
];

export function createEmptyTeamObservation() {
  const obs = {
    evalDate: new Date().toISOString().split('T')[0],
    sessionType: 'Entrenamiento',
    evaluator: '',
    observaciones_generales: '',
    excludedCategories: [], // Ninguna excluida por defecto al iniciar nueva valoración
  };

  groupEvaluationCategories.forEach((cat) => {
    cat.metrics.forEach((m) => {
      obs[m.id] = 5;
    });
    cat.textFields.forEach((f) => {
      obs[f.id] = '';
    });
  });

  return obs;
}

export function isGroupCategoryExcluded(evaluation, categoryId) {
  if (!evaluation || !evaluation.excludedCategories) return false;
  return evaluation.excludedCategories.includes(categoryId);
}

export function getGroupCategoryAverage(evaluation, categoryId) {
  if (isGroupCategoryExcluded(evaluation, categoryId)) return null;
  const category = groupEvaluationCategories.find((c) => c.id === categoryId);
  if (!category || category.metrics.length === 0) return null;

  const values = category.metrics.map((m) => evaluation[m.id] ?? 5);
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

