const addElement = (type, parent, text = "") => {
    const newElem = document.createElement(type);
  
    newElem.innerText = text
  
    parent.appendChild(newElem);
    
    return newElem
  }

export default addElement
