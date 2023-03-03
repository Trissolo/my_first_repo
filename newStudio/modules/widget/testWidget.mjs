import BaseWidget from "./classes/baseWidget.mjs";
import TextField from "./classes/textField.mjs";
import PseudoButton from "./classes/pseudoButton.mjs";

import AutoComplete from "../autocomplete/AutoComplete.mjs";
import JsonManager from "../jsonManager/JsonManager.mjs";

export default class testWidget extends BaseWidget
{
    constructor()
    {
        super("TestWidget");

        this.button = new PseudoButton(this.widget, "add Prefix")

        this.qwe = new TextField(this.widget, "Orcus");
        this.qwe.addClass(AutoComplete.cssSelectors.classes.textFieldA);

        this.button.addClass(AutoComplete.cssSelectors.classes.pseudoButton);
        this.button.addClass(AutoComplete.cssSelectors.classes.buttonStyleA);

        this.buttBeh = (event) => {
            console.log(JsonManager.currentThing, JsonManager.wholeJsonToJson());
            this.qwe.classList.length? this.qwe.removeClass(AutoComplete.cssSelectors.classes.textFieldA):this.qwe.addClass(AutoComplete.cssSelectors.classes.textFieldA)
        }
        this.button.setOnClick(this.buttBeh)

    }
}

// import cssSelectors from "../autocomplete/cssSelectors.mjs";

// const addElement = (type, parent, text = "") => {
//   const newElem = document.createElement(type);

//   newElem.innerText = text

//   parent.appendChild(newElem);
  
//   return newElem
// }

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

/*
<!DOCTYPE html>
    <html>
    <style>
    .pseudoButton {
        text-decoration: none;
        font-style: normal;
        display: inline-block;
        background-color: #55ff98;
        border-color: black;
        padding: 6px 8px;
        margin: 0 1em;
  }
  
.pseudoButton:hover {
        color: white;
        background-color: # 0089 ab;
    }
    </style>
    
    <body>
        
    <p id = "demo">demo</p>
    
    <script>
    
        const addElement = (type, parent, text = "") => {
        
            const newElem = document.createElement(type);
            
            newElem.innerText = text
            
            parent.appendChild(newElem);
            
            return newElem
        }


        class Button {
            elem;
            
            constructor(parent, text)
            {
                this.elem = addElement("i", parent, text);
                this.elem.classList.add("pseudoButton");
                this.orcus = (event) => {
                    console.log(event, "THn,mn,mnm,nm,nm,:", this)
                }
            }
            
            clickBehavior(func)
            {
                this.elem.addEventListener('click', func)
            }
            
            
        }

        const ba = new Button(document.getElementById("demo"), "TESTBU")
        console.log(ba.orcus, ba)
        ba.clickBehavior(ba.orcus)

    </script>
    
    </body>
</html>
*/
// document.getElementById(cssSelectors.ids.GUI_widgets)

// const widgetStuff = {};

// export default widgetStuff
