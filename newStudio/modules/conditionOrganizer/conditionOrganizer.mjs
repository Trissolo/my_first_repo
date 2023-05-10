import AutoComplete from "../autocomplete/AutoComplete.mjs";

import InGameArrays from "../placeholders/InGameArrays.mjs";

import studioEvents from "../eventEmitter/StudioEvents.mjs";

const arrayLength = 3;

export default class conditionOrganizer
{
    static simplifiedCondition = new Array(arrayLength).fill();//[undefined, undefined, undefined];

    static get currentKind()
    {
        return this.simplifiedCondition[0];
    }

    static get currentVarId()
    {
        return this.simplifiedCondition[1];
    }

    static get currentExpectedVal()
    {
        return this.simplifiedCondition[2];
    }

    static set currentKind(kind)
    {
        this.simplifiedCondition[0] = +kind;
    }

    static set currentVarId(varIdx)
    {
        this.simplifiedCondition[1] = +varIdx;
    }

    static set currentExpectedVal(value)
    {
       this.simplifiedCondition[2] = Array.isArray(value)? value : +value;
    }

    static clearCondition(emitSignal = false)
    {
        for (let i = 0; i < arrayLength; i++)
        {
            this.simplifiedCondition[i] = undefined;
        }

        if (emitSignal)
        {
            studioEvents.emitter.emit(studioEvents.events.clearCondition);
        }
    }

    static setKind(kind)
    {
        this.clearCondition();

        this.currentKind = kind;

        return this;
    }
    

    // static clearSimplifiedCondition()
    // {
    //     this.simplifiedCondition.length = 0;

    //     return this;
    // }

    // static clearVarsData()
    // {
    //     this.currentKind = null;

    //     this.currentVarId = null;

    //     return this;
    // }

    // static clearCurrentExpectedVal()
    // {
    //     this.currentExpectedVal = null;

    //     return this;
    // }

    // static resetSimplifiedCondition()
    // {
    //     this.simplifiedCondition.length = 0;

    //     this.currentKind = null;

    //     this.currentVarId = null;

    //     this.currentExpectedVal = null;

    //     return this;
    // }

    // static setCurrentKind(numKind)
    // {
    //     this.currentKind = numKind;

    //     return this;
    // }

    // static setCurrentVarId(numVarId)
    // {
    //     this.currentVarId = numVarId;

    //     return this;
    // }

    // static setExpectedVal(numExpectedVal)
    // {
    //     this.currentExpectedVal = numExpectedVal;

    //     return this;
    // }

    // static getSimplifiedConditionArray(clone = false)
    // {
    //     const simpAry = clone? [] : this.simplifiedCondition;

    //     simpAry[0] = this.currentKind;

    //     simpAry[1] = this.currentVarId;

    //     simpAry[2] = this.currentExpectedVal;

    //     return simpAry;
    // }

    // static parseCondArray([currentKind, currentVarId, currentExpectedVal] = conditionOrganizer.getSimplifiedConditionArray())
    // {
    //     const res = [];

    //     if (!InGameArrays.originalArrays.has(currentKind))
    //     {
    //         return res;
    //     }

    //     const origAry = InGameArrays.originalArrays.get(currentKind);

    //     res.push(
    //         `${InGameArrays.VarKindEnum[currentKind]}`,
    //         /*typeof currentVarId === AutoComplete.codeStrings.NUMBER?*/ `${origAry[currentVarId]} (${currentVarId})` /*: null*/,
    //         /*typeof currentExpectedVal === AutoComplete.codeStrings.NUMBER?*/ `${currentExpectedVal}`/*: null*/
    //     );

    //     return res;
    // }

    // static testGetSelVarName()
    // {
    //     const {currentKind, currentVarId} = this;

    //     return `:) ${InGameArrays.originalArrays.get(currentKind)[currentVarId]} (${currentVarId})`;
    // }
}
