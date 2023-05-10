import addElement from "./addElement.mjs";
import cssSelectors from "../autocomplete/cssSelectors.mjs";

export default function addVerticalDivider(container)
{
    const divider = addElement('i', container);

    divider.classList.add(cssSelectors.classes.vertDivider);

    return divider;
}
