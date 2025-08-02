
import { Role } from "./types";


const structureHandler = require("structures");
const roleScout = require("./role.scout")
const roleGrunt = require("./role.grunt")
const roleKnight = require("./role.knight")
const roleMiner = require("./role.miner")
const roleUpgrader = require('./role.upgrader')
const roleHauler = require("./role.hauler")

const roleSpawn = require("./role.spawn");

const tower = require("./tower")

export function loop(): void {
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }

  for(const spawn of Object.values(Game.spawns)){
    
    roleSpawn.handleSpawn(spawn);
    structureHandler.run(spawn);

    roleKnight.handleKnights(spawn);
    
    roleScout.handleScouts(spawn);
    roleUpgrader.handleUpgraders(spawn);
    roleHauler.handleHaulers(spawn);
    roleMiner.handleMiner(spawn);
    roleGrunt.handleGrunt(spawn);

    
    tower.run(spawn);
    tower.handleTowers(spawn);
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];

    if(creep.memory.role == Role.Grunt)
      roleGrunt.run(creep)

    if(creep.memory.role == Role.Hauler){
      roleHauler.run(creep)
    }

    if(creep.memory.role == Role.Miner)
      roleMiner.run(creep)

    if(creep.memory.role == Role.Upgrader)
      roleUpgrader.run(creep)

    if(creep.memory.role == Role.Knight)
      roleKnight.run(creep);

    if(creep.memory.role == Role.Scout){
      roleScout.run(creep);
    }
  }
}
