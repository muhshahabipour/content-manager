import general from './general-functions'
// import fileManager from './filemanager'
import FileManager from 'vaslapp-file-manager'
import linkManaager from './link'
import mediumEditor from 'medium-editor'
import map from 'lodash/map'
// import extend from 'lodash/extend'
import remove from 'lodash/remove'
import transform from 'lodash/transform'

var createSection = require("./templates/create-section.handlebars");
var modalURL = require("./templates/modal-url.handlebars");

var imageTemplate = require("./templates/image-template.handlebars");
var videoTemplate = require("./templates/video-template.handlebars");
var soundTemplate = require("./templates/sound-template.handlebars");
var linkTemplate = require("./templates/link-template.handlebars");



const ContentType = general.toEnum({
    TEXT: "text",
    IMAGE: "image",
    VIDEO: "video",
    AUDIO: "audio",
    LINK: "link",
    CUSTOM1: "cusom-1",
    CUSTOM2: "cusom-2",
    CUSTOM3: "cusom-3",
    CUSTOM4: "cusom-4",
    CUSTOM5: "cusom-5",
});


const AccessFileManagerType = general.toEnum({
    IMAGE: "image",
    VIDEO: "video",
    AUDIO: "audio",
    LINK: "link",
});


export default class core {

    constructor(elem, defaults) {

        // fot test 
        // const aaaaaaaaa = 1

        this.elem = elem;
        this.defaults = defaults;
        this.data = [];
        this.id = "";

        let thisClass = this;


        new FileManager({
            ajax: this.defaults.ajax
        });

        // document.addEventListener('fm.folder.item.select', function (e) {
            // console.log(e.detail);
        // })

        // document.addEventListener('fm.file.item.select', function (e) {
        //     // e.target matches elem
        //     console.info(e.detail);
        // }, false);

        var c = document.createElement('div')
        c.innerHTML = modalURL({});
        document.body.appendChild(c);


        $('#urlModal').on('show.bs.modal', function (event) {
            var $button = $(event.relatedTarget);
            var modal = $(this)

            const link = new linkManaager(modal);
            link.init($button, thisClass);
        });

        $('#urlModal').on('hidden.bs.modal', function () {
            var modal = $(this)
            modal.find('.modal-body input').val("");
        });

        return this;
    }


    watch = (event) => {
        // console.log("event", event);
        // console.log("detail", event.detail);
    }


    createSection = (lastSection, value) => {
        let thisClass = this;

        const id = this.id = general.uuid();


        let thisObject = {
            id: id,
            contentRow: ContentType.TEXT,
            field1: "",
            field2: "",
            field3: "",
            field4: "",
            field5: ""
        }


        if (value) {

            thisObject = {
                id: id,
                contentRow: value.contentRow,
                field1: value.field1,
                field2: value.field2,
                field3: value.field3,
                field4: value.field4,
                field5: value.field5
            }
        }

        this.data.push(thisObject);


        // start item wrapper
        let section = document.createElement('div');
        section.classList.add('cm-section');
        section.id = "cm-section-" + id;

        let contenteditableDiv = document.createElement('div');

        // let date = new Date()
        // contenteditableDiv.innerHTML = "for test => " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

        contenteditableDiv.setAttribute("contenteditable", "true");
        contenteditableDiv.setAttribute("placeholder", this.defaults.placeholder || "write here...");
        contenteditableDiv.classList.add("cm-content");
        contenteditableDiv.id = "cm-content-" + id;

        contenteditableDiv.innerHTML = thisObject.field1

        section.appendChild(contenteditableDiv);

        /************************ start event listener ************************/

        // handler remove section
        contenteditableDiv.addEventListener("keyup", (event) => { // can 'keypress'
            thisClass.updateContentRow(contenteditableDiv, ContentType.TEXT)

            let keycode = (event.charCode ? event.charCode : event.which);
            if (keycode === 8) {
                let inn = contenteditableDiv.innerText.trim();
                if (inn === "" || !inn.length || inn === "\r\n" || inn === "\n") {
                    // remove section
                    event.preventDefault();
                    if (this.elem.querySelectorAll('.cm-section').length > 1) {
                        thisClass.removeDataItem(contenteditableDiv);
                        this.elem.removeChild(section);
                        let lastElement = this.elem.lastElementChild.querySelector('.cm-content')
                        general.setEndOfContenteditable(lastElement);
                    }
                }
            }
        });

        // handler new line/section 
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

        // handler show/hide button control
        contenteditableDiv.addEventListener("input", function (event) {
            const regex = /cm-section-((\w*\W*)*)/g;
            let id = contenteditableDiv.parentNode.id;
            if (id.match(regex)) {
                id = id.replace(regex, "$1");
            }
            let buttonControl = document.querySelector("#cm-btn-control-" + id);
            if (!this.innerText.trim().length) {
                buttonControl.classList.remove("hidden");

            } else {
                buttonControl.classList.add("hidden");
            }

            thisClass.updateContentText(contenteditableDiv);
        });

        // handler insert media
        contenteditableDiv.addEventListener("cm.inset.media", function (event) {
            const regex = /cm-section-((\w*\W*)*)/g;
            let id = contenteditableDiv.parentNode.id;
            if (id.match(regex)) {
                id = id.replace(regex, "$1");
            }
            let buttonControl = document.querySelector("#cm-btn-control-" + id);
            if (!this.innerText.trim().length) {
                buttonControl.classList.remove("hidden");

            } else {
                buttonControl.classList.add("hidden");
            }

            thisClass.updateContentObject(contenteditableDiv, event.detail.contentRow);
        });

        /************************ end event listener ************************/


        // assign type management buttons to contenteditable
        let btnControlDiv = document.createElement('div');
        btnControlDiv.classList.add("cm-btn-control");
        btnControlDiv.id = "cm-btn-control-" + id;
        btnControlDiv.innerHTML = createSection({
            id: id
        });

        section.appendChild(btnControlDiv);


        // select button create
        // let btnCreate = btnControlDiv.querySelector("[data-trget='toggleList']");

        // select buttons type management wrapper
        let createList = btnControlDiv.querySelector(".create-section-list");

        // select add item buttons
        let btnsAdd = btnControlDiv.querySelectorAll("[data-action='add']");

        // handle type management button click
        btnsAdd.forEach((btnAdd) => {
            btnAdd.addEventListener("click", (event) => {
                let type = event.currentTarget.dataset["type"];
                // if (general.isExistInEnum(AccessFileManagerType, type)) {}
                thisClass.updateContentRow(contenteditableDiv, type);
            })
        });

        // append new section to end of content manager

        if (!lastSection) {
            this.elem.appendChild(section);
        } else {
            general.insertAfter(section, lastSection);
        }



        var elements = document.querySelectorAll('.cm-content'),
            editor = new mediumEditor(elements, {
                disableReturn: true,
                disableDoubleReturn: true,
                disableExtraSpaces: true,
                placeholder: false,
                toolbar: {
                    buttons: ['bold', 'italic', 'underline', 'h2', 'h3', 'quote'],
                }
                // anchor: {
                // linkValidation: false,
                // placeholderText: 'آدرس لینک خود را تایپ کنید',
                // targetCheckbox: false,
                // targetCheckboxText: 'باز شدن در پنجره جدید'
                // }
            });
        contenteditableDiv.focus();

        return contenteditableDiv;
    }


    updateContentRow = (elem, type) => {
        const regex = /cm-section-((\w*\W*)*)/g;
        let id = elem.parentNode.id;
        if (id.match(regex)) {
            id = id.replace(regex, "$1");
        }
        const isExist = general.isExistInEnum(ContentType, type);
        if (isExist) {
            map(this.data, function (item) {
                if (item.id === id)
                    item.contentRow = type;
                return item;
            });
        }
    }


    updateContentText = (elem) => {
        const regex = /cm-section-((\w*\W*)*)/g;
        let id = elem.parentNode.id;
        if (id.match(regex)) {
            id = id.replace(regex, "$1");
        }
        const contentHtml = elem.innerHTML;
        const contentText = elem.innerText;
        map(this.data, function (item) {
            if (item.id === id) {
                item.field1 = contentHtml;
                item.field2 = contentHtml;
            }

            return item;
        })
    }


    updateContentObject = (elem, type) => {
        const regex = /cm-section-((\w*\W*)*)/g;
        let id = elem.parentNode.id;
        if (id.match(regex)) {
            id = id.replace(regex, "$1");
        }

        const content = elem.innerHTML;
        map(this.data, function (item) {
            if (item.id === id) {
                item.field2 = content;
                if (AccessFileManagerType.IMAGE === type) {
                    item.field1 = imageTemplate({
                        url: content
                    });
                } else if (AccessFileManagerType.VIDEO === type) {
                    item.field1 = videoTemplate({
                        url: content
                    });
                } else if (AccessFileManagerType.AUDIO === type) {
                    item.field1 = soundTemplate({
                        url: content
                    });
                } else if (AccessFileManagerType.LINK === type) {
                    item.field1 = linkTemplate({
                        url: content
                    });
                }


                elem.innerHTML = item.field1;
            }
            return item;
        })
    }


    removeDataItem = (elem) => {
        const regex = /cm-section-((\w*\W*)*)/g;
        let id = elem.parentNode.id;
        if (id.match(regex)) {
            id = id.replace(regex, "$1");
        }
        this.data = remove(this.data, (item) => {
            if (item.id !== id) {
                return item;
            }
        })
    }

    init = () => {

        document.addEventListener("click", (event) => {
            if (event.target.dataset.action !== 'undefined' && event.target.dataset.action === 'toggleList') {

                let target = document.querySelector(event.target.dataset.target);
                target.classList.toggle('show');

                if (event.target.classList.contains("btn-create-text")) {
                    event.target.parentNode.classList.toggle('close')
                } else {
                    event.target.classList.toggle('close');
                }

            } else {
                let allSectionButtonCreate = document.querySelectorAll("button[data-action='toggleList']");
                allSectionButtonCreate.forEach((buttonCreate) => {
                    buttonCreate.classList.remove('close');
                });
                let allSectionButtonList = document.querySelectorAll('.create-section-list');
                allSectionButtonList.forEach((buttonList) => {
                    buttonList.classList.remove('show');
                });
            }
        });

        this.createSection();
    }

    setData = (dataInput = []) => {
        let thisClass = this;

        // clear form
        const sections = document.querySelectorAll('.cm-section');
        sections.forEach((item) => {
            item.remove();
        });
        // clear data
        this.data = [];

        let isFirst = true;
        let lastElement = null;
        dataInput.forEach((item) => {
            if (item.contentRow === ContentType.TEXT) {

                lastElement = thisClass.createSection(isFirst ? false : lastElement.parentNode, item);
                if (isFirst) isFirst = false;
                general.triggerEvent(lastElement, 'input');

            } else {

                const regex = /^<(\w|\W)+(src|href)+=(\\"|")(([^\\"]|\\")*)(\\"|")(\w|\W)+/g;
                item = transform(item, (result, value, key) => {
                    if (key === "field1") {
                        if (item.field1.match(regex)) {
                            value = value.replace(regex, "$4");
                            result[key] = value;
                        }
                    } else {
                        result[key] = value;
                    }
                }, {});

                lastElement = thisClass.createSection(isFirst ? false : lastElement.parentNode, item);
                if (isFirst) isFirst = false;
                var event = new CustomEvent('cm.inset.media', {
                    detail: {
                        contentRow: item.contentRow
                    }
                });
                lastElement.dispatchEvent(event);
            }
        });
    }

    getData = () => this.data;
}