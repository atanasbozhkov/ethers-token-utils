import { BigNumber, Contract, providers, Signer } from 'ethers';
import {
  DEFAULT_CONTRACT_ADDRESS,
  Options,
  formatAddressBalances
} from './common';
import BalanceCheckerABI from './abis/BalanceChecker.abi.json';
import AllowanceCheckerABI from './abis/AllowanceChecker.abi.json';

type Provider = providers.Provider;

function getBalanceContract(provider: Provider | Signer, address?: string) {
  return new Contract(
    address || DEFAULT_CONTRACT_ADDRESS,
    BalanceCheckerABI,
    provider
  );
}

function getAllowanceContract(provider: Provider | Signer, address?: string) {
  return new Contract(
      address || DEFAULT_CONTRACT_ADDRESS,
      AllowanceCheckerABI,
      provider
  );
}



export async function getAddressBalances(
  provider: Provider | Signer,
  address: string,
  tokens: string[],
  options: Options = {},
) {
  const contract = getBalanceContract(provider, options.contractAddress);
  const balances = await contract.balances([address], tokens);
  return formatAddressBalances<BigNumber>(balances, [address], tokens)[address];
}

export async function getAddressesBalances(
  provider: Provider | Signer,
  addresses: string[],
  tokens: string[],
  options: Options = {},
) {
  const contract = getBalanceContract(provider, options.contractAddress);
  const balances = await contract.balances(addresses, tokens);
  return formatAddressBalances<BigNumber>(balances, addresses, tokens);
}

export async function getAddressAllowances(
    provider: Provider | Signer,
    address: string,
    tokens: string[],
    contractAddress: string[],
    options: Options = {},
) {
  const contract = getAllowanceContract(provider, options.contractAddress);
  const balances = await contract.allowances([address], tokens, contractAddress);
  return formatAddressBalances<BigNumber>(balances, [address], tokens)[address];
}