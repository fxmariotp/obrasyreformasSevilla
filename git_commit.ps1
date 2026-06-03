# Reload PATH environment variable from Registry
$machinePath = [System.Environment]::GetEnvironmentVariable("Path", "Machine")
$userPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
$env:Path = "$machinePath;$userPath"

Write-Output "Checking git version..."
git --version
if ($LASTEXITCODE -ne 0) {
    Write-Error "Git is still not found in the path. Please make sure Git is installed and in the system PATH."
    exit 1
}

# Check git status or init
if (!(Test-Path .git)) {
    Write-Output "Initializing git repository..."
    git init
}

# Add all files
git add .

# Check if email/name is configured. If not, set default placeholders
$gitName = git config user.name
$gitEmail = git config user.email

if ([string]::IsNullOrEmpty($gitName)) {
    Write-Output "Configuring temporary git user.name..."
    git config user.name "Usuario"
}
if ([string]::IsNullOrEmpty($gitEmail)) {
    Write-Output "Configuring temporary git user.email..."
    git config user.email "usuario@ejemplo.com"
}

# Commit
Write-Output "Committing changes..."
git commit -m "feat: complete landing page with services, projects, testimonials, faq, contact form and favicon in Sahara Warm Minimalism style"

Write-Output "Commit successful!"
