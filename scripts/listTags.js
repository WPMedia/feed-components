const { feedBlocks, tags } = require('./blockVersions')
const { exec } = require('child_process')

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
    const npmPackage = JSON.parse(stdout)
    console.log(`${npmPackage.name} - ${npmPackage.version}`)
    releases.map((release) => {
      console.log(`  ${release} - ${npmPackage['dist-tags'][release]}`)
    })
  })
}

feedBlocks.map((feed) => {
  // console.log(feed.name)
  info(`npm info ${feed.name} --json`)
})
