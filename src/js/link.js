export default class link {
    modal = null;

    constructor(modal = null) {
        this.modal = modal;
    }

    init = (button, coreClass) => {
        let $modal = this.modal;
        const submit = document.querySelector("#link-submit");

        submit.addEventListener('click', (event) => {
            const link = document.querySelector("#link");
            console.log("link.value", link.value)
            document.querySelector('#cm-content-' + button.data("sectionId")).innerHTML = link.value;
            coreClass.updateContentObject(document.getElementById('cm-content-' + button.data("sectionId")), button.data("type"));
            $modal.modal("hide");
        });

    }
}