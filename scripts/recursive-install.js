const fs = require('fs')
const path = require('path')
const childProcess = require('child_process')

const ROOT_DIR = path.resolve(__dirname, '..')
const BLOCK_DIR = path.resolve(ROOT_DIR, 'blocks')
const NPMRC = path.resolve(ROOT_DIR, '.npmrc')

const copyNpmrc = fs.existsSync(NPMRC) && fs.statSync(NPMRC).isFile() ?
  (dirname) => fs.copyFileSync(NPMRC, path.resolve(dirname, '.npmrc'))
  : () => {}


fs.readdirSync(BLOCK_DIR)
  .map(part => path.join(BLOCK_DIR, part))
  .filter(blockDir => fs.statSync(blockDir).isDirectory())
  .forEach(dirname => {
    copyNpmrc(dirname)
    childProcess.execSync('npm ci', { cwd: dirname, stdio: 'inherit' })
  })
