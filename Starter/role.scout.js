"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleScout = void 0;
const general_1 = require("./general");
const types_1 = require("./types");
const variableCount = (spawn) => {
    if (!spawn.memory.hasStorage)
        return 0;
    return spawn.memory.exitDirections.length;
};
const scoutTypes = [
    {
        phase: 4,
        count: 1,
        body: [
            ...Array(6).fill(MOVE),
        ],
        memory: {
            role: types_1.Role.Scout,
            stationed: false,
        },
        forAll: true,
        variableCount,
    }
];
const discoverRoom = (creep, direction) => {
    const originSpawn = Game.spawns[creep.memory.spawn];
    let discovering = false;
    const roomName = (0, general_1.adjacentRoomName)(originSpawn.room, direction);
    const room = Game.rooms[roomName];
    if (creep.room.name !== roomName) {
        const exitDir = creep.room.findExitTo(roomName);
        const exitPositions = creep.room.find(exitDir);
        const exitPos = creep.pos.findClosestByPath(exitPositions);
        if (exitPos) {
            creep.moveTo(exitPos);
            discovering = true;
        }
    }
    else {
        const sources = creep.room.find(FIND_SOURCES);
        if (creep.pos.getRangeTo(sources[0]) <= 3) {
        }
        else {
            creep.moveTo(sources[0]);
        }
    }
};
exports.roleScout = {
    run: (creep) => {
        const directions = Game.spawns[creep.memory.spawn].memory.exitDirections;
        const direction = directions[creep.memory.index % directions.length];
        discoverRoom(creep, direction);
    },
    handleScouts: (spawn) => {
        (0, general_1.spawnCreep)(spawn, scoutTypes);
    }
};
module.exports = exports.roleScout;
