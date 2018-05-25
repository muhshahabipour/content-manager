export default class fileManager {
    modal = null;

    constructor(modal = null) {
        this.modal = modal;
    }

    init = (button, coreClass) => {
        var fileItems = document.querySelectorAll(".item-fm-file");
        let $modal = this.modal;
        fileItems.forEach((item) => {
            item.addEventListener('click', (event) => {
                // console.log("address", event.target.dataset.address);
                // console.log("sectionId", button.data("sectionId"));
                if (!button.data("isExtra")) {
                    $('#cm-content-' + button.data("sectionId")).html(event.target.dataset.address);
                    coreClass.updateContentObject(document.getElementById('cm-content-' + button.data("sectionId")), button.data("type"));
                    let buttonCtrl = document.querySelector('#cm-btn-control-' + button.data("sectionId"));
                    buttonCtrl.classList.add("hidden");
                } else {
                    var customEvent = new CustomEvent("file.item.select", {
                        dataset: event.target.dataset
                    });
                    document.dispatchEvent(customEvent);
                }
                $modal.modal("hide");
            })
        })
    }

}