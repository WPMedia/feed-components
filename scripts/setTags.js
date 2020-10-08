const { exec } = require('child_process')

const release = process.argv[2]
if (!release) {
  console.error('Error: Missing Tag')
  process.exit(1)
}

const packages = JSON.parse(process.argv[3])
if (!packages) {
  console.log('packages Missing or are not valid json')
  process.exit(2)
}

const add = (package, version, tag) => {
  exec(
    `npm dist-tag add ${package}@${version} ${tag}`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`)
        return
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`)
        return
      }
    },
  )
}

packages.map((package) => {
  add(package.name, package.version, release)
})
