"use strict";
const handleExtensions = (spawn) => {
    const room = spawn.room;
    const maxContainers = 3;
    const struct = STRUCTURE_EXTENSION;
    for (let i = 0; i < maxContainers; i++) {
        const pos = new RoomPosition(spawn.pos.x, spawn.pos.y, room.name);
        room.createConstructionSite(pos.x + i + 1, pos.y + i + 1, struct);
        room.createConstructionSite(pos.x - i - 1, pos.y + i + 1, struct);
        room.createConstructionSite(pos.x + i + 1, pos.y - i - 1, struct);
        room.createConstructionSite(pos.x - i - 1, pos.y - i - 1, struct);
    }
};
const handleRoads = (spawn) => {
    const sources = spawn.room.find(FIND_SOURCES);
    const controller = spawn.room.controller;
    for (const source of sources) {
        const path = spawn.room.findPath(spawn.pos, source.pos, {
            ignoreCreeps: true,
        });
        for (let i = 0; i < path.length - 1; i++) {
            const step = path[i];
            spawn.room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
        }
    }
    if (controller) {
        const path = spawn.room.findPath(spawn.pos, controller.pos, { ignoreCreeps: true });
        for (let i = 0; i < path.length - 1; i++) {
            const step = path[i];
            spawn.room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
        }
    }
};
const handleTower = (spawn) => {
    spawn.room.createConstructionSite(spawn.pos.x + 3, spawn.pos.y, STRUCTURE_TOWER);
};
const structureHandler = {
    run: (spawn) => {
        handleExtensions(spawn);
        handleRoads(spawn);
        handleTower(spawn);
    },
};
module.exports = structureHandler;
