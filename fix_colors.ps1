$base = 'c:\Users\hp\Desktop\data parse\data parse'
$files = @('schedule.html','join.html','work.html','services.html','about.html','blog.html')
foreach ($f in $files) {
    $path = Join-Path $base $f
    $c = Get-Content $path -Raw
    $c = $c -replace '"background": "#0b1326"','"background": "#080f1e"'
    $c = $c -replace '"on-background": "#dae2fd"','"on-background": "#F0F3FA"'
    $c = $c -replace '"primary": "#8ed5ff"','"primary": "#8AAEE0"'
    $c = $c -replace '"primary-container": "#38bdf8"','"primary-container": "#628ECB"'
    $c = $c -replace '"secondary": "#4edea3"','"secondary": "#D5DEEF"'
    $c = $c -replace '"on-secondary": "#003824"','"on-secondary": "#0d1b35"'
    $c = $c -replace '"tertiary": "#c2cde5"','"tertiary": "#B1C9EF"'
    $c = $c -replace '"surface-container-low": "#131b2e"','"surface-container-low": "#0e1f3a"'
    $c = $c -replace '"surface-container": "#171f33"','"surface-container": "#12274a"'
    $c = $c -replace '"surface-container-lowest": "#060e20"','"surface-container-lowest": "#050c18"'
    $c = $c -replace '"outline-variant": "#3e484f"','"outline-variant": "#395886"'
    $c = $c -replace '"on-surface": "#dae2fd"','"on-surface": "#F0F3FA"'
    $c = $c -replace '"surface-variant": "#2d3449"','"surface-variant": "#1f3a6d"'
    $c = $c -replace '"surface-container-highest": "#2d3449"','"surface-container-highest": "#1f3a6d"'
    $c = $c -replace '"on-primary": "#00354a"','"on-primary": "#080f1e"'
    $c = $c -replace '"on-primary-container": "#004965"','"on-primary-container": "#F0F3FA"'
    $c = $c -replace '"surface": "#0b1326"','"surface": "#080f1e"'
    $c = $c -replace 'bg-\[#0b1326\]/90','bg-[#080f1e]/90'
    $c = $c -replace 'bg-\[#0b1326\]/95','bg-[#080f1e]/90'
    $c = $c -replace 'bg-\[#060e20\]','bg-[#050c18]'
    $c = $c -replace '#38bdf8','#628ECB'
    $c = $c -replace '#4edea3','#8AAEE0'
    $c = $c -replace '#8ed5ff','#8AAEE0'
    $c = $c -replace 'rgba\(56,189,248','rgba(98,142,203'
    $c = $c -replace 'rgba\(56, 189, 248','rgba(98, 142, 203'
    $c = $c -replace 'rgba\(142,213,255','rgba(138,174,224'
    $c = $c -replace 'rgba\(78,222,163','rgba(98,142,203'
    $c = $c -replace 'background-color: #0b1326','background-color: #080f1e'
    $c = $c -replace 'background-color:#0b1326','background-color:#080f1e'
    $c = $c -replace 'background: #060e20','background: #050c18'
    $c = $c -replace 'rgba\(45, 52, 73, 0\.6\)','rgba(18,39,74,0.7)'
    $c = $c -replace 'rgba\(45,52,73,0\.6\)','rgba(18,39,74,0.7)'
    Set-Content $path $c -NoNewline
    Write-Host "Done: $f"
}
Write-Host "All done."
