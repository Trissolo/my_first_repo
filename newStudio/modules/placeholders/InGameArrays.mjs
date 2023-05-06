import arrayIds from "./arrayIds.mjs";
import VarKindEnum from "./VarKindEnum.mjs";

import Conditions from "./Conditions.mjs";
import OnHoverNames from "./OnHoverNames.mjs";

import TestCrumbleNames from "../widget/studiowidgets/skipCondition/TestCrumbleNames.mjs";

const originalArrays = new Map([
    [arrayIds.Bool, Conditions],
    [arrayIds.Crumble, TestCrumbleNames],
    [arrayIds.HoverNames, OnHoverNames]
]);

export default {
    arrayIds,
    originalArrays,
    VarKindEnum
};
