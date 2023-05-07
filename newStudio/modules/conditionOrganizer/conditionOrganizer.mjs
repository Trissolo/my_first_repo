import InGameArrays from "../placeholders/InGameArrays.mjs";

export default class conditionOrganizer
{
    static currentKind;
    static currentVarId;
    static currentExpectedVal;
    
    static simplifiedCondition = [];

    static clearSimplifiedCondition()
    {
        this.simplifiedCondition.length = 0;

        return this;
    }

    static clearVarsData()
    {
        this.currentKind = null;

        this.currentVarId = null;

        return this;
    }

    static clearCurrentExpectedVal()
    {
        this.currentExpectedVal = null;

        return this;
    }

    static resetSimplifiedCondition()
    {
        this.simplifiedCondition.length = 0;

        this.currentKind = null;

        this.currentVarId = null;

        this.currentExpectedVal = null;

        return this;
    }

    static setCurrentKind(numKind)
    {
        this.currentKind = numKind;

        return this;
    }

    static setCurrentVarId(numVarId)
    {
        this.currentVarId = numVarId;

        return this;
    }

    static setExpectedVal(numExpectedVal)
    {
        this.currentExpectedVal = numExpectedVal;

        return this;
    }

    static getSimplifiedConditionArray(clone = false)
    {
        const simpAry = clone? [] : this.simplifiedCondition;

        simpAry[0] = this.currentKind;

        simpAry[1] = this.currentVarId;

        simpAry[2] = this.currentExpectedVal;

        return simpAry;
    }

    static parseCondArray([currentKind, currentVarId, currentExpectedVal])
    {
        const res = [];

        if (!InGameArrays.originalArrays.has(currentKind))
        {
            return res;
        }

        const origAry = InGameArrays.originalArrays.get(currentKind);

        res.push(
            `${InGameArrays.VarKindEnum[currentKind]}`,
            `${origAry[currentVarId]} (${currentVarId})`,
            `${currentExpectedVal}`
        );

        return res;
    }
}
