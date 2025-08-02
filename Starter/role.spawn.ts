

import { adjacentRoomName } from "./general";
import { Direction } from "./types";

//#region  Resources

const getAllSources = (spawn: StructureSpawn, find: FindConstant): Source[] => {

    const sources: Source[] = [];

    for(const room of spawn.memory.roomsInUse){
        
        if(spawn.room.name != room.name){
            const hasSpawn = room.find(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_SPAWN
            }).length > 0

            if(hasSpawn) continue;
        }

        const roomSources: Source[] = room.find(find);
        for(const source of roomSources){
            sources.push(source);
        }
    }

    sources.sort((a, b) => {

        return spawn.pos.getRangeTo(a.pos) - spawn.pos.getRangeTo(b.pos);
    })

    return sources;
};

const handleMiningNodes = (spawn: StructureSpawn): void => {

    if(!spawn.memory.miningNodes){
        spawn.memory.miningNodes = {
            sources: []
        }
    }

    let sources: Source[] = []
    if(spawn.memory.hasStorage){
        sources = getAllSources(spawn, FIND_SOURCES);
    }
    else{
        sources = spawn.room.find(FIND_SOURCES);
    }

    spawn.memory.miningNodes.sources = sources;
};

const getAllDroppedResources = (
    spawn: StructureSpawn, 
    useRoomsInUse: boolean = true, 
    resource: ResourceConstant = RESOURCE_ENERGY) => {

    const drops: Resource<ResourceConstant>[] = [];

    const rooms = useRoomsInUse ? spawn.memory.roomsInUse : [spawn.room];

    for(const room of rooms){
        const droppedEnergies = room.find(FIND_DROPPED_RESOURCES, {
            filter: r=> r.resourceType == resource,  
        });

        for(const energy of droppedEnergies){
            drops.push(energy);
        }
    }

    return drops;
}

const handleDrops = (spawn: StructureSpawn): void => {
    if(!spawn.memory.drops){
        spawn.memory.drops = {
            sources: []
        }
    }

    spawn.memory.drops.sources = getAllDroppedResources(spawn, spawn.memory.hasStorage);
}
//#endregion;

//#region Map

const exitDirections = (spawn: StructureSpawn): Direction[] => {
    const result: Direction[] = []

    if(spawn.room.find(FIND_EXIT_TOP).length > 0) result.push(Direction.Top)
    if(spawn.room.find(FIND_EXIT_LEFT).length > 0) result.push(Direction.Left)
    if(spawn.room.find(FIND_EXIT_RIGHT).length > 0) result.push(Direction.Right)
    if(spawn.room.find(FIND_EXIT_BOTTOM).length > 0) result.push(Direction.Bottom)


    return result;
}

const handleStorage = (spawn: StructureSpawn): void => {

    const storages = spawn.room.find(FIND_STRUCTURES, {
        filter: s => s.structureType == STRUCTURE_STORAGE
    });

    spawn.memory.hasStorage = storages.length > 0;
}

const handleMap = (spawn: StructureSpawn) => {
    if(!spawn.memory.exitDirections){
        spawn.memory.exitDirections = exitDirections(spawn);
    }

    handleStorage(spawn);
};

const handleRoomsInUse = (spawn: StructureSpawn) => {
    const directions = spawn.memory.exitDirections;
    const rooms: Room[] = [spawn.room];

    for(const dir of directions){
        const roomName = adjacentRoomName(spawn.room, dir);

        if(Game.rooms[roomName]){
            const otherSpawn = Game.rooms[roomName].find(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_SPAWN
            })

            if(otherSpawn.length == 0){
                rooms.push(Game.rooms[roomName])
            }
        }
    }

    spawn.memory.roomsInUse = rooms;
}

//#endregion
const roleSpawn = {
    handleSpawn: (spawn: StructureSpawn) => {
        handleRoomsInUse(spawn);
        handleMiningNodes(spawn);
        handleDrops(spawn);
        handleMap(spawn);


    }
}

module.exports = roleSpawn;