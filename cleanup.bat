@echo off
:: Cleanup script - removes all unnecessary files from the repo
:: Run this once from the repo root. It will NOT touch: server, frontend, collector, docker, structured_ddbb, *.md, package.json

cd /d "%~dp0"
echo Removing unnecessary folders and files...

rmdir /s /q browser-extension 2>nul
rmdir /s /q cloud-deployments 2>nul
rmdir /s /q embed 2>nul
rmdir /s /q extras 2>nul
rmdir /s /q images 2>nul
rmdir /s /q locales 2>nul
rmdir /s /q .devcontainer 2>nul
rmdir /s /q .github 2>nul
rmdir /s /q .vscode 2>nul

del /f /q ".hadolint.yaml" 2>nul
del /f /q ".editorconfig" 2>nul
del /f /q ".prettierignore" 2>nul
del /f /q ".prettierrc" 2>nul
del /f /q ".gitattributes" 2>nul
del /f /q ".gitmodules" 2>nul
del /f /q "eslint.config.js" 2>nul
del /f /q "dev.ps1" 2>nul
del /f /q "dev.bat" 2>nul
del /f /q "setup.bat" 2>nul
del /f /q "CONTRIBUTING.md" 2>nul
del /f /q "SECURITY.md" 2>nul
del /f /q "BARE_METAL.md" 2>nul
del /f /q "pull_request_template.md" 2>nul

echo.
echo Done! Remaining structure:
dir /b /a
echo.
echo Deleting this cleanup script too...
del /f /q "%~f0"
