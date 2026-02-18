import { ethers } from 'ethers'

/**
 * Deploy the given contract
 * @param {string} contractName name of the contract to deploy
 * @param {Array<any>} args list of constructor parameters
 * @param {number} [accountIndex] account index from the exposed account
 * @return {Promise<ethers.Contract>} deployed contract
 */
export const deploy = async (contractName: string, args: Array<any>, accountIndex?: number): Promise<ethers.Contract> => {

  console.log(`deploying ${contractName}`)
  // Note: script needs ABI from compilation artifact.
  // Make sure contract is compiled and artifacts are generated
  const artifactsPath = `browser/artifacts/${contractName}.json` // Change path if needed

  const metadata = JSON.parse(await remix.call('fileManager', 'getFile', artifactsPath))
  // 'web3Provider' is a Remix global variable object

  const signer = (new ethers.providers.Web3Provider(web3Provider)).getSigner(accountIndex)

  const factory = new ethers.ContractFactory(metadata.abi, metadata.data.bytecode.object, signer)

  const contract = await factory.deploy(...args)

  await contract.deployed()
  return contract
}