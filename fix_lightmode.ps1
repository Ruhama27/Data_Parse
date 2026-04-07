$base = 'c:\Users\hp\Desktop\data parse\data parse'
$files = @('schedule.html', 'join.html', 'work.html', 'services.html', 'about.html', 'blog.html')

$lightFix = @'

      /* ── LIGHT MODE: Fix text visibility ── */
      html.light .text-on-background { color: #080f1e !important; }
      html.light .text-on-surface     { color: #0d1b35 !important; }
      html.light .text-on-primary     { color: #f0f3fa !important; }
      html.light .text-on-secondary   { color: #0d1b35 !important; }
      html.light .text-on-primary-container { color: #f0f3fa !important; }
      html.light .text-primary           { color: #2a5ba8 !important; }
      html.light .text-primary-container { color: #1f3a6d !important; }
      html.light .text-secondary         { color: #15406b !important; }
      html.light h1,
      html.light h2,
      html.light h3,
      html.light h4 { color: #080f1e !important; }
      html.light .tech-badge {
        color: #1f3a6d !important;
        background: rgba(57, 88, 134, 0.12) !important;
        border-color: rgba(57, 88, 134, 0.25) !important;
      }
      html.light .glass-card {
        background: rgba(255, 255, 255, 0.93) !important;
        border: 1px solid rgba(57, 88, 134, 0.2) !important;
      }
      html.light .grid-bg {
        background-image:
          linear-gradient(to right, rgba(57, 88, 134, 0.06) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(57, 88, 134, 0.06) 1px, transparent 1px);
      }
      html.light .card-hover:hover {
        box-shadow: 0 16px 48px rgba(57, 88, 134, 0.18);
      }
'@

$anchor = 'html.light footer {'

foreach ($f in $files) {
  $path = Join-Path $base $f
  $c = Get-Content $path -Raw
  if ($c -notmatch 'LIGHT MODE: Fix text visibility') {
    $c = $c -replace [regex]::Escape($anchor), ($lightFix + "`n      " + $anchor)
    Set-Content $path $c -NoNewline
    Write-Host "Patched: $f"
  }
  else {
    Write-Host "Already patched: $f"
  }
}
Write-Host "Done."
