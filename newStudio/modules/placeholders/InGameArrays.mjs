import arrayIds from "./arrayIds.mjs";

import Conditions from "./Conditions.mjs";
import OnHoverNames from "./OnHoverNames.mjs";

const originalArrays = new Map([
    [arrayIds.Bool, Conditions],
    [arrayIds.HoverNames, OnHoverNames]
])

export default {
    arrayIds,
    originalArrays
};
