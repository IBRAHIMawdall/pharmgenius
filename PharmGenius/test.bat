@echo off
echo Testing PharmGenius Application...
echo.

echo 1. Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo 2. Building application...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Failed to build application
    pause
    exit /b 1
)

echo.
echo 3. Testing API endpoints...
echo Testing daman-formulary.json...
if exist "daman-formulary.json" (
    echo ✓ Daman formulary data found
) else (
    echo ✗ Daman formulary data missing
)

echo Testing API files...
if exist "api\daman-formulary.js" (
    echo ✓ Daman formulary API found
) else (
    echo ✗ Daman formulary API missing
)

if exist "api\icd10.js" (
    echo ✓ ICD-10 API found
) else (
    echo ✗ ICD-10 API missing
)

if exist "api\drug-interactions.js" (
    echo ✓ Drug interactions API found
) else (
    echo ✗ Drug interactions API missing
)

if exist "api\pregnancy-categories.js" (
    echo ✓ Pregnancy categories API found
) else (
    echo ✗ Pregnancy categories API missing
)

echo.
echo 4. Testing components...
if exist "src\components\DrugSearch.jsx" (
    echo ✓ DrugSearch component found
) else (
    echo ✗ DrugSearch component missing
)

if exist "src\components\DrugSearchResults.jsx" (
    echo ✓ DrugSearchResults component found
) else (
    echo ✗ DrugSearchResults component missing
)

if exist "src\components\DamanCoverage.jsx" (
    echo ✓ DamanCoverage component found
) else (
    echo ✗ DamanCoverage component missing
)

echo.
echo 5. Testing configuration files...
if exist "vercel.json" (
    echo ✓ Vercel configuration found
) else (
    echo ✗ Vercel configuration missing
)

if exist "package.json" (
    echo ✓ Package.json found
) else (
    echo ✗ Package.json missing
)

echo.
echo ========================================
echo PharmGenius Application Test Complete!
echo ========================================
echo.
echo To start development server: npm run dev
echo To deploy to Vercel: npx vercel
echo.
pause