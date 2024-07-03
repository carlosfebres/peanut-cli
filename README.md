# BendLinks

BendLinks are created using the Peanut protocol, allowing us to deposit funds into the Peanut contract to later withdraw using a randomly generated password.

## Composition

A BendLink looks like this:
```
https://bend.eco/claim?v=1&p=mPyre2Qe7iEG5RfpzEJg01i0rcwnjodW&i=ops%3B256
```
Which can be broken down into:
- Domain: `https://bend.eco`
- Path: `/claim`
- Query parameters:
    - `v`: `1` (BendLink version)
    - `p`: `mPyre2Qe7iEG5RfpzEJg01i0rcwnjodW` (Password)
    - `i`: `ops%3B256` Indexes

Indexes indicate which deposit will be withdraw from the Peanut contract in the corresponding chain, every index consit in the network and the index, if there are multiple deposits they are seperated by a dash (`-`).

For the above example, there is one index where `ops` is Optimism Sepolia and `256` is the index.

## Peanut contract (V3)
The Bend using the Peanut V3 contract to create BendLinks, this contract has 2 main funtions.
### Functions
- `makeDeposit`: Deposit assets into the Peanut contract. it accepts 5 parameters:
    - `address _tokenAddress`: Address of the token to be deposit
    - `uint8 _contractType`: Type of the token to be deposit
        - type `1`: ERC20
        - type `2`: ERC721
    - `uint256 _amount`: Amount of tokens to be deposit
    - `uint256 _tokenId`: Token ID of the token to deposit (for ERC721 tokens)
    - `address _pubKey20`: Public address of the signing wallet
- `withdrawDeposit`: Withdraw deposit. It accepts 4 parameters:
    - `uint256 _index`: Index of the deposit to withdraw
    - `address _recipientAddress`: Address of recipient
    - `bytes32 _recipientAddressHash`: Hash generated using the recipient address
    - `bytes memory _signature`: Signature of the message signed by the signing wallet.
### Events
- `DepositEvent`: Emitted after making a deposit with the following parameters:
    - `uint256 _index`: Deposit index
    - `uint8 _contractType`: Type of the token deposited
    - `uint256 _amount`: Amount deposited
    - `address indexed _senderAddress`: Address that initiated the deposit

## Link passwords

Every link contains a randomly generated password which is then converted into a private key by hashing it using the `keccak256` algorithm, this private key is used to sign a message containg the recipient address.

## CLI
This repo has a CLI to interact with the Peanut contract, it has the following commands:
- `create`:  `[options] <tokenAddress> <amountOrTokenId>  Create a Peanut link`
- `claim`: `[options] <index> <recipient> <password>     Claim a Peanut link`