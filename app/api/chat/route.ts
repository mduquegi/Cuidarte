import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Mensaje requerido' },
        { status: 400 }
      );
    }

    // Llamada a Groq API
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-70b-versatile",
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
          top_p: 0.9
        })
      }
    );

    if (!response.ok) {
      console.error('Error HTTP:', response.status);
      const errorData = await response.json();
      console.error('Error details:', errorData);
      return NextResponse.json({
        response: "Lo siento, hubo un problema al procesar tu solicitud. Por favor, intenta de nuevo."
      });
    }

    const data = await response.json();
    console.log('Respuesta de Groq:', data);

    // Extraer la respuesta del formato de Groq/OpenAI
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      const assistantMessage = data.choices[0].message.content;
      return NextResponse.json({
        response: assistantMessage.trim()
      });
    }

    return NextResponse.json({
      response: "Lo siento, no pude generar una respuesta. ¿Puedes reformular tu pregunta?"
    });

  } catch (error) {
    console.error('Error en API chat:', error);
    return NextResponse.json({
      response: "Hola, soy tu asistente de CuidArte. Estoy aquí para ayudarte con preguntas sobre salud y bienestar para adultos mayores. ¿En qué puedo asistirte?"
    });
  }
}

export const runtime = 'edge';
