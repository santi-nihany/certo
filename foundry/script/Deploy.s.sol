// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {HelperConfig} from "./HelperConfig.s.sol";
import {Surveys} from "../src/Surveys.sol";

contract DeploySurveys is Script {
    function run() external returns (Surveys, HelperConfig) {
        HelperConfig config = new HelperConfig();
        (address usdcUsdPriceFeed, address usdcToken, uint256 deployerKey) = config.activeNetworkConfig();
        console.log("--DeploySurveys--");
        console.log("usdc: ", usdcToken);
        vm.startBroadcast(deployerKey);
        Surveys surveys = new Surveys(usdcToken, usdcUsdPriceFeed);
        vm.stopBroadcast();

        return (surveys, config);
    }
}
