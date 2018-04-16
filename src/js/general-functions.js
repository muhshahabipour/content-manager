export const insertAfter = (newElement, targetElement) => {
    // target is what you want it to go after. Look for this elements parent.
    var parent = targetElement.parentNode;
    // if the parents lastchild is the targetElement...
    if (parent.lastChild == targetElement) {
        // add the newElement after the target element.
        parent.appendChild(newElement);
    } else {
        // else the target has siblings, insert the new element between the target and it's next sibling.
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}

export const setEndOfContenteditable = (contentEditableElement) => {
    let range, selection;
    if (document.createRange) //Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange(); //Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
        range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection(); //get the selection object (allows you to change selection)
        selection.removeAllRanges(); //remove any selections already made
        selection.addRange(range); //make the range you have just created the visible selection
    } else if (document.selection) //IE 8 and lower
    {
        range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement); //Select the entire contents of the element with the range
        range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
        range.select(); //Select the range (make it the visible selection
    }
}

export const uuid = () => {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}


export const toEnum = (a) => {
    let i = Object
        .keys(a)
        .reduce((o, k) => (o[a[k]] = k, o), {});

    return Object.freeze(
        Object.keys(a).reduce(
            (o, k) => (o[k] = a[k], o), v => i[v]
        )
    );
}


export const isExistInEnum = (enum1, key) => {
    return Object.values(enum1).includes(key)
}




export default {
    insertAfter,
    setEndOfContenteditable,
    uuid,
    toEnum,
    isExistInEnum
}