import depthCategories from '../../src/constants/depthCategories.mjs'
import jsonRoomProps from '../../src/constants/jsonRoomProps.mjs'
import conditions from '../../src/constants/conditions.mjs'
import hoverNames from '../../src/constants/hoverNames.mjs'

class StudioGui
{

  constructor(allLoadedJsons, scene)
  {
    this.scene = scene

    allLoadedJsons.forEach( (el, idx, ary) => {this.sortThings(el.things); el.id = idx})
    
    this.allLoadedJsons = allLoadedJsons

    this.studioJsons = allLoadedJsons.map( (el, i, ary) => Phaser.Utils.Objects.DeepCopy(el))
    
    this.jsonIdx = 0
    console.log("QQQQQQQQWEEEE", this.studioJsons[0] === this.allLoadedJsons[0], this.studioJsons[1], this.allLoadedJsons[1])

    this.thingsIdx = 0;
    //this.actualRoom = Phaser.Utils.Objects.DeepCopy(loadedJson[0])
    //this.actualRoom = this.studioJsons[this.allJsonsIdx]

    //console.dir("!!", this.loadedJson, this.actualRoom)

    this.widgetMap = new Map()
    

    this.read = document.getElementById('current')

    //this.setJson()

    this.generateMainBar()

    //this.showThing()

    this.updateJson()

    this.buildWidgets()

    //console.log(this.widgetMap)
    //this.scene.events.emit('show')
  }

  updateJson( obj = this.actualRoom )//, sort = true)
  {
    this.actualJsonName.innerText = `Room${this.jsonIdx} / ${this.studioJsons.length -1}`
    this.thingsIdx = 0
    this.showThing()
  }

  sortThings(things)
  {
    things.sort( (a, b) => depthCategories[a.depth] > depthCategories[b.depth])
  }

  buildWidgets()
  {
    const hardcoded = [...jsonRoomProps]
    hardcoded.splice(1,2)

    for (const prop of hardcoded)
    {
      this.widgetMap.set(prop, this.buildSingleWidget(prop, true))

      this["build" + prop]?.(prop)
    }

    this.showThing()
  }

  buildnoInput(prop)
  {
    const subCont = this.widgetMap.get(prop).children[1]

    const buttonA = this.addElement('b', subCont, "Remove 'noInput'")
    buttonA.addEventListener('click', this.noInputButtonA.bind(this))

    const buttonB = this.addElement('b', subCont, "Set 'noInput'")
    buttonB.addEventListener('click', this.noInputButtonB.bind(this))

    this.noInputCurrent = this.addElement('p', subCont)
    this.noInputCurrent.classList.add("prop_info")
  }

  noInputButtonA(element)
  {
    const specificProp = element.target.parentNode.parentNode.getAttribute('name')
    delete this.actualThing[specificProp]
    this.showThing()
  }
  
  noInputButtonB(element)
  {
    const specificProp = element.target.parentNode.parentNode.getAttribute('name')
    this.actualThing[specificProp] = true
    // this.skipCondCurrent.innerText = "---"
    // this.skipCondCurrent.classList.add('notset')
    this.showThing()
  }


  buildskipCond(prop)
  {
    //const specificProp = prop
    const subCont = this.widgetMap.get(prop).children[1]

    const buttonA = this.addElement('b', subCont, "Remove skip condition")
    buttonA.addEventListener('click', this.skipCondButtonA.bind(this))

    const skipCondList = this.addElement('select', subCont)
    skipCondList.add( new Option("Select Skip Condition:", "", true))
    this.buildSkipOptions(skipCondList, conditions)
    skipCondList.addEventListener('change', this.skipCondListOnchange.bind(this))

    this.skipCondCurrent = this.addElement('p', subCont)
    this.skipCondCurrent.classList.add("prop_info")
  }

  skipCondListOnchange(element)
  {
    const specificProp = element.target.parentNode.parentNode.getAttribute('name')
    if(element.target.value.length)
    {
      
      const [skipCondIndex, skipExpectedValue] = element.target.value.split("_")
      //console.log("SkipCondSELECTED:", element.target.value, skipCondIndex, skipExpectedValue)
      this.actualThing[specificProp] = "b_" + skipCondIndex + "_" + skipExpectedValue
      //console.log("List skipCond:", element.target.parentNode.parentNode, element.target.parentNode.parentNode.getAttribute('name'))
      //this.skipCondCurrent.innerText = `Skip if ${conditions[+skipCondIndex]} is ` + skipExpectedValue === "1" ? "TRUE" : "FALSE"

      this.showThing()
    }
  }

  skipCondButtonA(element)
  {
    const specificProp = element.target.parentNode.parentNode.getAttribute('name')
    delete this.actualThing[specificProp]
    this.skipCondCurrent.innerText = "---"
    this.skipCondCurrent.classList.add('notset')
    this.showThing()
  }

  buildhoverName(prop)
  {
    const subCont = this.widgetMap.get(prop).children[1]

    const buttonA = this.addElement('b', subCont, "Remove hover string")
    buttonA.addEventListener('click', this.hoverButtonA.bind(this))

    const HoverNamesList = this.addElement('select', subCont)
    HoverNamesList.add( new Option("Select Hover Name:", "", true))
    this.buildOptions(HoverNamesList, hoverNames)
    HoverNamesList.addEventListener('change', this.hoverNamesListOnchange.bind(this))

    this.hoverNameCurrent = this.addElement('p', subCont)
    this.hoverNameCurrent.classList.add("prop_info")
  }

  hoverButtonA(element)
  {
    //console.log("Removing hover string...", hoverNames, this.actualThing)
    const specificProp = element.target.parentNode.parentNode.getAttribute('name')
    delete this.actualThing[specificProp]
    this.hoverNameCurrent.innerText = "---"
    this.hoverNameCurrent.classList.add("notset")
    this.showThing()
  }

  hoverNamesListOnchange(element)
  {
    //console.log("HoverNamesListOnchange", element.target.value, hoverNames[element.target.value])
    const specificProp = element.target.parentNode.parentNode.getAttribute('name')
    //if(element.target.value.length)
    //{
      //const specificProp = element.target.parentNode.parentNode.getAttribute('name')
      const hoverNamesIndex = +element.target.value
      console.log('Bumb', hoverNames[hoverNamesIndex])
      this.actualThing[specificProp] = hoverNamesIndex
      //console.log("List HoverNames:", element.target.parentNode.parentNode, element.target.parentNode.parentNode.getAttribute('name'))
      this.hoverNameCurrent.classList.remove("notset")
      this.hoverNameCurrent.innerText = (hoverNames[hoverNamesIndex])//hoverNames[hoverNamesIndex]
    //}
    this.showThing()

  }

  buildframe(prop)
  {
    //console.log("%c BuildFrame!: ", "background-color:#fff;color:black;", prop)

    //.children[0] -> h4
    //.children[1] -> container
    const subCont = this.widgetMap.get(prop).children[1]
    //console.log(subCont)

    const buttonA = this.addElement('b', subCont, "Set Original Frame")
    buttonA.addEventListener('click', this.frameButtonA.bind(this))

    const conds = this.addElement('select', subCont)
    conds.add( new Option("Select Condition:", "", true))
    this.buildOptions(conds, conditions)
    conds.addEventListener('change', this.frameOnchange.bind(this))//event => console.log(event.target.value, conditions[+event.target.value]))

    this.frameNameCurrent = this.addElement('p', subCont)
    this.frameNameCurrent.classList.add("prop_info")
  }

  frameButtonA(element)
  {
    //console.log("PROP from FRAME Button:", element.target.parentNode.parentNode.getAttribute('name'))
    
    if (this.originalThing.depth !== "tz")
    {
      //hardcoded!
      this.actualThing.frame = this.originalThing.frame
      delete this.actualThing.frameSuffix
      delete this.actualThing.frameStem
      this.showThing()
    }
  }

  frameOnchange(element)
  {
    //console.log("PROP from FRAME List:", element.target.parentNode.parentNode.getAttribute('name'))
    
    //hardcoded!
    if (this.originalThing.depth !== "tz" && element.target.value.length !== 0)
    {
      console.log("FR onchange value:", element.target.value.length)
      delete this.actualThing.frame
      this.actualThing.frameSuffix = +element.target.value
      this.actualThing.frameStem = this.originalThing.frame.substring(0, this.originalThing.frame.length - 1)
    }
    this.showThing()

  }
  
  buildSingleWidget(name = "TEST NAME", addNameAsProp = false)
  {
    const {addElement} = this

    const widgetCont = addElement('div', document.getElementById('studioContainer'))
    const title = addElement("h4", widgetCont, name)

    const wCommands = addElement("div", widgetCont)
    wCommands.classList.add("sub-cont")

    if (addNameAsProp)
    {
      widgetCont.setAttribute("name", name)
    }

    return widgetCont
    //const buttonAdd = addElement("i", wCommands, "Add " + name)
    //buttonAdd.addEventListener('click', this.prevThing.bind(this))
  }

  nextThing()
  {
    this.thingsIdx = ++this.thingsIdx % this.things.length
    this.showThing()
  }

  prevThing()
  {
    this.thingsIdx = this.thingsIdx === 0 ? this.things.length - 1 : --this.thingsIdx
    this.showThing()
  }

  nextJson()
  {
    this.jsonIdx = ++this.jsonIdx % this.studioJsons.length
    this.updateJson()
  }

  prevJson()
  {
    this.jsonIdx = this.jsonIdx === 0 ? this.studioJsons.length - 1 : --this.jsonIdx
    this.updateJson()
  }

  generateMainBar()
  {
    const mainBar = document.getElementById('mainbar')
    mainBar.classList.add("padOne", "someBg")

    const prevThing = this.addElement("i", mainBar, "<<Thing")
    prevThing.addEventListener('click', this.prevThing.bind(this))

    this.actualThingName = this.addElement('em', mainBar, "")

    const nextThing = this.addElement("i", mainBar, "Thing>>")
    nextThing.addEventListener('click', this.nextThing.bind(this))

    /*
    const toggleThings = this.addElement("b", mainBar, "Toggle Things")
    toggleThings.addEventListener('click', this.toggleThingsCommands.bind(this))

    const collapseThings = this.addElement("b", mainBar, "Collapse Things")
    collapseThings.addEventListener('click', this.collapseThingsCommands.bind(this))

    const expandThings = this.addElement("b", mainBar, "Expand Things")
    expandThings.addEventListener('click', this.expandThingsCommands.bind(this))
    */

    const prevJson = this.addElement("i", mainBar, "<<Json")
    prevJson.addEventListener('click', this.prevJson.bind(this))

    this.actualJsonName = this.addElement('em', mainBar, "")

    const nextJson = this.addElement("i", mainBar, "Json>>")
    nextJson.addEventListener('click', this.nextJson.bind(this))

    const saveJson = this.addElement("b", mainBar, "Save Json")
    saveJson.addEventListener('click', this.saveBlob.bind(this))

    const loadJson = this.addElement('input', mainBar, "Load")
    loadJson.setAttribute('type', 'file')
    loadJson.addEventListener('change', this.readSingleFile.bind(this), false)
  }

  addElement (type, parent, text = "")
  {
    const newElem = document.createElement(type);

    newElem.innerText = text

    parent.appendChild(newElem);
    
    return newElem
  }

  previewThing(obj = this.actualThing)//things[this.thingsIdx])
  {
    let res = "{\n"
    for (const prop in obj)
    {
      res +=`${prop}: ${obj[prop]},\n`
    }
    res = res.substring(0, res.length-2)+"\n}"

    return res
  }

  showThing()
  {
    this.read.innerText = this.previewThing()
    this.actualThingName.innerText = `${this.thingsIdx} / ${this.things.length -1}`

    //hoverNameCurrent
    if(this.hoverNameCurrent)
    {
      //console.log("GAZG:", this.actualThing?.hoverName, this.actualThing?.hoverName >= 0)
      if (this.actualThing?.hoverName >= 0)
      {
        this.hoverNameCurrent.innerText = hoverNames[this.actualThing.hoverName]
        this.hoverNameCurrent.classList.remove("notset")
      }

      else
      {
        this.hoverNameCurrent.innerText = "---"
        this.hoverNameCurrent.classList.add("notset")
      }

      //this.hoverNameCurrent.innerText = this.actualThing?.hoverName ? hoverNames[this.actualThing.hoverName] : "---"
      this.hoverNameCurrent.previousSibling.selectedIndex = 0
    }

    //frameNameCurrent
    if(this.frameNameCurrent)
    {
      //console.log("Risalendo", this.frameNameCurrent)
      this.frameNameCurrent.innerText = typeof (this.actualThing?.frameSuffix) === "number" ? `"${this.actualThing.frameStem}" + ${conditions[this.actualThing.frameSuffix]}` : this.actualThing.frame
      this.frameNameCurrent.previousSibling.selectedIndex = 0
    }

    if (this.skipCondCurrent)
    {
      if (this.actualThing?.skipCond)
      {
        const [variableType, skipCondIndex, skipExpectedValue] = this.actualThing.skipCond.split("_")//element.target.value.split("_")
        //console.log("SkipCondSELECTED: ORCO====>", skipCondIndex, skipExpectedValue)
        //this.actualThing["skipCond"] = "b_" + skipCondIndex + "_" + skipExpectedValue
        //console.log("List skipCond:", element.target.parentNode.parentNode, element.target.parentNode.parentNode.getAttribute('name'))
        this.skipCondCurrent.innerText = `Skip if ${conditions[+skipCondIndex]} is ` + (skipExpectedValue === "1" ? "TRUE" : "FALSE")
        this.skipCondCurrent.previousSibling.selectedIndex = 0
        this.skipCondCurrent.classList.remove("notset")


      }
      else
      {
        this.skipCondCurrent.innerText = "Never Skip..."
        this.skipCondCurrent.classList.add("notset")

      }

      
    }

    if (this.noInputCurrent)
    {
      if (this.actualThing.noInput)
      {
        this.noInputCurrent.innerText = 'true'
        this.noInputCurrent.classList.remove("notset")
      }
      
      else
      {
        this.noInputCurrent.innerText = 'Is Input Enabled and Active'
        this.noInputCurrent.classList.add("notset")
      }
    }
    /*
    if(this.scene.dummy)//this.scene.previewThing.apply(this.scene)
    {
      console.log(this.scene.dummy)
      this.scene.previewThing.call(this.scene, this, this.scene)
    }
    */
    this.scene.events.emit('show')
  }

  get actualThing()
  {
    return this.things[this.thingsIdx]
  }

  get actualRoom()
  {
    return this.studioJsons[this.jsonIdx]
  }

  get things()
  {
    return this.actualRoom.things
  }

  get originalJson()
  {
    return this.allLoadedJsons[this.jsonIdx]
  }

  get originalThing()
  {
    return this.originalJson.things[this.thingsIdx]
  }

  buildOptions(selectElem, ary)
  {
    for (const [idx, elem] of ary.entries())
    {
      const option = document.createElement("option")
      option.text = elem
      option.value = idx
      selectElem.add(option)
    }

    //delete all options from select element
    //const x = document.getElementById("mySelect");
    //while (x.length)
    //  {
    //    x.remove(0);
    //    console.log(x.length)
    //  }

    /////////////

    //add one
    //const option = document.createElement("option");
    //option.text = "Kiwi";
    //x.add(option);
  }

  buildSkipOptions(selectElem, ary)
  {
    for (const [idx, elem] of ary.entries())
    {
      const option = document.createElement("option")
      option.text = elem + "_TRUE"
      option.value = idx + "_1"
      selectElem.add(option)

      const optionFalse = document.createElement("option")
      optionFalse.text = elem + "_FALSE"
      optionFalse.value = idx + "_0"
      selectElem.add(optionFalse)
    }
  }

  saveBlob()//originalData = this.actualRoom, fileName = `room${this.jsonIdx}data.json`)
  {
    const originalData = this.actualRoom, fileName = `room${this.jsonIdx}data.json`
    console.log("%c%ARGUMENTS SAVE:", "background-color:green;", [...arguments])
    const a = document.createElement("a");
    console.log("%c%Saving:", "background-color:black;", originalData)
    const uri =  URL.createObjectURL(new Blob([JSON.stringify(originalData, null, 0)], {
        type: "text/plain"
    }));
    a.href = uri
    a.setAttribute("download", fileName);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(uri);
  }

  readSingleFile(event)
  {
    let file = event.target.files[0];
    
      if (!file)
      {
          return;
      }

    const reader = new FileReader();
    
    reader.onload = (event) =>
    {
      // var contents = event.target.result;
      // console.log(JSON.parse(contents))
      // console.log(this.studioJsons)
      const contents = JSON.parse(event.target.result)
      this.studioJsons[contents.id] = contents
    };
    
    reader.readAsText(file);
  }

  

}

export {StudioGui}