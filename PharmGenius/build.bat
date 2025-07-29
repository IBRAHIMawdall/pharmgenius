@echo off
echo Building PharmGenius application...
call npm install
call npm run build
echo Build completed successfully!
echo.
echo To deploy to Vercel, run:
echo npx vercel
pause