"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loop = loop;
const roleHarvester = require("role.harvester");
const roleUpgrader = require("role.upgrader");
function loop() {
    for (const name in Memory.creeps) {
        if (!(name in Game.creeps)) {
            delete Memory.creeps[name];
        }
    }
    roleHarvester.handleHarvesters();
    roleUpgrader.handleUpgraders();
    for (const name in Game.creeps) {
        const creep = Game.creeps[name];
        if (creep.memory.role == "harvester") {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == "upgrader") {
            roleUpgrader.run(creep);
        }
    }
}
