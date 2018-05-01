export default class fileManager {
    modal = null;

    constructor(modal = null) {
        this.modal = modal;
    }

    init = () => {
        var fileItems = document.querySelectorAll(".item-fm-file");
        fileItems.forEach((item) => {
            item.addEventListener('click', (event) => {
                console.log("isDirectory", event.target.dataset.isDirectory)
                console.log("address", event.target.dataset.address)
                this.modal.modal("hide");
            })
        })
    }

}