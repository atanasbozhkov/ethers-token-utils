// SPDX-License-Identifier: MIT
pragma solidity ^0.4.24;

// ERC20 contract interface
contract Token {
    function allowance(address userAddr, address contractAddress) public view returns (uint);
}

contract AllowanceChecker {
    /* Fallback function, don't accept any ETH */
    function() public payable {
        revert("AllowanceChecker does not accept payments");
    }

    /*
      Check the token allowances of a wallet in a token contract for a 3rd party contract

      Returns the user allowance of the token for the 3rd party contract. Avoids possible errors:
        - return 0 on non-contract address
        - returns 0 if the contract doesn't implement balanceOf
    */
    function tokenAllowance(address user, address token, address contractAddress) public view returns (uint) {
        // check if token is actually a contract
        uint256 tokenCode;
        assembly {tokenCode := extcodesize(token)}
        if (tokenCode > 0) {
            // TODO: This seems safer than .call() - but what happens if the Token.allowances is not a valid method?
        return Token(token).allowance(user, contractAddress);
        } else {
            return 0;
        }
    }

    /*
      Check the token balances of a wallet for multiple tokens.
      Pass 0x0 as a "token" address to get ETH balance.

      Possible error throws:
        - extremely large arrays for user and or tokens (gas cost too high)

      Returns a one-dimensional that's user.length * tokens.length long. The
      array is ordered by all of the 0th users token allowances, then the 1th
      user, and so on.
    */
    function allowances(address[] users, address[] tokens, address contractAddr) external view returns (uint[] memory) {
        uint[] memory addrBalances = new uint[](tokens.length * users.length);

        for (uint i = 0; i < users.length; i++) {
            for (uint j = 0; j < tokens.length; j++) {
                uint addrIdx = j + tokens.length * i;
                if (tokens[j] != address(0x0)) {
                    addrBalances[addrIdx] = tokenAllowance(users[i], tokens[j], contractAddr);
                } else {
                    addrBalances[addrIdx] = users[i].balance;
                    // ETH allowance
                }
            }
        }

        return addrBalances;
    }

}