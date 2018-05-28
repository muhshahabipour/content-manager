import general from './general-functions'


export default class fileManager {
    modal = null;

    constructor(modal = null) {
        this.modal = modal;
    }

    init = (button, coreClass) => {
        var fileItems = document.querySelectorAll("[data-toggle='addFile']");
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
                    const dataset = event.target.dataset;

                    $(document).trigger("file.item.select", dataset);

                }

                coreClass.createSection(document.querySelector("#cm-section-" + button.data("sectionId")));

                general.setEndOfContenteditable(document.querySelector(".cm-wrapper").lastElementChild.querySelector('.cm-content'));

                $modal.modal("hide");
            })
        })


    }

}