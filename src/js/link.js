import general from './general-functions'


const urlRegExp = new RegExp("^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$");

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

            // TODO: test "dsafsgg" not okey
            if (link.value && (link.value).match(urlRegExp)) {
                document.querySelector('#cm-content-' + button.data("sectionId")).innerHTML = link.value;
                coreClass.updateContentObject(document.getElementById('cm-content-' + button.data("sectionId")), button.data("type"));

                coreClass.createSection(document.querySelector("#cm-section-" + button.data("sectionId")));

                general.setEndOfContenteditable(document.querySelector(".cm-wrapper").lastElementChild.querySelector('.cm-content'));


                let buttonCtrl = document.querySelector('#btn-create-' + button.data("sectionId"));
                let buttonDel = document.querySelector('#btn-delete-' + button.data("sectionId"));
                buttonCtrl.classList.add("hidden");
                buttonDel.classList.remove("hidden");
                $modal.modal("hide");
            } else {
                if (!link.value) {
                    console.warn("link not fill");
                } else {
                    console.warn("pattern not match");
                }
            }
        });

    }
}