# 🎨 INSTRUCCIONES: Guardar Logo CuidArte

## PASO 1: Guardar el Logo Principal

1. **Descarga la imagen** del logo que enviaste (el corazón azul con la persona)
2. **Guárdala como**: `logo-cuidarte.png`
3. **Colócala en**: `public/assets/img/logo-cuidarte.png`

### Ruta completa:
```
C:\Users\Mariana\Desktop\cuidarte\public\assets\img\logo-cuidarte.png
```

## PASO 2: Crear Favicons (Íconos del Navegador)

### Opción A: Usando Herramienta Online (MÁS FÁCIL) ✅

1. Ve a: https://favicon.io/favicon-converter/
2. Sube tu imagen `logo-cuidarte.png`
3. Haz clic en "Download"
4. Extrae el archivo ZIP descargado
5. Copia TODOS los archivos a: `public/assets/img/favicons/`

Los archivos que necesitas son:
- `favicon.ico`
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png`
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`

### Opción B: Manualmente (si tienes Photoshop/GIMP)

Crea las siguientes versiones del logo:

| Archivo | Tamaño | Ubicación |
|---------|--------|-----------|
| `favicon.ico` | 16x16, 32x32, 48x48 | `public/assets/img/favicons/` |
| `favicon-16x16.png` | 16x16px | `public/assets/img/favicons/` |
| `favicon-32x32.png` | 32x32px | `public/assets/img/favicons/` |
| `apple-touch-icon.png` | 180x180px | `public/assets/img/favicons/` |
| `android-chrome-192x192.png` | 192x192px | `public/assets/img/favicons/` |
| `android-chrome-512x512.png` | 512x512px | `public/assets/img/favicons/` |

## ✅ VERIFICAR

Después de guardar todo, verifica que existan estos archivos:

```
public/
  assets/
    img/
      logo-cuidarte.png          ← Logo principal
      favicons/
        favicon.ico              ← Favicons
        favicon-16x16.png
        favicon-32x32.png
        apple-touch-icon.png
        android-chrome-192x192.png
        android-chrome-512x512.png
```

## 🚀 DESPLEGAR

Una vez guardados todos los archivos:

```bash
git add .
git commit -m "Actualizar logo y favicons con imagen oficial"
git push origin master
```

¡Vercel lo desplegará automáticamente en 2-3 minutos!
