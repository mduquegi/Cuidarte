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

    // Llamada a Hugging Face API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/meta-llama/Llama-3.2-3B-Instruct",
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer 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",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: message,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true
          },
          options: {
            wait_for_model: true,
            use_cache: false
          }
        })
      }
    );

    if (!response.ok) {
      console.error('Error HTTP:', response.status);
      return NextResponse.json({
        response: "El asistente está ocupado en este momento. Por favor, intenta de nuevo en unos segundos."
      });
    }

    const data = await response.json();
    console.log('Respuesta de Hugging Face:', data);

    // Manejar errores de la API
    if (data.error) {
      console.error('Error de Hugging Face:', data.error);
      
      // Si el modelo está cargando
      if (typeof data.error === 'string' && data.error.includes('loading')) {
        return NextResponse.json({
          response: "El asistente se está inicializando. Por favor, espera 20 segundos e intenta de nuevo. ⏳"
        });
      }
      
      return NextResponse.json({
        response: "El asistente está procesando. Por favor, intenta de nuevo."
      });
    }

    // Extraer la respuesta generada
    let generatedText = '';
    
    if (Array.isArray(data) && data.length > 0) {
      if (data[0].generated_text) {
        generatedText = data[0].generated_text;
      }
    } else if (data.generated_text) {
      generatedText = data.generated_text;
    }

    if (!generatedText) {
      console.error('No se generó texto:', data);
      return NextResponse.json({
        response: "Hola, soy tu asistente de CuidArte. Puedo ayudarte con información sobre salud y bienestar para adultos mayores. ¿En qué puedo asistirte?"
      });
    }

    // Limpiar la respuesta (remover el input si viene incluido)
    const cleanedText = generatedText.replace(message, '').trim();

    return NextResponse.json({
      response: cleanedText || generatedText
    });

  } catch (error) {
    console.error('Error en API chat:', error);
    return NextResponse.json({
      response: "Soy tu asistente de CuidArte. Estoy aquí para ayudarte con preguntas sobre salud y bienestar. ¿Qué necesitas saber?"
    });
  }
}

export const runtime = 'edge';
