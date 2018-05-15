import coreClass from "./core";

export default class fileManager {
    modal = null;

    constructor(modal = null) {
        this.modal = modal;
    }

    init = (button) => {
        var fileItems = document.querySelectorAll(".item-fm-file");
        let $modal = this.modal;
        fileItems.forEach((item) => {
            item.addEventListener('click', (event) => {
                // console.log("address", event.target.dataset.address);
                // console.log("sectionId", button.data("sectionId"));
                console.log("H03")
                $('#cm-content-' + button.data("sectionId")).html(event.target.dataset.address);
                coreClass.updateContentText(document.getElementById('cm-content-' + button.data("sectionId")));
                console.log("H04")
                $modal.modal("hide");
            })
        })
    }

}