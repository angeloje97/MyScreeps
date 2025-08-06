import { adjacentRoom, adjacentRoomName, spawnCreep } from "./general";
import { CreepType, Direction, Role } from "./types";

const variableCount = (spawn: StructureSpawn): number => {
    
    if(!spawn.memory.hasStorage) return 0;
    
    return spawn.memory.exitDirections.length;
}

const scoutTypes: CreepType[] = [
    {
        phase: 4,
        count: 1,
        body: [
            ...Array(2).fill(TOUGH),
            ...Array(6).fill(MOVE),

        ],
        memory: {
            role: Role.Scout,
            stationed: false,
        },

        forAll: true,
        variableCount,
    }
]




const discoverRoom = (creep: Creep, direction: Direction) => {
    const originSpawn = Game.spawns[creep.memory.spawn!]

    let discovering = false;
    const roomName= adjacentRoomName(originSpawn.room, direction);
    const room = Game.rooms[roomName]

    if(creep.room.name !== roomName){
        const exitDir: number = creep.room.findExitTo(roomName);
        const exitPositions = creep.room.find(exitDir as FindConstant);
        const exitPos = creep.pos.findClosestByPath(exitPositions);

        if(exitPos){
            creep.moveTo(exitPos);
            discovering = true;
        }
    }
    else{
        const sources = creep.room.find(FIND_SOURCES);

        if(creep.pos.getRangeTo(sources[0]) <= 3){

        }
        else{
            creep.moveTo(sources[0])
        }
    }
}

export const roleScout = {
    run: (creep: Creep) => {
        const directions = Game.spawns[creep.memory.spawn!].memory.exitDirections;

        const direction = directions[creep.memory.index! % directions.length]

        discoverRoom(creep, direction);
    },
    
    handleScouts: (spawn: StructureSpawn) => {
        spawnCreep(spawn, scoutTypes);
    }
}

module.exports = roleScout;