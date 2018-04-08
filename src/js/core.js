import general from './general-functions'
import map from 'lodash/map'

var createSection = require("./templates/create-section.handlebars");


export default class core {

    constructor(elem) {
        this.elem = elem;
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
        contenteditableDiv.setAttribute("placeholder", "write here...");
        contenteditableDiv.classList.add("cm-content");
        contenteditableDiv.id = "cm-content-" + id;

        section.appendChild(contenteditableDiv);

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


        // show/hide burron control
        contenteditableDiv.addEventListener("input", function (event) {
            let buttonControl = document.querySelector("#cm-btn-control-" + contenteditableDiv.parentNode.id);
            if (!this.innerText.trim().length) {
                buttonControl.classList.remove("hidden");
            } else {
                buttonControl.classList.add("hidden");
            }

            thisClass.updateContent(contenteditableDiv);
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