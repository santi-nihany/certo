// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {MockV3Aggregator} from "../test/mocks/MockV3Aggregator.sol";
import {ERC20Mock} from "../test/mocks/ERC20Mock.sol";

contract HelperConfig is Script {
    NetworkConfig public activeNetworkConfig;

    struct NetworkConfig {
        address usdc;
        uint256 deployerKey;
    }

    uint256 public DEFAULT_ANVIL_PRIVATE_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

    uint256 public constant SEPOLIA_CHAIN_ID = 11_155_111;
    uint256 public constant AMOY_CHAIN_ID = 80002;
    uint256 public constant ZKSYNCSEPOLIA_CHAIN_ID = 300;
    uint256 public constant POLYGON_CHAIN_ID = 137;
    uint256 public constant AVALANCHEFUJI_CHAIN_ID = 43113;

    constructor() {
        if (block.chainid == SEPOLIA_CHAIN_ID) {
            activeNetworkConfig = getSepoliaEthConfig();
        } else if (block.chainid == AMOY_CHAIN_ID) {
            activeNetworkConfig = getAmoyConfig();
        } else if (block.chainid == ZKSYNCSEPOLIA_CHAIN_ID) {
            activeNetworkConfig = getZkSyncSepoliaConfig();
        } else if (block.chainid == POLYGON_CHAIN_ID) {
            activeNetworkConfig = getZkSyncSepoliaConfig();
        } else if (block.chainid == AVALANCHEFUJI_CHAIN_ID) {
            activeNetworkConfig = getAvalancheFujiEthConfig();
        } else {
            activeNetworkConfig = getOrCreateAnvilEthConfig();
        }
    }

    function getSepoliaEthConfig() public view returns (NetworkConfig memory sepoliaNetworkConfig) {
        sepoliaNetworkConfig =
            NetworkConfig({usdc: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238, deployerKey: vm.envUint("PRIVATE_KEY")});
    }

    function getAmoyConfig() public view returns (NetworkConfig memory amoyNetworkConfig) {
        amoyNetworkConfig =
            NetworkConfig({usdc: 0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582, deployerKey: vm.envUint("PRIVATE_KEY")});
    }

    function getZkSyncSepoliaConfig() public view returns (NetworkConfig memory zkSyncSepoliaConfig) {
        zkSyncSepoliaConfig =
            NetworkConfig({usdc: 0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359, deployerKey: vm.envUint("PRIVATE_KEY")});
    }

    function getPolygonConfig() public view returns (NetworkConfig memory polygonNetworkConfig) {
        polygonNetworkConfig =
            NetworkConfig({usdc: 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174, deployerKey: vm.envUint("PRIVATE_KEY")});
    }

    function getAvalancheFujiEthConfig() public view returns (NetworkConfig memory avalancheFujiNetworkConfig) {
        avalancheFujiNetworkConfig =
            NetworkConfig({usdc: 0x5425890298aed601595a70AB815c96711a31Bc65, deployerKey: vm.envUint("PRIVATE_KEY")});
    }

    function getOrCreateAnvilEthConfig() public returns (NetworkConfig memory anvilNetworkConfig) {
        vm.startBroadcast();
        ERC20Mock usdcMock = new ERC20Mock("USDC", "USDC", msg.sender, 1000e8);

        vm.stopBroadcast();

        anvilNetworkConfig = NetworkConfig({usdc: address(usdcMock), deployerKey: DEFAULT_ANVIL_PRIVATE_KEY});
    }
}
