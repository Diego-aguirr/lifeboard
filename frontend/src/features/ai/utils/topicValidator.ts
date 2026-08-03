/**
 * Topic Validator - Ensures chat messages are related to LifeBoard functionality
 * This is a client-side filter before sending to AI
 */

// Keywords related to LifeBoard: boards, productivity, learning, routines
const BOARD_KEYWORDS = [
  // Board-related
  'tablero', 'board', 'kanban', 'tarjeta', 'card', 'columna', 'column',
  'trello', 'backlog', 'sprint',
  
  // Productivity
  'productividad', 'productivity', 'tarea', 'task', 'proyecto', 'project',
  'objetivo', 'goal', 'meta', 'prioridad', 'priority', 'urgente', 'urgent',
  'importante', 'important', 'hacer', 'doing', 'hecho', 'done', 'completar',
  'completado', 'completed', 'pendiente', 'pending', 'borrador', 'draft',
  
  // Habits and routines
  'rutina', 'routine', 'hábito', 'habit', 'diario', 'daily', 'semanal',
  'weekly', 'mensual', 'monthly', 'frecuencia', 'frequency',
  
  // Reading and study
  'lectura', 'leer', 'leído', 'libro', 'libros', 'capítulo', 'capítulos',
  'chapter', 'chapters', 'página', 'páginas', 'page', 'reading',
  'estudiar', 'estudio', 'estudios', 'aprender', 'aprendizaje',
  'resumen', 'summary', 'anotar', 'notas', 'note', 'notes',
  
  // Learning & development (broader)
  'aprendiendo', 'aprendiz', 'cursos', 'curso', 'course', 'clase', 'classes',
  'practicar', 'practice', 'ejercicio', 'exercise', 'ejercicios',
  'desarrollo', 'development', 'diseño', 'design', 'marketing',
  'carrera', 'career', 'profesión', 'profession', 'habilidad', 'skill',
  'tecnología', 'technology', 'herramienta', 'tool', 'herramientas',
  'javascript', 'python', 'react', 'typescript', 'java', 'css', 'html',
  'idioma', 'language', 'inglés', 'english', 'español',
  
  // Organization
  'organizar', 'organize', 'planificar', 'plan', 'estructura', 'structure',
  'lista', 'list', 'checklist', 'seguimiento', 'tracking', 'progreso',
  'progress', 'avance', 'advance', 'cronograma', 'schedule', 'calendario',
  'calendar', 'semana', 'week', 'mes', 'month',
  
  // Work/Study contexts
  'trabajo', 'work', 'empleo', 'employment', 'freelance', 'negocio', 'business',
  'empresa', 'company', 'equipo', 'team', 'reunión', 'meeting',
  'estudiante', 'student', 'universidad', 'university', 'facultad',
  
  // Actions
  'crear', 'create', 'agregar', 'add', 'eliminar', 'delete', 'modificar',
  'modify', 'editar', 'edit', 'mover', 'move', 'reorganizar', 'reorganize',
  'armar', 'armame', 'generar', 'generá', 'organizame', 'organizá',
  'planificalo', 'planificá', 'distribuir', 'distribute', 'dividir', 'divide'
];

// Patterns that indicate non-board topics
const OFF_TOPIC_PATTERNS = [
  // Direct code help (but NOT "quiero aprender X" or "organizar X")
  /ens[eé]ñ[ame]+\s.*(programar|código|javascript|python|react)/i,
  /c[oó]mo\s+(se\s+)?(hace|escribe|programa|usa)\s.*(javascript|python|react|api)/i,
  /qué\s+(es|son|significa)\s.*(closure|callback|promise|async|variable|función|clase|objeto)/i,
  /ayudame\s+con\s+(c[oó]digo|un\s+bug|error\s+en)/i,
  /debuggear|debug|arreglar\s+(el\s+)?código/i,
  
  // Non-productivity topics
  /clima|weather/i,
  /deporte|sports/i,
  /receta|recipe|comida|food/i,
  /película|movie|serie|series/i,
  /juego|game/i,
  /música|music/i,
  /noticias|news/i,
  /política|politics/i,
  /religión|religion/i,
  
  // Jailbreak attempts
  /ignore.*instructions/i,
  /ignore.*rules/i,
  /system.*prompt/i,
  /act.*like|actuá.*como/i,
  /roleplay|role.*play/i,
  /jailbreak|hack/i,
  /bypass|evadir/i,
  /dios|god|deidad/i,
  /modo.*dios|god.*mode/i,
  
  // Content summarization (outside scope)
  /resum[ií]?(r|me|ilo|ela|elo|en|as|á|í)?\s.*(libro|capítulo|texto|artículo|página)/i,
  /resumen\s+(del|de|sobre|el)\s+(libro|capítulo|texto|artículo)/i,
  /qué\s+(dice|trata|cuenta|habla)\s+(el|la|este|esta)\s+(libro|capítulo)/i,
  
  // Personal questions
  /nombre.*real|real.*name/i,
  /quién.*eres|who.*are.*you/i,
  /edad|age/i,
  /ubicación|location/i,
  /dónde.*vivís|where.*do.*you.*live/i
];

/**
 * Check if a message is related to boards and productivity
 * @param message - User message to validate
 * @returns Object with validation result and optional error message
 */
export function validateBoardTopic(message: string): {
  isValid: boolean;
  error?: string;
  suggestion?: string;
} {
  const normalizedMessage = message.toLowerCase().trim();
  
  // Check for off-topic patterns first
  for (const pattern of OFF_TOPIC_PATTERNS) {
    if (pattern.test(normalizedMessage)) {
      return {
        isValid: false,
        error: 'Resumir contenido está fuera de alcance',
        suggestion: 'Puedo ayudarte a organizar una rutina de lectura o crear un tablero con capítulos. ¿Querés que te arme eso?'
      };
    }
  }
  
  // Check for board-related keywords
  const hasBoardKeyword = BOARD_KEYWORDS.some(keyword => 
    normalizedMessage.includes(keyword.toLowerCase())
  );
  
  if (!hasBoardKeyword) {
    return {
      isValid: false,
      error: 'Mensaje no relacionado con la app',
      suggestion: 'Puedo ayudarte a crear tableros, organizar rutinas de lectura, estudios, tareas y más. ¿Qué necesitás?'
    };
  }
  
  return { isValid: true };
}

/**
 * Get a list of suggested prompts for board-related queries
 */
export function getSuggestedPrompts(): string[] {
  return [
    'Crear un tablero para mis tareas del trabajo',
    'Organizar un proyecto de estudio',
    'Crear rutinas de ejercicio diarias',
    'Planificar un sprint de desarrollo',
    'Gestionar mis pendientes de la semana',
    'Organizar una rutina de lectura para un libro',
    'Crear un tablero con los capítulos de mi libro'
  ];
}

/**
 * Check if a message is asking to create a board
 */
export function isBoardCreationRequest(message: string): boolean {
  const creationPatterns = [
    /crear.*tablero/i,
    /tablero.*para/i,
    /necesito.*tablero/i,
    /quiero.*tablero/i,
    /haceme.*tablero/i,
    /armame.*tablero/i,
    /generar.*tablero/i,
    /generá.*tablero/i,
    /create.*board/i,
    /board.*for/i,
    /need.*board/i,
    /want.*board/i
  ];
  
  return creationPatterns.some(pattern => pattern.test(message));
}
