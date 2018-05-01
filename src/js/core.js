import general from './general-functions'
import fileManager from './filemanager'
import mediumEditor from 'medium-editor'
import map from 'lodash/map'
import extend from 'lodash/extend'

var createSection = require("./templates/create-section.handlebars");
var fileManagerModal = require("./templates/filemanager.handlebars");
var fileManagerItemFile = require("./templates/item-file.handlebars");
var fileManagerItemFolder = require("./templates/item-folder.handlebars");





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
});


export default class core {

    constructor(elem, defaults) {


        this.elem = elem;
        this.defaults = defaults;
        this.data = [];

        var b = document.createElement('div')
        b.innerHTML = fileManagerModal({});
        document.body.appendChild(b);


        $('#fileManagerModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);

            var modal = $(this)

            // TODO: GET File/Folder List
            $.ajax({
                    url: defaults.ajax.url,
                    method: defaults.ajax.method,

                    data: extend({
                        nextPagekey: '',
                        path: '/'
                    }, defaults.ajax.data),
                    headers: defaults.ajax.headers
                })
                .then(function (response) {
                    console.info(response);
                    if (response.status === 1) {
                        
                        response.directoryInfo.data.forEach((item) => {
                            if (item.isDirectory) {
                                modal.find('.modal-body .fm-wrapper').append(fileManagerItemFolder({name: item.name}));
                            } else {
                                modal.find('.modal-body .fm-wrapper').append(fileManagerItemFile({name: item.name, path: item.linkHost + item.linkPath}));
                            }

                        });
                    }

                })
                .catch(function (error) {
                    console.error(error);
                });

            const filemanager = new fileManager(modal);
            // fileManager.init();

        })


        $('#fileManagerModal').on('hide.bs.modal', function (event) {
            var modal = $(this)
            modal.find('.modal-body .fm-wrapper').html("");
        })


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
            contentRow: ContentType.TEXT,
            field1: "",
            field2: "",
            field3: "",
            field4: "",
            field5: "",
        }

        this.data.push(thisObject);


        // start item wrapper
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

        /************************ start event listener ************************/

        // handler remove section
        contenteditableDiv.addEventListener("keyup", (event) => { // can 'keypress'
            thisClass.updateContentRow(contenteditableDiv, ContentType.TEXT)

            let keycode = (event.charCode ? event.charCode : event.which);
            if (keycode === 8) {
                let inn = contenteditableDiv.innerText.trim();
                console.info(contenteditableDiv.innerHTML)
                console.info(contenteditableDiv.innerText)
                if (inn === "" || !inn.length || inn === "\r\n" || inn === "\n") {
                    // remove section
                    event.preventDefault();
                    if (this.elem.querySelectorAll('.cm-section').length > 1) {
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
            let buttonControl = document.querySelector("#cm-btn-control-" + contenteditableDiv.parentNode.id);
            if (!this.innerText.trim().length) {
                buttonControl.classList.remove("hidden");

            } else {
                buttonControl.classList.add("hidden");
            }

            thisClass.updateContentText(contenteditableDiv);
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
                if (general.isExistInEnum(AccessFileManagerType, type)) {
                    $('#fileManagerModal').modal('show');
                }
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
                anchor: {
                    linkValidation: false,
                    placeholderText: 'آدرس لینک خود را تایپ کنید',
                    targetCheckbox: false,
                    targetCheckboxText: 'باز شدن در پنجره جدید'
                }
            });
        contenteditableDiv.focus();


    }


    updateContentRow = (elem, type) => {
        const id = elem.parentNode.id;
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
        const id = elem.parentNode.id;
        const content = elem.innerHTML;

        map(this.data, function (item) {
            if (item.id === id)
                item.field1 = content;

            return item;
        })
    }


    init = () => {


        document.addEventListener("click", (event) => {
            // console.log(event.target.parentNode.parentNode.length);
            if (event.target.classList.contains('btn-create')) {

                event.target.parentNode.querySelector('.create-section-list').classList.toggle('show');
                event.target.classList.toggle('close');

                // } else if (event.target.parentNode.parentNode.classList.contains("create-section-list")) {
                // console.log("Asshole");
            } else {
                let allSectionButtonCreate = document.querySelectorAll("[data-trget='toggleList']")
                allSectionButtonCreate.forEach((buttonCreate) => {
                    buttonCreate.classList.remove('close');
                });
                let allSectionButtonList = document.querySelectorAll('.create-section-list')
                allSectionButtonList.forEach((buttonList) => {
                    buttonList.classList.remove('show');
                });
            }
        });




        this.createSection();
    }


    getData = () => this.data;

}