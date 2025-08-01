"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnCreep = exports.creepsExists = exports.allExtensionsFull = exports.hasAllExtensionsBuilt = exports.getNonFullTargets = void 0;
const types_1 = require("./types");
const lodash_1 = __importDefault(require("lodash"));
const getNonFullTargets = (creep, additionalStructures = []) => {
    const targets = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER, ...additionalStructures];
    return creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            let isTarget = true;
            for (const target of targets) {
                if (structure.structureType == target) {
                    if ('store' in structure && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                        return true;
                    }
                }
            }
            return false;
        },
    });
};
exports.getNonFullTargets = getNonFullTargets;
//#region Inventory Functions
const hasAllExtensionsBuilt = (spawn, phase = null) => {
    var _a, _b;
    const EXTENSIONS_PER_LEVEL = [0, 0, 5, 10, 20, 30, 40, 50, 60]; // index = controller level
    const room = spawn.room;
    if (phase == null) {
        phase = (_b = (_a = room.controller) === null || _a === void 0 ? void 0 : _a.level) !== null && _b !== void 0 ? _b : 0;
    }
    const builtExtensions = room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_EXTENSION
    }).length;
    const maxExtensions = EXTENSIONS_PER_LEVEL[phase];
    return builtExtensions >= maxExtensions;
};
exports.hasAllExtensionsBuilt = hasAllExtensionsBuilt;
const allExtensionsFull = (spawn) => {
    const extensions = spawn.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType === STRUCTURE_EXTENSION
    });
    const spawnFull = spawn.store.getFreeCapacity(RESOURCE_ENERGY) == 0;
    if (!spawnFull)
        return false;
    const extensionsFull = extensions.every(ext => ext.store.getFreeCapacity(RESOURCE_ENERGY) === 0);
    return extensionsFull;
};
exports.allExtensionsFull = allExtensionsFull;
//#endregion
//#region Creep Functions
const creepsExists = (spawn, roles) => {
    const foundRoles = [];
    const creeps = spawn.room.find(FIND_MY_CREEPS);
    for (const creep of creeps) {
        if (!foundRoles.includes(creep.memory.role)) {
            foundRoles.push(creep.memory.role);
        }
    }
    for (const role of roles) {
        if (!foundRoles.includes(role)) {
            return false;
        }
    }
    return true;
};
exports.creepsExists = creepsExists;
//#endregion
//#region Spawn Creep
let useSub = false;
let subPhase = 0;
let replaceMentTicks = 10;
const maxReplacementTicks = 40;
const spawnCreep = (spawn, creepTypes) => {
    //#region Common Data
    let phase = spawn.room.controller.level;
    if (useSub) {
        phase = subPhase;
    }
    if (spawn.memory.replacingCoolDown > 0) {
        spawn.memory.replacingCoolDown -= 1;
    }
    const creepType = (0, types_1.accumulatedCreepType)(phase, creepTypes);
    if (creepType == null)
        return;
    const { count, body, memory, substitution, phase: creepPhase } = creepType;
    const name = types_1.Role[memory.role];
    const currentCreeps = lodash_1.default.filter(Game.creeps, (creep) => creep.memory.role === memory.role &&
        creep.memory.spawn === spawn.name &&
        typeof creep.ticksToLive == 'number' &&
        creep.ticksToLive > (body.length * 3) + 10);
    //#endregion
    //#region Handle Replacing Creep With Substitution
    if (currentCreeps.length >= count) {
        let suicide = false;
        const hasExtensions = (0, exports.hasAllExtensionsBuilt)(spawn, creepPhase);
        for (const creep of currentCreeps) {
            if (creep.memory.phase < phase) {
                const fullResources = (0, exports.allExtensionsFull)(spawn);
                if (hasExtensions && fullResources) {
                    creep.suicide();
                    suicide = true;
                    spawn.memory.replacingCoolDown = maxReplacementTicks;
                    break;
                }
            }
        }
        if (!suicide) {
            const hasCreeps = (0, exports.creepsExists)(spawn, [types_1.Role.Hauler, types_1.Role.Miner]);
            if (substitution && (!hasCreeps || !hasExtensions)) {
                subPhase = substitution;
                useSub = true;
                (0, exports.spawnCreep)(spawn, creepTypes);
                useSub = false;
            }
        }
        return;
    }
    //#endregion
    //#region Determining the Index
    let index = 0;
    while (index < currentCreeps.length) {
        let alreadyExists = false;
        for (const creep of currentCreeps) {
            if (creep.memory.index == index) {
                alreadyExists = true;
                break;
            }
        }
        if (!alreadyExists) {
            break;
        }
        index++;
    }
    //#endregion
    //#region Spawning Creep
    let result = spawn.spawnCreep(body, name + Game.time, {
        memory: Object.assign(Object.assign({}, memory), { spawn: spawn.name, index, phase }),
    });
    //#endregion
    //#region Handle Substitution
    if (result == ERR_NOT_ENOUGH_ENERGY && substitution) {
        const hasCreeps = (0, exports.creepsExists)(spawn, [types_1.Role.Hauler, types_1.Role.Miner]);
        const hasExtensions = (0, exports.hasAllExtensionsBuilt)(spawn, creepPhase);
        if (hasCreeps && hasExtensions)
            return;
        subPhase = substitution;
        useSub = true;
        (0, exports.spawnCreep)(spawn, creepTypes);
        useSub = false;
        subPhase = 0;
    }
    //#endregion
};
exports.spawnCreep = spawnCreep;
//#endregion
