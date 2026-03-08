# Script para verificar y desplegar el logo

Write-Host "`n🎨 VERIFICANDO LOGO CUIDARTE...`n" -ForegroundColor Cyan

# Verificar logo principal
if (Test-Path "public\assets\img\logo-cuidarte.png") {
    Write-Host "✅ Logo principal encontrado!" -ForegroundColor Green
    $logoOk = $true
} else {
    Write-Host "❌ Logo principal NO encontrado" -ForegroundColor Red
    Write-Host "   Por favor guarda la imagen como: public\assets\img\logo-cuidarte.png" -ForegroundColor Yellow
    $logoOk = $false
}

# Verificar favicons
Write-Host "`n📱 Verificando favicons..." -ForegroundColor Cyan
$favicons = @(
    "favicon.ico",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "apple-touch-icon.png",
    "android-chrome-192x192.png",
    "android-chrome-512x512.png"
)

$faviconCount = 0
foreach ($favicon in $favicons) {
    if (Test-Path "public\assets\img\favicons\$favicon") {
        Write-Host "   ✅ $favicon" -ForegroundColor Green
        $faviconCount++
    } else {
        Write-Host "   ❌ $favicon" -ForegroundColor Red
    }
}

# Resumen
Write-Host "`n📊 RESUMEN:" -ForegroundColor Cyan
Write-Host "   Logo principal: $(if($logoOk){'✅'}else{'❌'})" -ForegroundColor $(if($logoOk){'Green'}else{'Red'})
Write-Host "   Favicons: $faviconCount/6 encontrados" -ForegroundColor $(if($faviconCount -eq 6){'Green'}elseif($faviconCount -gt 0){'Yellow'}else{'Red'})

# Ofrecer deployment
if ($logoOk) {
    Write-Host "`n¿Deseas hacer commit y push de los cambios? (S/N)" -ForegroundColor Yellow
    $respuesta = Read-Host
    
    if ($respuesta -eq 'S' -or $respuesta -eq 's') {
        Write-Host "`n🚀 Desplegando..." -ForegroundColor Cyan
        
        git add .
        git commit -m "Agregar logo oficial CuidArte"
        git push origin master
        
        Write-Host "`n✅ ¡Cambios desplegados!" -ForegroundColor Green
        Write-Host "   Vercel actualizará tu sitio en 2-3 minutos" -ForegroundColor Cyan
    }
} else {
    Write-Host "`n⚠️  Guarda el logo principal primero y vuelve a ejecutar este script" -ForegroundColor Yellow
}

Write-Host "`n"
