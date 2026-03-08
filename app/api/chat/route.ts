import { NextRequest, NextResponse } from 'next/server';

// Respuestas inteligentes de respaldo
const respuestas: { [key: string]: string } = {
  hola: "¡Hola! Soy tu asistente de CuidArte. Estoy aquí para ayudarte con información sobre salud y bienestar para adultos mayores. ¿En qué puedo asistirte?",
  ejercicio: "Para adultos mayores, recomiendo ejercicios de bajo impacto como caminatas de 20-30 minutos, natación, tai chi o yoga suave. Es importante consultar con tu médico antes de comenzar cualquier rutina nueva.",
  alimentacion: "Una alimentación saludable para adultos mayores debe incluir frutas, verduras, proteínas magras, cereales integrales y lácteos bajos en grasa. Mantente bien hidratado bebiendo suficiente agua durante el día.",
  memoria: "Para mantener la memoria activa, te recomiendo: leer diariamente, resolver crucigramas o sudokus, aprender algo nuevo, socializar con amigos y familiares, y mantener una rutina de sueño regular.",
  dolor: "Si experimentas dolor persistente, es importante consultar a tu médico. Mientras tanto, aplicar calor o frío (según el tipo de dolor), descansar y mantener una postura adecuada puede ayudar.",
  medicamentos: "Es fundamental tomar los medicamentos exactamente como los prescribió tu médico. Si tienes dudas o efectos secundarios, consulta con tu médico o farmacéutico. Mantén una lista actualizada de todos tus medicamentos.",
  dormir: "Para mejorar el sueño: mantén un horario regular, evita cafeína por la tarde, crea un ambiente tranquilo y oscuro, y evita pantallas antes de dormir. Si los problemas persisten, consulta con tu médico.",
  default: "Entiendo tu pregunta. Como asistente de CuidArte, te recomiendo consultar con tu médico para obtener orientación específica sobre tu situación. ¿Hay algo más en lo que pueda ayudarte sobre evaluaciones de salud?"
};

function obtenerRespuestaLocal(mensaje: string): string {
  const mensajeLower = mensaje.toLowerCase();
  
  if (mensajeLower.includes('hola') || mensajeLower.includes('buenos') || mensajeLower.includes('saludos')) {
    return respuestas.hola;
  }
  if (mensajeLower.includes('ejercicio') || mensajeLower.includes('actividad fisica') || mensajeLower.includes('gimnasia')) {
    return respuestas.ejercicio;
  }
  if (mensajeLower.includes('comida') || mensajeLower.includes('alimentacion') || mensajeLower.includes('dieta') || mensajeLower.includes('comer')) {
    return respuestas.alimentacion;
  }
  if (mensajeLower.includes('memoria') || mensajeLower.includes('olvido') || mensajeLower.includes('recordar')) {
    return respuestas.memoria;
  }
  if (mensajeLower.includes('dolor') || mensajeLower.includes('duele')) {
    return respuestas.dolor;
  }
  if (mensajeLower.includes('medicamento') || mensajeLower.includes('pastilla') || mensajeLower.includes('medicina')) {
    return respuestas.medicamentos;
  }
  if (mensajeLower.includes('dormir') || mensajeLower.includes('sueño') || mensajeLower.includes('insomnio')) {
    return respuestas.dormir;
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

    console.log('Mensaje recibido:', message);

    // Intentar con Groq primero
    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer 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",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "mixtral-8x7b-32768",
            messages: [
              {
                role: "system",
                content: "Eres un asistente virtual especializado en cuidado de salud para adultos mayores de la plataforma CuidArte. Responde de manera clara, empática y profesional en español. Tus respuestas deben ser concisas, útiles y enfocadas en el bienestar de personas mayores."
              },
              {
                role: "user",
                content: message
              }
            ],
            temperature: 0.7,
            max_tokens: 300,
            top_p: 0.95
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.choices && data.choices.length > 0 && data.choices[0].message) {
          const assistantMessage = data.choices[0].message.content;
          return NextResponse.json({
            response: assistantMessage.trim()
          });
        }
      }
    } catch (apiError) {
      console.log('API falló, usando respuestas locales:', apiError);
    }

    // Si Groq falla, usar respuestas locales inteligentes
    const respuestaLocal = obtenerRespuestaLocal(message);
    return NextResponse.json({
      response: respuestaLocal
    });

  } catch (error) {
    console.error('Error en API chat:', error);
    return NextResponse.json({
      response: "Hola, soy tu asistente de CuidArte. Estoy aquí para ayudarte con preguntas sobre salud y bienestar para adultos mayores. ¿En qué puedo asistirte?"
    });
  }
}
