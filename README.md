# BendLinks

BendLinks are generated using the Peanut protocol, enabling the deposit of funds into the Peanut contract for subsequent withdrawal using a randomly generated password.

## Composition

A BendLink appears as follows:

```
https://bend.eco/claim?v=1&p=mPyre2Qe7iEG5RfpzEJg01i0rcwnjodW&i=ops%3B256
```

This link can be dissected into:

- **Domain**: `https://bend.eco`
- **Path**: `/claim`
- **Query parameters**:
  - `v`: `1` (BendLink version)
  - `p`: `mPyre2Qe7iEG5RfpzEJg01i0rcwnjodW` (Password)
  - `i`: `ops%3B256` (Indexes)

Indexes indicate from which deposits funds will be withdrawn from the Peanut contract on their respective chains. Multiple deposits are separated by dashes (`-`).

In the provided example, the index `ops` refers to Optimism Sepolia and `256` is the specific index.

## Peanut Contract (V3)

BendLinks utilize the Peanut V3 contract for their creation. This contract supports two primary functions.

### Functions

- **`makeDeposit`**: Deposits assets into the Peanut contract. It accepts the following parameters:

  - `address _tokenAddress`: Address of the token to be deposited.
  - `uint8 _contractType`: Type of the token:
    - `1`: ERC20
    - `2`: ERC721
  - `uint256 _amount`: Amount of tokens to deposit.
  - `uint256 _tokenId`: Token ID of the ERC721 token (if applicable).
  - `address _pubKey20`: Public address of the signing wallet.

- **`withdrawDeposit`**: Withdraws a deposit. It accepts the following parameters:
  - `uint256 _index`: Index of the deposit to be withdrawn.
  - `address _recipientAddress`: Address of the recipient.
  - `bytes32 _recipientAddressHash`: Hash generated from the recipient address.
  - `bytes memory _signature`: Signature of the message signed by the signing wallet.

### Events
- **`DepositEvent`**: Triggered after a deposit is made with the following details:
  - `uint256 _index`: Index of the deposit.
  - `uint8 _contractType`: Type of the deposited token.
  - `uint256 _amount`: Amount deposited.
  - `address indexed _senderAddress`: Address that initiated the deposit.

## Link Passwords

Each BendLink contains a randomly generated password, which is hashed using the `keccak256` algorithm to produce a private key. This private key signs a message containing the recipient's address.

## CLI

This repository includes a CLI for interacting with the Peanut contract, featuring the following commands:

- **`create`**: `[options] <tokenAddress> <amountOrTokenId>` - Creates a Peanut link.
- **`claim`**: `[options] <index> <recipient> <password>` - Claims a Peanut link.
