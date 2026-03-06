# ✅ Logo Configurado

He configurado el logo de CuidArte en la aplicación:

## 🎨 Logo Actual
- **Ubicación**: `public/assets/img/logo-cuidarte.svg`
- **Estado**: Logo SVG temporal placeholder creado
- **Uso**: Navbar y Footer

## 📱 Para Reemplazar con tu Logo PNG:

### Opción 1: Reemplazo Simple
1. Guarda tu imagen como `public/assets/img/logo-cuidarte.png`
2. Abre `app/page.tsx`
3. Cambia `.svg` por `.png` en las dos líneas que usan el logo:
   - Línea del navbar: `<img src="/assets/img/logo-cuidarte.png" ...`
   - Línea del footer: `<img src="/assets/img/logo-cuidarte.png" ...`

### Opción 2: Usar SVG (Recomendado)
1. Convierte tu PNG a SVG usando https://convertio.co/png-svg/
2. Reemplaza el archivo `public/assets/img/logo-cuidarte.svg` con tu nuevo SVG
3. ¡Listo! No necesitas cambiar código

## 🌟 Favicons
Para los favicons (iconos del navegador), sigue estos pasos:

1. Ve a https://favicon.io/favicon-converter/
2. Sube tu logo PNG
3. Descarga el paquete de favicons
4. Extrae y reemplaza estos archivos en `public/assets/img/favicons/`:
   - `favicon.ico`
   - `favicon-16x16.png`
   - `favicon-32x32.png`
   - `apple-touch-icon.png`
   - `android-chrome-192x192.png`
   - `android-chrome-512x512.png`

## ✅ Configuración Actual
- ✅ Logo en Navbar (arriba)
- ✅ Logo en Footer (abajo)
- ✅ Favicons configurados en layout.tsx
- ✅ Altura del logo: 40px (navbar), 50px (footer)

¡Todo listo para usar tu logo personalizado!

