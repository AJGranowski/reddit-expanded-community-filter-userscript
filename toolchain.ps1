# This script starts a temporary docker container, then forwards all the script arguments to it.

# Call the shell script with WSL
& 'wsl' '--exec' ('./{0}' -f [System.Io.Path]::GetFileNameWithoutExtension($PSCommandPath)) $args