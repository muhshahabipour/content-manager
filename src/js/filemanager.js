export default class fileManager {
    modal = null;

    constructor(modal = null) {
        console.log(modal)

        this.modal = modal;

        var fileItems = document.querySelectorAll("item-fm-file");
        fileItems.forEach((item) => {
            item.addEventListener('click', (event) => {
                console.log("event", event)
                console.log("this", this)
                console.log("dataset", this.dataset)
                // alert(event)
            })
        })
    }

    init = () => {

    }

}