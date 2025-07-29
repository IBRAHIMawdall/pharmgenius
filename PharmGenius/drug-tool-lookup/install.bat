@echo off
echo Installing Drug Tool Lookup...

echo.
echo Installing Node.js dependencies...
call npm install

echo.
echo Installation complete!
echo.
echo To start the application:
echo   For development: npm run dev
echo   For production: npm run build && node server.js
echo.
pause