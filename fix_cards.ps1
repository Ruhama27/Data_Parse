$base = 'c:\Users\hp\Desktop\data parse\data parse'
$files = @('schedule.html', 'join.html', 'work.html', 'services.html', 'about.html', 'blog.html')
foreach ($f in $files) {
    $path = Join-Path $base $f
    $c = Get-Content $path -Raw
    $c = $c -replace 'background:rgba\(45,52,73,0\.6\)', 'background:rgba(18,39,74,0.85)'
    $c = $c -replace 'background: rgba\(45,52,73,0\.6\)', 'background: rgba(18,39,74,0.85)'
    $c = $c -replace 'border-top:1px solid rgba\(196,231,255,0\.1\)', 'border:1px solid rgba(57,88,134,0.4)'
    $c = $c -replace 'border-top: 1px solid rgba\(196, 231, 255, 0\.1\)', 'border: 1px solid rgba(57,88,134,0.4)'
    Set-Content $path $c -NoNewline
    Write-Host "Done: $f"
}
Write-Host "All done"
