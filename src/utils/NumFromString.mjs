function adaptStringParam(stringParam, startFrom = 1)
{
    const ary = stringParam.split("_")
    for (let i = startFrom; i < ary.length; i++)
    {
        ary[i] = +ary[i]
    }

    return ary
}
    
export default adaptStringParam