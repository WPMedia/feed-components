const { feedBlocks, tags } = require('./blockVersions')
const { exec, spawn } = require('child_process')

const releases = Object.values(tags)

const info = (cmd) => {
  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)
      return
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }
    const package = JSON.parse(stdout)
    console.log(`${package.name} - ${package.version}`)
    releases.map((release) => {
      console.log(`  ${release} - ${package['dist-tags'][release]}`)
    })
  })
}

feedBlocks.map((feed) => {
  // console.log(feed.name)
  info(`npm info ${feed.name} --json`)
})
