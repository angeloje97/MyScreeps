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
        room.createConstructionSite(pos.x + (i * 2) + 2, pos.y, struct);
        room.createConstructionSite(pos.x - (i * 2) - 2, pos.y, struct);
        room.createConstructionSite(pos.x, pos.y + (i * 2) + 2, struct);
        room.createConstructionSite(pos.x, pos.y - (i * 2) - 2, struct);
    }
};
//#region Exits
function isEdgeExitPosition(pos, exitPositions) {
    // Check adjacent positions (orthogonally)
    const adjacent = [
        { x: pos.x - 1, y: pos.y },
        { x: pos.x + 1, y: pos.y },
        { x: pos.x, y: pos.y - 1 },
        { x: pos.x, y: pos.y + 1 },
    ];
    let count = 0;
    for (const adj of adjacent) {
        if (exitPositions.some(e => e.x === adj.x && e.y === adj.y)) {
            count++;
        }
    }
    return count === 1;
}
//#endregion
//#region Walls
const handleWalls = (spawn) => {
    var _a, _b;
    const controllerLevel = (_b = (_a = spawn.room.controller) === null || _a === void 0 ? void 0 : _a.level) !== null && _b !== void 0 ? _b : 0;
    if (controllerLevel < 4)
        return;
    const buildExitWalls = (xOffset, yOffset, find, onFoundRoad = (pos) => { }) => {
        const exits = spawn.room.find(find);
        for (const exitPos of exits) {
            const pos = new RoomPosition(exitPos.x + xOffset, exitPos.y + yOffset, exitPos.roomName);
            const hasRoad = spawn.room.lookForAt(LOOK_STRUCTURES, pos.x, pos.y)
                .some(s => s.structureType === STRUCTURE_ROAD);
            if (hasRoad) {
                onFoundRoad(pos);
                continue;
            }
            const hasRoadSite = spawn.room.lookForAt(LOOK_CONSTRUCTION_SITES, pos.x, pos.y)
                .some(s => s.structureType === STRUCTURE_ROAD);
            if (hasRoadSite) {
                onFoundRoad(pos);
                continue;
            }
            const result = spawn.room.createConstructionSite(pos, STRUCTURE_WALL);
            if (!isEdgeExitPosition(exitPos, exits))
                continue;
        }
    };
    const exitTypes = [FIND_EXIT_TOP, FIND_EXIT_BOTTOM, FIND_EXIT_LEFT, FIND_EXIT_RIGHT];
    const onFoundRoad = (pos) => {
        spawn.room.createConstructionSite(pos, STRUCTURE_RAMPART);
    };
    buildExitWalls(0, 2, FIND_EXIT_TOP, onFoundRoad);
    buildExitWalls(0, -2, FIND_EXIT_BOTTOM, onFoundRoad);
    buildExitWalls(-2, 0, FIND_EXIT_RIGHT, onFoundRoad);
    buildExitWalls(2, 0, FIND_EXIT_LEFT, onFoundRoad);
};
//#endregion
//#region Storage
const handleStorage = (spawn) => {
    var _a, _b;
    const controllerLevel = (_b = (_a = spawn.room.controller) === null || _a === void 0 ? void 0 : _a.level) !== null && _b !== void 0 ? _b : 0;
    if (controllerLevel < 4)
        return;
    const pos = new RoomPosition(spawn.pos.x + 1, spawn.pos.y + 3, spawn.room.name);
    spawn.room.createConstructionSite(pos, STRUCTURE_STORAGE);
};
//#endregion
//#region Roads
const ensureIndex = (index, spawn) => {
    if (!spawn.memory.roadLevelsPlaced) {
        spawn.memory.roadLevelsPlaced = [];
    }
    while (spawn.memory.roadLevelsPlaced.length <= index) {
        spawn.memory.roadLevelsPlaced.push(false);
    }
};
const setRoadComplete = (index, spawn) => {
    ensureIndex(index, spawn);
    spawn.memory.roadLevelsPlaced[index] = true;
};
const isRoadLevelComplete = (index, spawn) => {
    ensureIndex(index, spawn);
    return spawn.memory.roadLevelsPlaced[index];
};
const resetRoadLevelStatuses = (spawn) => {
    for (const val in spawn.memory.roadLevelsPlaced) {
        spawn.memory.roadLevelsPlaced[val] = false;
    }
};
const removeAllRoads = (spawn) => {
    const sites = spawn.room.find(FIND_CONSTRUCTION_SITES, { filter: s => s.structureType == STRUCTURE_ROAD });
    for (const site of sites) {
        site.remove();
    }
};
const handleRoads = (spawn) => {
    const sources = spawn.room.find(FIND_SOURCES);
    const controller = spawn.room.controller;
    //#region Level 2 Roads
    const handleLevel2 = () => {
        if (controller && controller.level < 2)
            return;
        if (isRoadLevelComplete(2, spawn))
            return;
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
        setRoadComplete(2, spawn);
    };
    //#endregion
    //#region Level 3 Roads
    const handleLevel3 = () => {
        if (controller && controller.level < 3)
            return;
        if (isRoadLevelComplete(3, spawn))
            return;
        const exitTypes = [FIND_EXIT_TOP, FIND_EXIT_BOTTOM, FIND_EXIT_LEFT, FIND_EXIT_RIGHT];
        for (const exitType of exitTypes) {
            const exits = spawn.room.find(exitType);
            if (exits.length == 0)
                continue;
            // const exitPos = exits[Math.floor(exits.length/2)]
            const exitPos = spawn.pos.findClosestByPath(exits);
            if (exitPos) {
                const path = spawn.room.findPath(spawn.pos, exitPos, { ignoreCreeps: true });
                for (const step of path) {
                    spawn.room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
                }
            }
        }
        setRoadComplete(3, spawn);
    };
    //#endregion
    handleLevel2();
    handleLevel3();
    // resetRoadLevelStatuses(spawn)
    // removeAllRoads(spawn);
};
//#endregion
const structureHandler = {
    run: (spawn) => {
        handleExtensions(spawn);
        handleRoads(spawn);
        handleWalls(spawn);
        handleStorage(spawn);
    },
};
module.exports = structureHandler;
