import { run } from "node:test";
import { accumulatedCreepType, CreepType } from "./types";


const { spawnCreep } = require("spawnerHelper");


const knightTypes: CreepType[] = [
    {
        phase: 2,
        count: 2,
        name: "Knight",
        body: [MOVE, ATTACK, MOVE, ATTACK],
        memory: {
            role: "knight",
        }
    }
]

const roleKnight = {
    run: (creep: Creep):void => {
        const hostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(hostile){
            if(creep.attack(hostile) == ERR_NOT_IN_RANGE){
                creep.moveTo(hostile);
            }
        }
    },
    handleKnights: (spawn: StructureSpawn):void => {

        // spawnCreep(spawn, accumulatedCreepType(Game.spawns['Spawn1'].room.controller?.level || 1, knightTypes))
    },
};

module.exports = roleKnight;