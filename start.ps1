$ErrorActionPreference = 'Stop'
node (Join-Path $PSScriptRoot 'school-deadlines\server.cjs')
