"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const general_1 = require("./general");
const types_1 = require("./types");
//#region  Resources
const getAllSources = (spawn, find) => {
    const sources = [];
    for (const room of spawn.memory.roomsInUse) {
        if (spawn.room.name != room.name) {
            const hasSpawn = room.find(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_SPAWN
            }).length > 0;
            if (hasSpawn)
                continue;
        }
        const roomSources = room.find(find);
        for (const source of roomSources) {
            sources.push(source);
        }
    }
    sources.sort((a, b) => {
        return spawn.pos.getRangeTo(a.pos) - spawn.pos.getRangeTo(b.pos);
    });
    return sources;
};
const handleMiningNodes = (spawn) => {
    if (!spawn.memory.miningNodes) {
        spawn.memory.miningNodes = {
            sources: []
        };
    }
    let sources = [];
    if (spawn.memory.hasStorage) {
        sources = getAllSources(spawn, FIND_SOURCES);
    }
    else {
        sources = spawn.room.find(FIND_SOURCES);
    }
    spawn.memory.miningNodes.sources = sources;
};
const getAllDroppedResources = (spawn, useRoomsInUse = true, resource = RESOURCE_ENERGY, minAmount = 0) => {
    const drops = [];
    const rooms = useRoomsInUse ? spawn.memory.roomsInUse : [spawn.room];
    for (const room of rooms) {
        const droppedEnergies = room.find(FIND_DROPPED_RESOURCES, {
            filter: r => r.resourceType == resource && r.amount > minAmount
        }).sort((a, b) => b.amount - a.amount);
        for (const energy of droppedEnergies) {
            drops.push(energy);
        }
    }
    return drops;
};
const handleDrops = (spawn) => {
    if (!spawn.memory.drops) {
        spawn.memory.drops = {
            sources: []
        };
    }
    spawn.memory.drops.sources = getAllDroppedResources(spawn, spawn.memory.hasStorage, RESOURCE_ENERGY, 100);
};
//#endregion;
//#region Map
const exitDirections = (spawn) => {
    const result = [];
    if (spawn.room.find(FIND_EXIT_TOP).length > 0)
        result.push(types_1.Direction.Top);
    if (spawn.room.find(FIND_EXIT_LEFT).length > 0)
        result.push(types_1.Direction.Left);
    if (spawn.room.find(FIND_EXIT_RIGHT).length > 0)
        result.push(types_1.Direction.Right);
    if (spawn.room.find(FIND_EXIT_BOTTOM).length > 0)
        result.push(types_1.Direction.Bottom);
    return result;
};
const handleStorage = (spawn) => {
    const storages = spawn.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType == STRUCTURE_STORAGE
    });
    spawn.memory.hasStorage = storages.length > 0;
    spawn.memory.minStorageAmount = 10000;
};
const handleMap = (spawn) => {
    if (!spawn.memory.exitDirections) {
        spawn.memory.exitDirections = exitDirections(spawn);
    }
    handleStorage(spawn);
};
const handleRooms = (spawn) => {
    const directions = spawn.memory.exitDirections;
    const rooms = [spawn.room];
    const dangerRooms = [];
    const threats = [];
    for (const dir of directions) {
        const roomName = (0, general_1.adjacentRoomName)(spawn.room, dir);
        const room = Game.rooms[roomName];
        if (room) {
            const otherSpawn = room.find(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_SPAWN
            });
            const threatConstants = [STRUCTURE_INVADER_CORE];
            const threatStructures = room.find(FIND_STRUCTURES, {
                filter: s => threatConstants.includes(s.structureType)
            });
            const hostileCreeps = room.find(FIND_HOSTILE_CREEPS);
            for (const structure of threatStructures) {
                threats.push(structure);
            }
            for (const creep of hostileCreeps) {
                threats.push(creep);
            }
            if (threatStructures.length > 0) {
                dangerRooms.push(room);
                continue;
            }
            else if (otherSpawn.length == 0) {
                rooms.push(room);
            }
        }
    }
    spawn.memory.roomInDanger = dangerRooms;
    spawn.memory.roomsInUse = rooms;
    spawn.memory.threats = threats;
};
//#endregion
const roleSpawn = {
    handleSpawn: (spawn) => {
        handleRooms(spawn);
        handleMiningNodes(spawn);
        handleDrops(spawn);
        handleMap(spawn);
    }
};
module.exports = roleSpawn;
