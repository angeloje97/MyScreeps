"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
module.exports = {
    spawnCreep: (spawn, creepType) => {
        const { count, body, name, memory } = creepType;
        const currentCreeps = lodash_1.default.filter(Game.creeps, (creep) => creep.memory.role == memory.role);
        if (currentCreeps.length >= count)
            return;
        spawn.spawnCreep(body, name, { memory: memory });
    },
};
