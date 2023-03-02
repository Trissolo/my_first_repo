import cssSelectors from "../autocomplete/cssSelectors.mjs";

const addElement = (type, parent, text = "") => {
  const newElem = document.createElement(type);

  newElem.innerText = text

  parent.appendChild(newElem);
  
  return newElem
}

/*
 buildSingleWidget(name = "TEST NAME", addNameAsProp = false)
  {
    const widgetCont = addElement('div', document.getElementById('studioContainer'))
    const title = addElement("h4", widgetCont, name)

    const wCommands = addElement("div", widgetCont)
    wCommands.classList.add("sub-cont")

    if (addNameAsProp)
    {
      widgetCont.setAttribute("name", name)
    }

    return widgetCont

  }
*/
// document.getElementById(cssSelectors.ids.GUI_widgets)

const widgetStuff = {};

export default widgetStuff
