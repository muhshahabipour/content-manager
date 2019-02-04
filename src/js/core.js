import general from './general-functions'
import FileManager from 'vaslapp-file-manager'
import linkManaager from './link'
import mapManaager from './map'
import mediumEditor from 'medium-editor'
import map from 'lodash/map'
import extend from 'lodash/extend'
import remove from 'lodash/remove'
import findIndex from 'lodash/findIndex'
import transform from 'lodash/transform'

var createSectionTmp = require("./templates/create-section.handlebars");
var deleteSectionTmp = require("./templates/delete-section.handlebars");
var modalURL = require("./templates/modal-url.handlebars");
var modalMAP = require("./templates/modal-map.handlebars");

var imageTemplate = require("./templates/image-template.handlebars");
var videoTemplate = require("./templates/video-template.handlebars");
var soundTemplate = require("./templates/sound-template.handlebars");
var linkTemplate = require("./templates/link-template.handlebars");
var mapTemplate = require("./templates/map-template.handlebars");



const ContentType = general.toEnum({
    TEXT: "text",
    IMAGE: "image",
    VIDEO: "video",
    AUDIO: "audio",
    LINK: "link",
    MAP: "map",
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
    MAP: "map",
});

let self = null;

export default class core {

    constructor(elem, defaults) {

        // fot test 
        const aaaaaaaaa = 2

        this.elem = elem;
        this.defaults = defaults;
        this.data = [];
        this.id = "";
        this.lastCursorPosition = 0;

        self = this;

        new FileManager({
            target: self.defaults.target,
            modalId: 'contentFileManagerModal',
            customNameForEventFileSelect: 'cfm.file.item.select',
            ajax: self.defaults.ajax
        });

        let selector = document.querySelector(self.defaults.target);
        selector.addEventListener('cfm.file.item.select', function (event) {
            event.preventDefault();
            // console.info(event.detail);
            // console.info(event.relatedTarget);
            const button = $(event.relatedTarget);
            $('#cm-content-' + button.data("sectionId")).html(event.detail.address);
            self.updateContentObject(document.getElementById('cm-content-' + button.data("sectionId")), button.data("type"));
            let buttonCtrl = document.querySelector('#btn-create-' + button.data("sectionId"));
            let buttonDel = document.querySelector('#btn-delete-' + button.data("sectionId"));
            buttonCtrl.classList.add("hidden");
            buttonDel.classList.remove("hidden");
            self.createSection(document.querySelector('#cm-section-' + button.data("sectionId")));

        }, false);

        var c = document.createElement('div')
        c.innerHTML = modalURL({});
        document.body.appendChild(c);

        var m = document.createElement('div')
        m.innerHTML = modalMAP({});
        document.body.appendChild(m);

        $('#urlModal').on('shown.bs.modal', function (event) {
            var $button = $(event.relatedTarget);
            var modal = $(this)

            const link = new linkManaager(modal);
            link.init($button, self);
        });

        $('#urlModal').on('hidden.bs.modal', function () {
            var modal = $(this)
            modal.find('.modal-body input').val("");
        });

        const location = new mapManaager($('#mapModal'), self);

        $('#mapModal').on('shown.bs.modal', function (event) {
            var modal = $(this)
            var $button = $(event.relatedTarget);
            var latLng = null;

            if (event.relatedTarget.hasAttribute('data-latlng')) {
                latLng = $(event.relatedTarget).data('latlng');
                var sectionId = $button.data('sectionId');
                modal.find("#map-submit").data('sectionId', sectionId)
                modal.find("#map-submit").data('type', $button.data('type'))
                modal.find("#map-submit").data('latlng', latLng)
                location.initMap(latLng);
            } else {

                var sectionId = $button.data('sectionId');
                modal.find("#map-submit").data('sectionId', sectionId)
                modal.find("#map-submit").data('type', $button.data('type'))
                location.initMap(latLng);
            }
        });

        $('#mapModal').on('hidden.bs.modal', function () {
            var modal = $(this)
            location.removeMap();
            modal.find('.modal-body input').val("");
            modal.find("#map-submit").data('latlng','')
        });

        return this;
    }


    watch = (event) => {
        // console.log("event", event);
        // console.log("detail", event.detail);
    }


    createSection = (lastSection = null, value = null) => {

        const id = self.id = general.uuid();


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

        if (lastSection) {
            try {
                const regex = /cm-section-((\w*\W*)*)/g;
                let lastSectionId = lastSection.id;

                if (lastSectionId.match(regex)) {
                    lastSectionId = lastSectionId.replace(regex, "$1");
                }

                let index = findIndex((self.data), (k) => {
                    return k.id === lastSectionId;
                });

                if (index > -1) {
                    if ((index + 1) === ((self.data).length)) {
                        self.data.push(thisObject);
                    } else {
                        self.data = general.insertBetween((index + 1), thisObject, self.data);
                    }
                } else {

                    e.log("not found index");
                    self.data.push(thisObject);
                }
            } catch (error) {
                self.data.push(thisObject);
                console.log(error);
            }
        } else {
            self.data.push(thisObject);
        }

        // start item wrapper
        let section = document.createElement('div');
        section.classList.add('cm-section');
        section.id = "cm-section-" + id;

        let contenteditableDiv = document.createElement('div');

        // let date = new Date()
        // contenteditableDiv.innerHTML = "for test => " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

        contenteditableDiv.setAttribute("contenteditable", "true");
        contenteditableDiv.setAttribute("placeholder", self.defaults.placeholder || "write here...");
        contenteditableDiv.classList.add("cm-content");
        contenteditableDiv.id = "cm-content-" + id;

        contenteditableDiv.innerHTML = thisObject.field1

        section.appendChild(contenteditableDiv);

        /************************ start event listener ************************/

        let allButtonDelete = document.querySelectorAll("button[data-action='removeList']");

        (allButtonDelete).forEach((item) => {

            item.addEventListener("click", (event) => {

                const regex = /btn-delete-((\w*\W*)*)/g;
                let id = event.currentTarget.id;

                if (id.match(regex)) {
                    id = id.replace(regex, "$1");
                }

                let section = document.querySelector('#cm-section-' + id);
                let contenteditableDiv = document.querySelector('#cm-content-' + id);

                if (self.elem.querySelectorAll('.cm-section').length > 0 && (self.data).findIndex((obj) => { return obj.id == id }) > -1) {
                    if (section.previousSibling === null) {
                        // console.log('naw add');
                        //  section = document.createElement('div');
                        event.preventDefault();
                        self.createSection(section);
                    }
                    self.removeDataItem(contenteditableDiv);
                    general.setEndOfContenteditable(section.querySelector('.cm-content'));
                    self.elem.removeChild(section);

                }
            })
        })

        // handler remove section
        contenteditableDiv.addEventListener("keyup", (event) => { // can 'keypress'

            event = event || window.event;
            let keycode = (event.charCode ? event.charCode : event.which);

            const regex = /cm-section-((\w*\W*)*)/g;
            let id = contenteditableDiv.parentNode.id;
            if (id.match(regex)) {
                id = id.replace(regex, "$1");
            }

            let contentRow = "";
            (self.data).forEach((item) => {
                if (item.id == id)
                    contentRow = item.contentRow;
            });

            if (contentRow !== ContentType.TEXT && (keycode !== 8 /* Backspase */ && keycode !== 46 /* Delete */)) {
                event.preventDefault();

                return false;
            }

            self.updateContentRow(contenteditableDiv, ContentType.TEXT)


            if (keycode === 8 || keycode === 46) {
                let inn = contenteditableDiv.innerText.trim();


                if (inn === "" || !inn.length || inn === "\r\n" || inn === "\n") {
                    // remove section
                    event.preventDefault();

                    if (self.elem.querySelectorAll('.cm-section').length > 1 && (self.data).findIndex((item) => { return item.id == id }) > -1) {
                        self.removeDataItem(contenteditableDiv);
                        general.setEndOfContenteditable(section.querySelector('.cm-content'));
                        self.elem.removeChild(section);
                    }
                }
            }
        });




        // handler new line/section 
        contenteditableDiv.addEventListener("keydown", (event) => {
            event = event || window.event;
            let keycode = (event.charCode ? event.charCode : event.which);

            const regex = /cm-section-((\w*\W*)*)/g;
            let id = contenteditableDiv.parentNode.id;


            if (id.match(regex)) {
                id = id.replace(regex, "$1");
            }

            let contentRow = "";
            (self.data).forEach((item) => {
                if (item.id == id)
                    contentRow = item.contentRow;
            });

            if (contentRow !== ContentType.TEXT && (keycode !== 13 /* Enter */)) {
                event.preventDefault();
                contenteditableDiv.setAttribute("contenteditable", "false") //test
                return false;
            }

            if (keycode === 13 && (event.ctrlKey || event.metaKey)) {

                // new line
                event.preventDefault();
                document.execCommand("insertparagraph", false, contenteditableDiv.id)
                // general.setEndOfContenteditable(contenteditableDiv);

            } else if (keycode === 13) {

                // new section
                event.preventDefault();
                self.createSection(section);
            }
        });

        // handler show/hide button control
        contenteditableDiv.addEventListener("input", function (event) {
            const regex = /cm-section-((\w*\W*)*)/g;
            let id = contenteditableDiv.parentNode.id;
            if (id.match(regex)) {
                id = id.replace(regex, "$1");
            }

            // let buttonControl = document.querySelector("#cm-btn-control-" + id);
            let buttonControl = document.querySelector("#btn-create-" + id);
            let buttonDelete = document.querySelector("#btn-delete-" + id);
            if (!this.innerText.trim().length) {
                buttonControl.classList.remove("hidden");
                buttonDelete.classList.add("hidden");

            } else {
                buttonControl.classList.add("hidden");
                buttonDelete.classList.remove("hidden");

            }

            self.updateContentText(contenteditableDiv);
        });

        // handler insert media
        contenteditableDiv.addEventListener("cm.inset.media", function (event) {
            const regex = /cm-section-((\w*\W*)*)/g;
            let id = contenteditableDiv.parentNode.id;
            if (id.match(regex)) {
                id = id.replace(regex, "$1");
            }
            let buttonControl = document.querySelector("#btn-create-" + id);
            let buttonDelete = document.querySelector("#btn-delete-" + id);
            if (!this.innerText.trim().length) {
                buttonControl.classList.remove("hidden");
                buttonDelete.classList.add("hidden");

            } else {
                buttonDelete.classList.remove("hidden");
                buttonControl.classList.add("hidden");

            }

            self.updateContentObject(contenteditableDiv, event.detail.contentRow);
        });

        /************************ end event listener ************************/


        // assign type management buttons to contenteditable
        let btnControlDiv = document.createElement('div');
        btnControlDiv.classList.add("cm-btn-control");
        btnControlDiv.id = "cm-btn-control-" + id;
        btnControlDiv.innerHTML = createSectionTmp({
            id: id
        });

        // section.appendChild(btnControlDiv); 

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
                self.updateContentRow(contenteditableDiv, type);
            })
        });

        // append new section to end of content manager

        if (!lastSection) {
            self.elem.appendChild(section);
        } else {
            general.insertAfter(section, lastSection);
        }



        var elements = document.querySelectorAll('.cm-content'),
            editor = new mediumEditor(elements, {
                disableReturn: true,
                disableDoubleReturn: true,
                disableExtraSpaces: true,
                placeholder: false,
                anchorPreview: false,
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
            map(self.data, function (item) {
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
        map(self.data, function (item) {
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
        map(self.data, function (item) {
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
                } else if (AccessFileManagerType.MAP === type) {
                    item.field1 = mapTemplate({
                        url: content,
                        id: id
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
        debugger;
        self.data = remove(self.data, (item) => {
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
        self.createSection();
    }

    setData = (dataInput = []) => {
        let self = this;

        // clear form
        const sections = document.querySelectorAll('.cm-section');
        sections.forEach((item) => {
            item.remove();
        });
        // clear data
        self.data = [];

        let isFirst = true;
        let lastElement = null;
        dataInput.forEach((item) => {
            let thisObject = {
                id: "",
                contentRow: ContentType.TEXT,
                field1: "",
                field2: "",
                field3: "",
                field4: "",
                field5: ""
            }

            item = extend(thisObject, item)

            if (item.contentRow === ContentType.TEXT) {

                lastElement = self.createSection(isFirst ? undefined : lastElement.parentNode, item);
                if (isFirst) isFirst = false;
                general.triggerEvent(lastElement, 'input');

            } else {
                // const regex = /^<(\w|\W)+(src|href)+=(\\"|")(([^\\"]|\\")*)(\\"|")(\w|\W)+/g;
                const regex = /^["\s|\s|"]*<(\w|\W)+(src|href)+=(\\"|")(([^\\"]|\\")*)(\\"|")(\w|\W)+/g;
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

                lastElement = self.createSection(isFirst ? undefined : lastElement.parentNode, item);
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

    getData = () => self.data;
}