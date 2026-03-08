import { NextRequest, NextResponse } from 'next/server';

// Respuestas inteligentes del asistente
const respuestas: { [key: string]: string } = {
  hola: "¡Hola! Soy tu asistente de CuidArte. Estoy aquí para ayudarte con información sobre salud y bienestar para adultos mayores. ¿En qué puedo asistirte?",
  ejercicio: "Para adultos mayores, recomiendo ejercicios de bajo impacto como caminatas de 20-30 minutos, natación, tai chi o yoga suave. Es importante consultar con tu médico antes de comenzar cualquier rutina nueva.",
  alimentacion: "Una alimentación saludable para adultos mayores debe incluir frutas, verduras, proteínas magras, cereales integrales y lácteos bajos en grasa. Mantente bien hidratado bebiendo suficiente agua durante el día.",
  memoria: "Para mantener la memoria activa, te recomiendo: leer diariamente, resolver crucigramas o sudokus, aprender algo nuevo, socializar con amigos y familiares, y mantener una rutina de sueño regular.",
  dolor: "Si experimentas dolor persistente, es importante consultar a tu médico. Mientras tanto, aplicar calor o frío (según el tipo de dolor), descansar y mantener una postura adecuada puede ayudar.",
  medicamentos: "Es fundamental tomar los medicamentos exactamente como los prescribió tu médico. Si tienes dudas o efectos secundarios, consulta con tu médico o farmacéutico. Mantén una lista actualizada de todos tus medicamentos.",
  dormir: "Para mejorar el sueño: mantén un horario regular, evita cafeína por la tarde, crea un ambiente tranquilo y oscuro, y evita pantallas antes de dormir. Si los problemas persisten, consulta con tu médico.",
  test: "En CuidArte ofrecemos cuatro tipos de evaluaciones: Test Funcional (equilibrio y reacción), Test Cognitivo (memoria), Test de Estado Mental (GDS) y Test de Espacio de Vida (movilidad). Puedes realizarlos desde el botón 'Realizar Evaluaciones'.",
  resultados: "Puedes ver todos tus resultados y seguir tu progreso haciendo clic en el botón 'Resultados' en la parte superior. Allí encontrarás gráficos y estadísticas de tus evaluaciones.",
  default: "Entiendo tu pregunta. Como asistente de CuidArte, te recomiendo consultar con tu médico para obtener orientación específica sobre tu situación. ¿Hay algo más en lo que pueda ayudarte sobre evaluaciones de salud?"
};

function obtenerRespuestaInteligente(mensaje: string): string {
  const mensajeLower = mensaje.toLowerCase();
  
  if (mensajeLower.includes('hola') || mensajeLower.includes('buenos') || mensajeLower.includes('saludos')) {
    return respuestas.hola;
  }
  if (mensajeLower.includes('ejercicio') || mensajeLower.includes('actividad fisica') || mensajeLower.includes('gimnasia') || mensajeLower.includes('caminar')) {
    return respuestas.ejercicio;
  }
  if (mensajeLower.includes('comida') || mensajeLower.includes('alimentacion') || mensajeLower.includes('dieta') || mensajeLower.includes('comer') || mensajeLower.includes('nutrición')) {
    return respuestas.alimentacion;
  }
  if (mensajeLower.includes('memoria') || mensajeLower.includes('olvido') || mensajeLower.includes('recordar') || mensajeLower.includes('cerebro')) {
    return respuestas.memoria;
  }
  if (mensajeLower.includes('dolor') || mensajeLower.includes('duele') || mensajeLower.includes('molestia')) {
    return respuestas.dolor;
  }
  if (mensajeLower.includes('medicamento') || mensajeLower.includes('pastilla') || mensajeLower.includes('medicina') || mensajeLower.includes('farmaco')) {
    return respuestas.medicamentos;
  }
  if (mensajeLower.includes('dormir') || mensajeLower.includes('sueño') || mensajeLower.includes('insomnio') || mensajeLower.includes('descanso')) {
    return respuestas.dormir;
  }
  if (mensajeLower.includes('test') || mensajeLower.includes('evaluacion') || mensajeLower.includes('prueba') || mensajeLower.includes('examen')) {
    return respuestas.test;
  }
  if (mensajeLower.includes('resultado') || mensajeLower.includes('progreso') || mensajeLower.includes('historial')) {
    return respuestas.resultados;
  }
  
  return respuestas.default;
}

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Mensaje requerido' },
        { status: 400 }
      );
    }

    const respuesta = obtenerRespuestaInteligente(message);
    
    return NextResponse.json({
      response: respuesta
    });

  } catch (error) {
    console.error('Error en API chat:', error);
    return NextResponse.json({
      response: "Hola, soy tu asistente de CuidArte. Estoy aquí para ayudarte con preguntas sobre salud y bienestar para adultos mayores. ¿En qué puedo asistirte?"
    });
  }
}
