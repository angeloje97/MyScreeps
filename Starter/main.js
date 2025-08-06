"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loop = loop;
const types_1 = require("./types");
const structureHandler = require("structures");
const roleClaimer = require("./role.claimer");
const roleScout = require("./role.scout");
const roleGrunt = require("./role.grunt");
const roleKnight = require("./role.knight");
const roleMiner = require("./role.miner");
const roleUpgrader = require('./role.upgrader');
const roleRecharger = require("./role.recharger");
const roleHauler = require("./role.hauler");
const roleSpawn = require("./role.spawn");
const tower = require("./tower");
function loop() {
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
    for (const spawn of Object.values(Game.spawns)) {
        roleSpawn.handleSpawn(spawn);
        structureHandler.run(spawn);
        roleClaimer.handleClaimers(spawn);
        roleScout.handleScouts(spawn);
        roleUpgrader.handleUpgraders(spawn);
        roleRecharger.handleRechargers(spawn);
        roleHauler.handleHaulers(spawn);
        roleMiner.handleMiner(spawn);
        roleGrunt.handleGrunt(spawn);
        roleKnight.handleKnights(spawn);
        tower.run(spawn);
        tower.handleTowers(spawn);
    }
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role == types_1.Role.Grunt)
            roleGrunt.run(creep);
        if (creep.memory.role == types_1.Role.Hauler) {
            roleHauler.run(creep);
        }
        if (creep.memory.role == types_1.Role.Miner)
            roleMiner.run(creep);
        if (creep.memory.role == types_1.Role.Upgrader)
            roleUpgrader.run(creep);
        if (creep.memory.role == types_1.Role.Knight)
            roleKnight.run(creep);
        if (creep.memory.role == types_1.Role.Scout) {
            roleScout.run(creep);
        }
        if (creep.memory.role == types_1.Role.Recharger) {
            roleRecharger.run(creep);
        }
        if (creep.memory.role == types_1.Role.Claimer) {
            roleClaimer.run(creep);
        }
    }
}
