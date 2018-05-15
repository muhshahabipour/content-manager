

export default class fileManager {
    modal = null;

    constructor(modal = null) {
        this.modal = modal;
    }

    init = (button, coreClass) => {
        var fileItems = document.querySelectorAll(".item-fm-file");
        let $modal = this.modal;
        console.log("H01")
        console.log("H02", coreClass)
        fileItems.forEach((item) => {
            item.addEventListener('click', (event) => {
                
                // console.log("address", event.target.dataset.address);
                // console.log("sectionId", button.data("sectionId"));
                console.log("H03", coreClass)
                $('#cm-content-' + button.data("sectionId")).html(event.target.dataset.address);
                coreClass.updateContentText(document.getElementById('#cm-content-' + button.data("sectionId")));
                console.log("H04", coreClass)
                $modal.modal("hide");
            })
        })
    }

}