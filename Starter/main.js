"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loop = loop;
const structureHandler = require("structures");
const roleGrunt = require("./role.grunt");
const roleKnight = require("./role.knight");
const roleMiner = require("./role.miner");
const roleUpgrader = require('./role.upgrader');
const roleHauler = require("./role.hauler");
const tower = require("./tower");
function loop() {
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
    for (const spawn of Object.values(Game.spawns)) {
        structureHandler.run(spawn);
        roleKnight.handleKnights(spawn);
        roleUpgrader.handleUpgraders(spawn);
        roleHauler.handleHaulers(spawn);
        roleMiner.handleMiner(spawn);
        roleGrunt.handleGrunt(spawn);
        tower.run(spawn);
        tower.handleTowers(spawn);
    }
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role == 'grunt')
            roleGrunt.run(creep);
        if (creep.memory.role == 'knight')
            roleKnight.run(creep);
        if (creep.memory.role == 'miner')
            roleMiner.run(creep);
        if (creep.memory.role == 'upgrader')
            roleUpgrader.run(creep);
        if (creep.memory.role == 'hauler') {
            roleHauler.run(creep);
        }
    }
}
