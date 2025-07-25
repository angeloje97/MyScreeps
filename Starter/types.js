"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = exports.accumulatedCreepType = void 0;
const accumulatedCreepType = (phase, creepList) => {
    return creepList[0];
};
exports.accumulatedCreepType = accumulatedCreepType;
//#region Enums
var Status;
(function (Status) {
    Status[Status["Harvesting"] = 0] = "Harvesting";
    Status[Status["Upgrading"] = 1] = "Upgrading";
})(Status || (exports.Status = Status = {}));
//#endregion
