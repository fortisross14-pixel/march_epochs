$ErrorActionPreference = 'Stop'
$packageRoot = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
$packageOutput = Join-Path $packageRoot 'art-packs'
$packageStaging = Join-Path $packageRoot ('.artifacts/people-packages-' + [guid]::NewGuid().ToString('N'))
New-Item -ItemType Directory -Force -Path $packageOutput, $packageStaging | Out-Null
$batches = @(
  @{ Age = 'origins'; Number = '01' },
  @{ Age = 'bronzeIron'; Number = '02' },
  @{ Age = 'classical'; Number = '03' },
  @{ Age = 'revolution'; Number = '08' }
)
foreach ($batch in $batches) {
  $packageName = 'age-' + $batch.Number + '-' + $batch.Age + '-people'
  $batchStaging = Join-Path $packageStaging $packageName
  $relativePeople = 'src/assets/ages/' + $batch.Age + '/people'
  $batchDestination = Join-Path $batchStaging $relativePeople
  New-Item -ItemType Directory -Force -Path $batchDestination | Out-Null
  Get-ChildItem -LiteralPath (Join-Path $packageRoot $relativePeople) -File | ForEach-Object {
    Copy-Item -LiteralPath $_.FullName -Destination $batchDestination
  }
  Copy-Item -LiteralPath (Join-Path $packageRoot 'docs/PEOPLE-ART-AND-COLLECTIONS.md') -Destination (Join-Path $batchStaging 'README.md')
  Copy-Item -LiteralPath (Join-Path $packageRoot 'docs/COLLECTIBLE-CARDS.md') -Destination (Join-Path $batchStaging 'COLLECTIBLE-CARDS.md')
  foreach ($relativeShared in @('src/components/PersonCard.jsx','src/components/PeopleReveal.jsx','src/person-card.css','src/assets/ui-kit/cards/person-frame.png','src/assets/ui-kit/cards/manifest.json','docs/COLLECTIBLE-CARDS.md')) {
    $sharedDestination = Join-Path $batchStaging $relativeShared
    New-Item -ItemType Directory -Force -Path (Split-Path -Parent $sharedDestination) | Out-Null
    Copy-Item -LiteralPath (Join-Path $packageRoot $relativeShared) -Destination $sharedDestination
  }
  Compress-Archive -Path (Join-Path $batchStaging '*') -DestinationPath (Join-Path $packageOutput ($packageName + '.zip')) -Force
  Write-Output ('Packaged ' + $packageName)
}
