/**
 * Backend-ready data model (plain JSON). Everything is addressed by stable string ids, never array indexes.
 *
 * @typedef {{width:number,height:number}} Canvas                       // base units, default 1000 x 1400
 * @typedef {"none"|"image"|"position"|"both"} UpdateType
 *
 * @typedef {Object} CustomizationNode                                  // one independently managed image layer
 * @property {string} id @property {string} name @property {string|null} image   // "asset:<id>" | "seed:<key>" | url
 * @property {number} x @property {number} y @property {number} width @property {number} height
 * @property {number} rotation @property {boolean} visible @property {number} zIndex @property {boolean} [locked]
 *
 * @typedef {Object} NodeUpdate                                         // what ONE option does to ONE node
 * @property {UpdateType} type
 * @property {string|null} [image]        // type image|both. omitted = keep, null = explicitly clear
 * @property {{x?:number,y?:number,width?:number,height?:number,rotation?:number}} [geometry]  // type position|both, only changed fields
 * @property {boolean} [visible] @property {number} [zIndex]            // layout fields, type position|both
 *
 * @typedef {Object} ConfigurationPatch   // option.updates = { [nodeId]: NodeUpdate }  (differences only, never a full garment copy)
 *
 * @typedef {Object} ConfigurationOption
 * @property {string} id @property {string} groupId @property {string} name @property {number} [priceDelta]
 * @property {Object<string,NodeUpdate>} updates
 *
 * @typedef {Object} ConfigurationGroup
 * @property {string} id @property {string} name @property {string} defaultOptionId @property {ConfigurationOption[]} options
 *
 * @typedef {Object} CompatibilityRule
 * @property {string} id @property {"requires"|"excludes"} type @property {string} optionId
 * @property {string[]} targetOptionIds @property {string} [message]
 *   requires: optionId needs ANY of targetOptionIds selected.  excludes: optionId cannot coexist with ANY target.
 *
 * @typedef {Object} Fabric                                             // 2nd, independent customization dimension
 * @property {string} id @property {string} name @property {string} color   // "#rrggbb"
 * @property {string|null} [texture] @property {number} [tile]  // tile size in % of canvas width
 * @property {"multiply"|"soft-light"|"overlay"} [blend] @property {number} [priceDelta]
 * @property {Object<string,{color?:string,texture?:string|null}>} [regions]   // per-region overrides, e.g. { contrast: { color:"#fff" } }
 *   Nodes opt in with node.fabric = "<region>" (default region name: "main"); node.fabricMask = optional mask image.
 *
 * @typedef {{id:string,title:string,kind?:"fabric",groupIds?:string[]}} Section   // accordion sections shown to customers
 *
 * @typedef {Object} CustomizationTemplate                               // the editable draft (CustomizationTemplate)
 * @property {string} productId @property {Canvas} canvas @property {string} baseImage
 * @property {CustomizationNode[]} nodes @property {ConfigurationGroup[]} groups @property {CompatibilityRule[]} rules
 * @property {Fabric[]} [fabrics] @property {string} [defaultFabricId] @property {Section[]} [sections]
 *
 * @typedef {Object} CustomizationVersion                                // immutable published snapshot
 * @property {string} id @property {string} productId @property {number} number @property {string} publishedAt
 * @property {CustomizationTemplate} template
 *
 * @typedef {Object} Product
 * @property {string} id @property {string} name @property {string} description @property {string} category
 * @property {number} basePrice @property {"draft"|"published"} status @property {string|null} publishedVersionId
 * @property {string} createdAt @property {string} updatedAt
 *
 * @typedef {Object} CartItem                                            // CustomerCustomization is embedded
 * @property {string} id @property {string} signature @property {string} productId @property {string} productName
 * @property {string} versionId @property {Object<string,string>} selections @property {{group:string,option:string}[]} summary
 * @property {CustomizationNode[]} resolvedNodes @property {Canvas} canvas @property {number} price @property {number} quantity
 */
export {};
