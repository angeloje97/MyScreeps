"use strict";
const handleExtensions = () => {
    const spawn = Game.spawns["Spawn1"];
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
const handleRoads = () => {
    const spawn = Game.spawns["Spawn1"];
    const sources = spawn.room.find(FIND_SOURCES);
    for (const source of sources) {
        const path = spawn.room.findPath(spawn.pos, source.pos, {
            ignoreCreeps: true,
        });
        for (const step of path) {
            spawn.room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
        }
    }
};
const structureHandler = {
    run: () => {
        handleExtensions();
        handleRoads();
    },
};
module.exports = structureHandler;
