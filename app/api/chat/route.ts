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

    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `<s>[INST] Eres un asistente virtual especializado en cuidado de salud para adultos mayores de la plataforma CuidArte. Responde de manera clara, empática y profesional en español. Pregunta del usuario: ${message} [/INST]`,
          parameters: {
            max_new_tokens: 250,
            temperature: 0.7,
            top_p: 0.95,
            return_full_text: false
          }
        })
      }
    );

    const data = await response.json();

    // Manejar errores de la API
    if (data.error) {
      console.error('Error de Hugging Face:', data.error);
      
      // Si el modelo está cargando
      if (data.error.includes('loading')) {
        return NextResponse.json({
          response: "El asistente se está inicializando. Por favor, intenta de nuevo en unos segundos. ⏳"
        });
      }
      
      return NextResponse.json({
        response: "Lo siento, hubo un problema temporal. Por favor, intenta de nuevo."
      });
    }

    // Extraer la respuesta generada
    let generatedText = '';
    
    if (Array.isArray(data) && data[0]?.generated_text) {
      generatedText = data[0].generated_text;
    } else if (data.generated_text) {
      generatedText = data.generated_text;
    }

    if (!generatedText) {
      return NextResponse.json({
        response: "Lo siento, no pude generar una respuesta. ¿Puedes intentar reformular tu pregunta?"
      });
    }

    return NextResponse.json({
      response: generatedText.trim()
    });

  } catch (error) {
    console.error('Error en API chat:', error);
    return NextResponse.json(
      {
        response: "Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde."
      },
      { status: 500 }
    );
  }
}
