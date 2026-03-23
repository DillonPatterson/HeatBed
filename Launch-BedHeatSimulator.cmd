@echo off
setlocal

cd /d "%~dp0"

set "APP_URL=http://127.0.0.1:4173"
set "APP_PORT=4173"

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo npm was not found. Install Node.js first, then run this launcher again.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo Installing dependencies...
  call npm.cmd install
  if errorlevel 1 (
    echo Dependency install failed.
    pause
    exit /b 1
  )
)

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$listener = Get-NetTCPConnection -LocalPort %APP_PORT% -State Listen -ErrorAction SilentlyContinue | Select-Object -First 1; if ($listener) { exit 0 } else { exit 1 }"
if errorlevel 1 (
  start "Bed Heat Simulator Server" cmd /k "cd /d ""%~dp0"" && npm.cmd run dev -- --host 127.0.0.1 --port %APP_PORT%"
)

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$url = '%APP_URL%'; $deadline = (Get-Date).AddSeconds(25); do { try { $response = Invoke-WebRequest -UseBasicParsing $url -TimeoutSec 2; if ($response.StatusCode -ge 200) { Start-Process $url; exit 0 } } catch {} Start-Sleep -Milliseconds 500 } while ((Get-Date) -lt $deadline); exit 1"
if errorlevel 1 (
  echo The local server did not become ready at %APP_URL%.
  echo If a terminal window opened with an error, fix that and run this launcher again.
  pause
  exit /b 1
)

exit /b 0
