// This script can be used to deploy the "SecureVoting" contract using ethers.js library.
// Please make sure to compile "./contracts/SecureVoting.sol" file before running this script.
// And use Right click -> "Run" from context menu of the file to run the script. Shortcut: Ctrl+Shift+S

import { deploy } from './ethers-lib'

(async () => {
  try {
    const result = await deploy('SecureVoting', [])
    console.log(`address: ${result.address}`)
  } catch (e: any) {
    console.log(e.message)
  }
})()