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
const getAllDroppedResources = (spawn, useRoomsInUse = true, resource = RESOURCE_ENERGY) => {
    const drops = [];
    const rooms = useRoomsInUse ? spawn.memory.roomsInUse : [spawn.room];
    for (const room of rooms) {
        const droppedEnergies = room.find(FIND_DROPPED_RESOURCES, {
            filter: r => r.resourceType == resource,
        });
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
    spawn.memory.drops.sources = getAllDroppedResources(spawn, spawn.memory.hasStorage);
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
};
const handleMap = (spawn) => {
    if (!spawn.memory.exitDirections) {
        spawn.memory.exitDirections = exitDirections(spawn);
    }
    handleStorage(spawn);
};
const handleRoomsInUse = (spawn) => {
    const directions = spawn.memory.exitDirections;
    const rooms = [spawn.room];
    for (const dir of directions) {
        const roomName = (0, general_1.adjacentRoomName)(spawn.room, dir);
        if (Game.rooms[roomName]) {
            const otherSpawn = Game.rooms[roomName].find(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_SPAWN
            });
            if (otherSpawn.length == 0) {
                rooms.push(Game.rooms[roomName]);
            }
        }
    }
    spawn.memory.roomsInUse = rooms;
};
//#endregion
const roleSpawn = {
    handleSpawn: (spawn) => {
        handleRoomsInUse(spawn);
        handleMiningNodes(spawn);
        handleDrops(spawn);
        handleMap(spawn);
    }
};
module.exports = roleSpawn;
