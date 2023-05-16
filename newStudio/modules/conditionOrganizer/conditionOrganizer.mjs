import AutoComplete from "../autocomplete/AutoComplete.mjs";

import InGameArrays from "../placeholders/InGameArrays.mjs";

import studioEvents from "../eventEmitter/StudioEvents.mjs";

const arrayLength = 3;

export default class conditionOrganizer
{
    static simplifiedCondition = new Array(arrayLength).fill();

    // static ParseCondition()
    // {
    //     console.log("originalArrays, from InGameArrays", InGameArrays.originalArrays);

    //     const origAry = InGameArrays.originalArrays.get(this.currentKind);

    //     const {currentVarId} = this;

    //     studioEvents.emitter.emit(studioEvents.events.conditionParsed, currentVarId, origAry[currentVarId], origAry);
    //     // if (InGameArrays.originalArrays.has(this.currentKind))
    //     // {
            
    //     // }
    // }

    static getCondition(clone = true)
    {
        return clone? [...this.simplifiedCondition]: this.simplifiedCondition;
    }

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
        this.simplifiedCondition[0] = kind;

        studioEvents.emitter.emit(studioEvents.events.condNewKind, kind);
    }

    static set currentVarId(varIdx)
    {
        this.simplifiedCondition[1] = varIdx;

        studioEvents.emitter.emit(studioEvents.events.condNewVarIdx, varIdx);
        

        // studioEvents.emitter.emit(studioEvents.events.conditionSetVarIdx, varIdx, InGameArrays.originalArrays.get(varIdx)?.[varIdx]);
    }

    static set currentExpectedVal(value)
    {
       this.simplifiedCondition[2] = value; // Array.isArray(value)? value : +value;
       
       studioEvents.emitter.emit(studioEvents.events.condNewExpected, value);
       
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
        console.log("originalArrays, from InGameArrays", InGameArrays.originalArrays);
        this.clearCondition();

        this.currentKind = kind;

        return this;
    }

    static setVarIdx(value)
    {
        this.currentVarId = value;

        studioEvents.emitter.emit(studioEvents.events.conditionChangedVarIdx, value, InGameArrays.originalArrays.get(conditionOrganizer.currentKind)?.[value]);

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
