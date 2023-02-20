// Don't forget to set the JSONs amount!
const amount = 2


const GimpJsonLoader = (async function()
{
    const resAry = []

    const relativePath = "not_yet_defined_path/base_jsons_from_gimp/"

    for (let i = 0; i < amount; i++)
    {
        // here 'await' is mandatory
        await fetch(`${relativePath}room${i}_rawdata.json`)
        .then(response => response.json())
        .then(data => resAry.push(data))
    }

    return resAry
})()

export default await GimpJsonLoader

