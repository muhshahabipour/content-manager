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
                
                // console.log("isDirectory", event.target.dataset.isDirectory)
                console.log("address", event.target.dataset.address);
                console.log("sectionId", button.data("sectionId"));
                $modal.modal("hide");
            })
        })
    }

}