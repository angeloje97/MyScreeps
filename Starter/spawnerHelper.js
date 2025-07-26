"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const spawnCreep = (spawn, creepType) => {
    const { count, body, name, memory } = creepType;
    const currentCreeps = lodash_1.default.filter(Game.creeps, (creep) => creep.memory.role == memory.role);
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
    spawn.spawnCreep(body, name + Game.time, {
        memory: Object.assign(Object.assign({}, memory), { spawn: spawn.name, index }),
    });
};
module.exports = {
    spawnCreep
};
