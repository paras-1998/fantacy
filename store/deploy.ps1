# Deployment script for UI changes to DigitalOcean
# Background color update: #92B53D

Write-Host "Starting deployment of UI changes..." -ForegroundColor Green

# Server details - UPDATE THESE IF NEEDED
$SERVER_IP = "your-server-ip"  # Get this from DigitalOcean dashboard
$USERNAME = "root"
$REMOTE_PATH = "/home/honest/store"  # Adjust if your path is different

Write-Host "`nPlease enter your server IP address:" -ForegroundColor Yellow
$SERVER_IP = Read-Host

Write-Host "`nUploading modified files..." -ForegroundColor Cyan

# Upload the 5 modified files
scp "d:\honest\store\src\components\Prog.tsx" "${USERNAME}@${SERVER_IP}:${REMOTE_PATH}/src/components/"
scp "d:\honest\store\src\pages\dashboard.tsx" "${USERNAME}@${SERVER_IP}:${REMOTE_PATH}/src/pages/"
scp "d:\honest\store\src\pages\purchases.tsx" "${USERNAME}@${SERVER_IP}:${REMOTE_PATH}/src/pages/"
scp "d:\honest\store\src\pages\TransactionHistory.tsx" "${USERNAME}@${SERVER_IP}:${REMOTE_PATH}/src/pages/"
scp "d:\honest\store\src\pages\ChangePassword.tsx" "${USERNAME}@${SERVER_IP}:${REMOTE_PATH}/src/pages/"

Write-Host "`nFiles uploaded successfully!" -ForegroundColor Green
Write-Host "`nNow SSH into your server and run:" -ForegroundColor Yellow
Write-Host "cd ${REMOTE_PATH}" -ForegroundColor White
Write-Host "npm run build" -ForegroundColor White
Write-Host "pm2 restart all" -ForegroundColor White
Write-Host "`nOr run this command to do it all at once:" -ForegroundColor Yellow
Write-Host "ssh ${USERNAME}@${SERVER_IP} 'cd ${REMOTE_PATH} && npm run build && pm2 restart all'" -ForegroundColor White
