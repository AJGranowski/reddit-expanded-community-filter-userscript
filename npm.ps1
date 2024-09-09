# Call the matching shell script with WSL
& 'wsl' '--exec' ('./{0}' -f [System.Io.Path]::GetFileNameWithoutExtension($PSCommandPath)) $args