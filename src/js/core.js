import general from './general-functions'
import tippy from 'tippy.js'
import map from 'lodash/map'

var createSection = require("./templates/create-section.handlebars");
var tooltip = require("./templates/tooltip.handlebars");


export default class core {

    constructor(elem, defaults) {
        this.elem = elem;
        this.defaults = defaults;
        this.data = [];
    }

    watch = (event) => {
        // console.log("event", event);
        // console.log("detail", event.detail);
    }

    createSection = (lastSection) => {
        let thisClass = this;
        const id = general.uuid();

        let thisObject = {
            id: id,
            type: "",
            content: ""
        }

        this.data.push(thisObject);

        let section = document.createElement('div');
        section.classList.add('cm-section');
        section.id = id;


        let contenteditableDiv = document.createElement('div');

        // let date = new Date()
        // contenteditableDiv.innerHTML = "for test => " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

        contenteditableDiv.setAttribute("contenteditable", "true");
        contenteditableDiv.setAttribute("placeholder", this.defaults.placeholder || "write here...");
        contenteditableDiv.classList.add("cm-content");
        contenteditableDiv.id = "cm-content-" + id;

        section.appendChild(contenteditableDiv);

        // console.log(this.defaults.editor)


        contenteditableDiv.addEventListener("keypress", (event) => {
            let keycode = (event.charCode ? event.charCode : event.which);
            if (keycode === 8) {
                let inn = contenteditableDiv.innerText.trim();
                if (inn === "" || !inn.length || inn === "\r\n" || inn === "\n") {
                    // remove section
                    event.preventDefault();
                    console.log("try to remove");
                    if (this.elem.querySelectorAll('.cm-section').length > 1) {
                        this.elem.removeChild(section);
                        let lastElement = this.elem.lastElementChild.querySelector('.cm-content')
                        general.setEndOfContenteditable(lastElement);
                    }
                }
            }
        });

        contenteditableDiv.addEventListener("keydown", (event) => {
            let keycode = (event.charCode ? event.charCode : event.which);
            if (keycode === 13 && (event.ctrlKey || event.metaKey)) {

                // new line
                event.preventDefault();
                document.execCommand("insertparagraph", false, contenteditableDiv.id)
                general.setEndOfContenteditable(contenteditableDiv);

            } else if (keycode === 13) {

                // new section
                event.preventDefault();
                thisClass.createSection(section);
            }
        });


        // show/hide button control
        contenteditableDiv.addEventListener("input", function (event) {
            let buttonControl = document.querySelector("#cm-btn-control-" + contenteditableDiv.parentNode.id);
            if (!this.innerText.trim().length) {
                buttonControl.classList.remove("hidden");
            } else {
                buttonControl.classList.add("hidden");
            }

            thisClass.updateContent(contenteditableDiv);
        });


        contenteditableDiv.addEventListener('mouseup', function (event) {
            let selection;

            if (window.getSelection) {
                selection = window.getSelection();
            } else if (document.selection) {
                selection = document.selection.createRange();
            }

            if (selection.toString().length) {
                let span = document.createElement('span');
                span.textContent = selection.toString();
                // span.setAttribute('title', "textContent");

                let range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(span);

                // alert(selection.toString())

                // selection.toString() !== '' && alert('"' + selection.toString() + '" was selected at ' + event.pageX + '/' + event.pageY);
                let a = document.createElement('div');
                a.innerHTML = tooltip();

            }
        });

        // add to target
        let btnControlDiv = document.createElement('div');
        btnControlDiv.classList.add("cm-btn-control");
        btnControlDiv.id = "cm-btn-control-" + id;
        btnControlDiv.innerHTML = createSection({
            id: id
        });


        section.appendChild(btnControlDiv);




        // get btn create
        let btnCreate = btnControlDiv.querySelector(".btn-create");

        // get create items wrapper
        let createList = btnControlDiv.querySelector(".create-section-list");

        // initial add button click
        btnCreate.addEventListener("click", () => {
            createList.classList.toggle('show');
            btnCreate.classList.toggle('close');
        });

        // get create items
        let btnsAdd = btnControlDiv.querySelectorAll("[data-action='add']");

        // initial add type button click
        btnsAdd.forEach((btnAdd) => {
            btnAdd.addEventListener("click", (event) => {
                console.log(event.currentTarget.dataset["type"]);
            })
        });


        if (!lastSection) {
            this.elem.appendChild(section);
        } else {
            general.insertAfter(section, lastSection);
        }


        contenteditableDiv.focus();


    }


    updateContent = (elem) => {
        const id = elem.parentNode.id;
        const content = elem.innerHTML;

        map(this.data, function (item) {
            if (item.id === id)
                item.content = content;

            return item;
        })
    }

    init = () => {
        this.createSection();
    }


    getData = () => {
        return this.data;
    }

}