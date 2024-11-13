import cjsModule from '../lib/index.js'

const getResolver = cjsModule.getResolver
const deployments = cjsModule.deployments
const REGISTRY = cjsModule.REGISTRY
const bytes32toString = cjsModule.bytes32toString
const stringToBytes32 = cjsModule.stringToBytes32
const EzrahDidController = cjsModule.EzrahDidController
const verificationMethodTypes = cjsModule.verificationMethodTypes
const identifierMatcher = cjsModule.identifierMatcher
const interpretIdentifier = cjsModule.interpretIdentifier
const Errors = cjsModule.Errors
const EzrahDIDRegistry = cjsModule.EzrahDIDRegistry

export {
  getResolver,
  deployments,
  REGISTRY,
  bytes32toString,
  stringToBytes32,
  EzrahDidController,
  verificationMethodTypes,
  identifierMatcher,
  interpretIdentifier,
  Errors,
  EzrahDIDRegistry,
  cjsModule as default,
}
