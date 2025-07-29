"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("./types");
const lodash_1 = __importDefault(require("lodash"));
const getNonFullTargets = (creep) => {
    const targets = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN, STRUCTURE_TOWER];
    return creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            let isTarget = true;
            for (const target of targets) {
                if (structure.structureType == target) {
                    if (structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                        return true;
                    }
                }
            }
            return false;
        },
    });
};
let useSub = false;
let subPhase = 0;
const spawnCreep = (spawn, creepTypes) => {
    let phase = spawn.room.controller.level;
    if (useSub) {
        phase = subPhase;
    }
    const creepType = (0, types_1.accumulatedCreepType)(phase, creepTypes);
    if (creepType == null)
        return;
    const { count, body, name, memory, substitution } = creepType;
    const currentCreeps = lodash_1.default.filter(Game.creeps, (creep) => creep.memory.role == memory.role && creep.memory.spawn == spawn.name);
    if (currentCreeps.length >= count)
        return;
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
    let result = spawn.spawnCreep(body, name + Game.time, {
        memory: Object.assign(Object.assign({}, memory), { spawn: spawn.name, index }),
    });
    if (result == ERR_NOT_ENOUGH_ENERGY && substitution) {
        subPhase = substitution;
        useSub = true;
        spawnCreep(spawn, creepTypes);
        useSub = false;
    }
};
module.exports = {
    spawnCreep,
    getNonFullTargets,
};
