# 💙 CuidArte - Plataforma de Seguimiento de Salud para Adultos Mayores

## 📋 Descripción

**CuidArte** es una aplicación web diseñada para realizar evaluaciones de salud en adultos mayores desde la comodidad del hogar. La plataforma permite hacer seguimiento longitudinal de cuatro aspectos clave de la salud mediante tests clínicamente validados.

### 🎯 Aspectos Evaluados

1. **📊 Capacidad Funcional** - Test de equilibrio y tiempo de reacción
2. **🧠 Capacidad Cognitiva** - Test de memoria y atención
3. **💭 Estado Mental** - Escala de depresión geriátrica (GDS-5)
4. **🌍 Espacio Vital** - Evaluación de movilidad y autonomía

## ✨ Características Principales

### Accesibilidad
- ✅ **Alto contraste** con colores claros y texto grande
- ✅ **Síntesis de voz** para leer instrucciones (sin necesidad de API key)
- ✅ **Botones grandes** fáciles de presionar
- ✅ **Interfaz intuitiva** diseñada para adultos mayores

### Funcionalidades
- 📈 **Seguimiento longitudinal** con almacenamiento local de resultados
- 📊 **Gráficos de evolución** para visualizar progreso en el tiempo
- ⏱️ **Sesiones cortas** (menos de 30 minutos total)
- 💾 **Almacenamiento automático** sin necesidad de cuenta

## 🛠️ Tecnologías Utilizadas

- **Next.js 16** - Framework de React
- **React 19** - Librería de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS v4** - Estilos y diseño responsive
- **Recharts** - Gráficos para visualización de datos
- **Web Speech API** - Síntesis de voz (nativa del navegador, sin API key)

## 📦 Instalación y Uso

### Requisitos
- Node.js 18 o superior
- npm, yarn, pnpm o bun

### Pasos

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

### Comandos Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Construir para producción
npm start        # Servidor de producción
npm run lint     # Ejecutar linter
```

## 📖 Guía de Uso

1. **Primer Uso**: Ingrese nombre y edad
2. **Menú Principal**: Seleccione un test
3. **Tests**: Siga las instrucciones (use 🔊 para voz)
4. **Resultados**: Se guardan automáticamente
5. **Seguimiento**: Ver gráficos de evolución

### Tests Disponibles

- **Capacidad Funcional** (2-3 min): Equilibrio y reacción
- **Capacidad Cognitiva** (3-4 min): Memoria de palabras
- **Estado Mental** (2-3 min): GDS-5 para bienestar emocional
- **Espacio Vital** (3-4 min): Movilidad y autonomía

## 🔬 Fundamentación Clínica

Todos los tests están basados en instrumentos validados:
- **TUG Test** (Timed Up and Go)
- **MMSE** (Mini-Mental State Examination)  
- **GDS-5** (Geriatric Depression Scale)
- **LSA** (Life-Space Assessment)

## 💡 Ventajas

- ✅ Autoevaluación desde casa
- ✅ Detección temprana de cambios
- ✅ Interfaz accesible para adultos mayores
- ✅ No requiere API keys ni costos
- ✅ Datos privados (solo en navegador)
- ✅ Seguimiento longitudinal con gráficos

## ⚠️ Problemas Enfrentados y Soluciones

1. **Compatibilidad React 19**: Actualización a lucide-react v0.469.0
2. **Síntesis de voz gratuita**: Web Speech API nativa
3. **Almacenamiento privado**: LocalStorage sin backend
4. **Accesibilidad**: Texto grande, alto contraste, botones grandes
5. **Tiempo de sesión**: Tests cortos (2-4 min cada uno)

## 📊 Estructura del Proyecto

```
app/
├── components/
│   ├── UI.tsx              # Componentes base
│   ├── FunctionalTest.tsx  # Test funcional
│   ├── CognitiveTest.tsx   # Test cognitivo
│   ├── MentalTest.tsx      # Test mental
│   ├── LifeSpaceTest.tsx   # Test espacio vital
│   └── Results.tsx         # Panel de resultados
├── types.ts                # Tipos TypeScript
├── utils.ts                # Utilidades (storage, voz)
├── page.tsx                # Página principal
└── layout.tsx              # Layout
```

## 🎯 Público Objetivo

- Adultos mayores (65+ años)
- Cuidadores familiares y profesionales
- Centros de día
- Profesionales de salud (seguimiento remoto)

## 📝 Notas Importantes

- **Sin API keys necesarias**: Usa tecnologías nativas del navegador
- **Privacidad**: Todos los datos se almacenan localmente
- **Navegadores compatibles**: Chrome, Edge, Firefox, Safari (modernos)
- **No es diagnóstico**: Herramienta de detección, consulte profesionales

---

**Versión**: 1.0.0  
**Desarrollado con** ❤️ **para el cuidado de adultos mayores**
