import { getResolver } from './resolver.js'
import { EzrahDidController } from './controller.js'
import {
  bytes32toString,
  DEFAULT_REGISTRY_ADDRESS,
  Errors,
  identifierMatcher,
  interpretIdentifier,
  legacyAlgoMap,
  legacyAttrTypes,
  stringToBytes32,
  verificationMethodTypes,
  MetaSignature,
} from './helpers.js'

import { EzrahDIDRegistry } from './config/EzrahDIDRegistry.js'
import { deployments, EzrahDidRegistryDeployment } from './config/deployments.js'

export {
  DEFAULT_REGISTRY_ADDRESS as REGISTRY,
  getResolver,
  bytes32toString,
  stringToBytes32,
  EzrahDidController,
  /**@deprecated */
  legacyAlgoMap as delegateTypes,
  /**@deprecated */
  legacyAttrTypes as attrTypes,
  verificationMethodTypes,
  identifierMatcher,
  interpretIdentifier,
  Errors,
  EzrahDIDRegistry,
  MetaSignature,
  deployments,
  EzrahDidRegistryDeployment,
}

// workaround for esbuild/vite/hermes issues
// This should not be needed once we move to ESM only build outputs.
// This library now builds as a CommonJS library, with a small ESM wrapper on top.
// This pattern seems to confuse some bundlers, causing errors like `Cannot read 'getResolver' of undefined`
// see https://github.com/decentralized-identity/ethr-did-resolver/issues/186
export default {
  REGISTRY: DEFAULT_REGISTRY_ADDRESS,
  getResolver,
  bytes32toString,
  stringToBytes32,
  EzrahDidController,
  verificationMethodTypes,
  identifierMatcher,
  interpretIdentifier,
  Errors,
  EzrahDIDRegistry,
  deployments,
}
