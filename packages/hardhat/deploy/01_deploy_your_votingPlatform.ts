import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys the VotingPlatform contract
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployVotingPlatform: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { deployer } = await hre.getNamedAccounts();
    const { deploy } = hre.deployments;

    // Deploy the contract
    const deployment = await deploy("VotingPlatform", {
        from: deployer,
        log: true,
        autoMine: true, // Speeds up deployment on localhost
    });

    console.log(`✅ VotingPlatform deployed at: ${deployment.address}`);

    // Get the deployed contract
    const votingPlatform = await hre.ethers.getContract<Contract>("VotingPlatform", deployer);

    console.log(`🎯 Contract owner: ${deployer}`);
};

export default deployVotingPlatform;

// Tags allow running specific deploy scripts
deployVotingPlatform.tags = ["VotingPlatform"];
