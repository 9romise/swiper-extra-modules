import { execSync as exec } from 'node:child_process'
import { cpSync } from 'node:fs'
import process from 'node:process'

const watch = process.argv.includes('--watch')

async function build() {
  exec(`tsup ${watch ? '--watch' : ''}`, { stdio: 'inherit' })
  cpSync('./src/types', './dist/types', { recursive: true })
}

build()
