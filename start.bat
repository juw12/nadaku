@echo off
rem Nadaku local launcher: serves the app on http://localhost:8765 so the microphone (tone mirror)
rem and install-as-app work. Localhost counts as a secure context in Chrome and Edge.
cd /d "%~dp0"
where python >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:8765/index.html"
  python -m http.server 8765 --bind 127.0.0.1
  goto :eof
)
where py >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:8765/index.html"
  py -m http.server 8765 --bind 127.0.0.1
  goto :eof
)
echo Python not found. Opening the app directly (everything works except the microphone).
start "" "%~dp0index.html"
