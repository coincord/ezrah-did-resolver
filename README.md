# Ezrah DID Resolver

This library is intended to use ethereum (evm) addresses or secp256k1 publicKeys as fully self-managed
[Decentralized Identifiers](https://w3c.github.io/did-core/#identifier) and wrap them in a
[DID Document](https://w3c.github.io/did-core/#did-document-properties)

It supports the proposed [Decentralized Identifiers](https://w3c.github.io/did-core/#identifier) spec from the
[W3C Credentials Community Group](https://w3c-ccg.github.io).

It requires the `did-resolver` library, which is the primary interface for resolving DIDs.

This DID method relies on the [ethr-did-registry](https://github.com/uport-project/ethr-did-registry).

## DID method

To encode a DID for an Ethereum address on the ethereum mainnet, simply prepend `did:ezrah:`

eg:

`did:ezrah:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74`

Multi-network DIDs are also supported, if the proper configuration is provided during setup.

For example:
`did:ezrah:sepolia:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74` gets resolved on the goerli testnet (chainID=0x5), and
represents a distinct identifier than the generic one, with different DID documents and different key rotation history.

## DID Document

The did resolver takes the ethereum address, looks at contract events and builds a DID document based on the ERC1056
Events corresponding to the address. When an identifier is a full `publicKey`, the corresponding `ethereumAddress` is
computed and checked in the same manner.

The minimal DID document for an ethereum address `0xb9c5714089478a327f09197987f16f9e5d936e8a` with no transactions to
the registry looks like this:

```json
{
  "@context": ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/suites/secp256k1recovery-2020/v2"],
  "id": "did:ezrah:0xb9c5714089478a327f09197987f16f9e5d936e8a",
  "verificationMethod": [
    {
      "id": "did:ezrah:0xb9c5714089478a327f09197987f16f9e5d936e8a#controller",
      "type": "EcdsaSecp256k1RecoveryMethod2020",
      "controller": "did:ezrah:0xb9c5714089478a327f09197987f16f9e5d936e8a",
      "blockchainAccountId": "eip155:1:0xb9c5714089478a327f09197987f16f9e5d936e8a"
    }
  ],
  "authentication": ["did:ezrah:0xb9c5714089478a327f09197987f16f9e5d936e8a#controller"],
  "assertionMethod": ["did:ezrah:0xb9c5714089478a327f09197987f16f9e5d936e8a#controller"]
}
```

Note this resolver uses the `EcdsaSecp256k1RecoveryMethod2020` type and an `blockchainAccountId` to represent the
default
`verificationMethod`, `assertionMethod`, and `authentication` entry. Any value from the registry that returns an
ethereum address will be added to the `verificationMethod` array of the DID document with
type `EcdsaSecp256k1RecoveryMethod2020` and an `blockchainAccountId` attribute containing the address.

## Building a DID document

The DID document is not stored as a file, but is built by using read only functions and contract events on
the ezrah-registry-did smart contract.

Please see the [spec](doc/did-method-spec.md) for details of how the DID document and corresponding metadata are
computed.

## Resolving a DID document

The library presents a `resolve()` function that returns a `Promise` returning the DID document. It is not meant to be
used directly but through the [`did-resolver`](https://github.com/decentralized-identity/did-resolver) aggregator.

You can use the `getResolver(config)` method to produce an entry that can be used with the `Resolver`
constructor:

```javascript
import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'

const providerConfig = {
  // While experimenting, you can set a rpc endpoint to be used by the web3 provider
  rpcUrl: 'http://localhost:7545',
  // You can also set the address for your own ethr-did-registry (ERC1056) contract
  registry: registry.address,
  name: 'development', // this becomes did:ezrah:development:0x...
}
// It's recommended to use the multi-network configuration when using this in production
// since that allows you to resolve on multiple public and private networks at the same time.

// getResolver will return an object with a key/value pair of { "ethr": resolver } where resolver is a function used by the generic did resolver.
const ethrDidResolver = getResolver(providerConfig)
const didResolver = new Resolver(ethrDidResolver)

didResolver
  .resolve('did:ezrah:dev:0xf3beac30c498d9e26865f34fcaa57dbb935b0d74')
  .then((result) => console.dir(result, { depth: 3 }))
```

## Multi-network configuration

In production, you will most likely want the ability to resolve DIDs that are based in different ethereum networks. To
do this, you need a configuration that sets the network name or chain ID (and even the registry address) for each
network. An example configuration for multi-network DID resolving would look like this:

```javascript
const providerConfig = {
  networks: [
    { name: 'mainnet', provider: web3.currentProvider },
    { name: '0x5', rpcUrl: 'https://goerli.infura.io/v3/<YOUR PROJECT ID>' },
    { name: 'rsk:testnet', chainId: '0x1f', rpcUrl: 'https://did.testnet.rsk.co:4444' },
    { name: 'development', rpcUrl: 'http://localhost:7545', registry: '0xdca7ef03e98e0dc2b855be647c39abe984fcf21b' },
    { name: 'myprivatenet', chainId: 123456, rpcUrl: 'https://my.private.net.json.rpc.url' },
  ],
}

const ezrahDidResolver = getResolver(providerConfig)
```

The configuration from above allows you to resolve ezrah-did's of the following formats:

- `did:ezrah:mainnet:0xabcabc03e98e0dc2b855be647c39abe984193675`
- `did:ezrah:0xabcabc03e98e0dc2b855be647c39abe984193675` (defaults to mainnet configuration)
- `did:ezrah:0x5:0xabcabc03e98e0dc2b855be647c39abe984193675` (refer to the goerli network by chainID)
- `did:ezrah:myprivatenet:0xabcabc03e98e0dc2b855be647c39abe984193675`
- `did:ezrah:0x1e240:0xabcabc03e98e0dc2b855be647c39abe984193675` (refer to `myprivatenet` by chainID)

For each network you can specify either an `rpcUrl`, a `provider` or a `web3` instance that can be used to access that
particular network. At least one of `name` or `chainId` must be specified per network.

These providers will have to support `eth_call` and `eth_getLogs` to be able to resolve DIDs specific to that network.

You can also override the default registry address by specifying a `registry` attribute per network.
