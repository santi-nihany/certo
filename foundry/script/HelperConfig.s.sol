// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {MockV3Aggregator} from "../test/mocks/MockV3Aggregator.sol";
import {ERC20Mock} from "../test/mocks/ERC20Mock.sol";

contract HelperConfig is Script {
    NetworkConfig public activeNetworkConfig;

    uint8 public constant DECIMALS = 8;
    int256 public constant USDC_USD_PRICE = 999891e7;

    struct NetworkConfig {
        address usdcUsdPriceFeed;
        address usdc;
        uint256 deployerKey;
    }

    uint256 public DEFAULT_ANVIL_PRIVATE_KEY = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

    uint256 public constant SEPOLIA_CHAIN_ID = 11_155_111;
    uint256 public constant AMOY_CHAIN_ID = 80002;

    constructor() {
        if (block.chainid == SEPOLIA_CHAIN_ID) {
            activeNetworkConfig = getSepoliaEthConfig();
        } else if (block.chainid == AMOY_CHAIN_ID) {
            activeNetworkConfig = getAmoyConfig();
        } else {
            activeNetworkConfig = getOrCreateAnvilEthConfig();
        }
    }

    function getSepoliaEthConfig() public view returns (NetworkConfig memory sepoliaNetworkConfig) {
        sepoliaNetworkConfig = NetworkConfig({
            usdcUsdPriceFeed: 0xA2F78ab2355fe2f984D808B5CeE7FD0A93D5270E, // USDC / USD
            usdc: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238,
            deployerKey: vm.envUint("PRIVATE_KEY")
        });
    }

    function getAmoyConfig() public view returns (NetworkConfig memory amoyNetworkConfig) {
        amoyNetworkConfig = NetworkConfig({
            usdcUsdPriceFeed: 0x1b8739bB4CdF0089d07097A9Ae5Bd274b29C6F16, // USDC / USD
            usdc: 0x41E94Eb019C0762f9Bfcf9Fb1E58725BfB0e7582,
            deployerKey: vm.envUint("PRIVATE_KEY")
        });
    }

    function getZkSyncSepoliaConfig() public view returns (NetworkConfig memory zkSyncSepoliaConfig) {
        zkSyncSepoliaConfig = NetworkConfig({
            usdcUsdPriceFeed: 0x1844478CA634f3a762a2E71E3386837Bd50C947F, // USDC / USD
            usdc: 0xAe045DE5638162fa134807Cb558E15A3F5A7F853,
            deployerKey: vm.envUint("PRIVATE_KEY")
        });
    }

    function getOrCreateAnvilEthConfig() public returns (NetworkConfig memory anvilNetworkConfig) {
        // Check to see if we set an active network config
        if (activeNetworkConfig.usdcUsdPriceFeed != address(0)) {
            return activeNetworkConfig;
        }

        vm.startBroadcast();
        MockV3Aggregator usdcUsdPriceFeed = new MockV3Aggregator(DECIMALS, USDC_USD_PRICE);
        ERC20Mock usdcMock = new ERC20Mock("USDC", "USDC", msg.sender, 1000e8);

        vm.stopBroadcast();

        anvilNetworkConfig = NetworkConfig({
            usdcUsdPriceFeed: address(usdcUsdPriceFeed), // ETH / USD
            usdc: address(usdcMock),
            deployerKey: DEFAULT_ANVIL_PRIVATE_KEY
        });
    }
}
