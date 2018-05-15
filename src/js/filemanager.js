export default class fileManager {
    modal = null;

    constructor(modal = null) {
        this.modal = modal;


        $('#fileManagerModal').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);

            console.log(button.data());
            console.log("target", event.target);
            console.log("currentTarget", event.currentTarget);
            console.log("relatedTarget", event.relatedTarget);

            var modal = $(this)
            const filemanager = new fileManager(modal);

            // TODO: Optimize File/Folder List
            $.ajax({
                    url: defaults.ajax.url,
                    method: defaults.ajax.method,

                    data: extend({
                        nextPagekey: '',
                        path: '/'
                    }, defaults.ajax.data),
                    headers: defaults.ajax.headers
                })
                .then(function (response) {
                    console.info(response);
                    if (response.status === 1) {

                        response.directoryInfo.data.forEach((item) => {
                            if (item.isDirectory) {
                                // modal.find('.modal-body .fm-wrapper').append(fileManagerItemFolder({name: item.name}));
                            } else {
                                modal.find('.modal-body .fm-wrapper').append(fileManagerItemFile({
                                    name: item.name,
                                    path: item.linkHost + item.linkPath
                                }));
                            }

                        });

                        filemanager.init(button);
                    }

                })
                .catch(function (error) {
                    console.error(error);
                });

        })


        $('#fileManagerModal').on('hide.bs.modal', function (event) {
            var modal = $(this)
            modal.find('.modal-body .fm-wrapper').html("");
        })
    }

    init = (button) => {
        var fileItems = document.querySelectorAll(".item-fm-file");
        let $modal = this.modal;
        fileItems.forEach((item) => {
            item.addEventListener('click', (event) => {
                
                // console.log("isDirectory", event.target.dataset.isDirectory)
                // console.log("address", event.target.dataset.address)
                $modal.modal("hide");
            })
        })
    }

}