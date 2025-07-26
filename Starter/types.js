"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = exports.accumulatedCreepType = void 0;
const accumulatedCreepType = (phase, creepList) => {
    return creepList[0];
};
exports.accumulatedCreepType = accumulatedCreepType;
//#endregion
//#region Enums
var Status;
(function (Status) {
    Status[Status["None"] = 0] = "None";
    Status[Status["Harvesting"] = 1] = "Harvesting";
    Status[Status["Upgrading"] = 2] = "Upgrading";
    Status[Status["Building"] = 3] = "Building";
})(Status || (exports.Status = Status = {}));
//#endregion
