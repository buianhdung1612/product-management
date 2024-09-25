// Bộ lọc
const boxFilter = document.querySelector("[box-filter]");
if (boxFilter) {
    let url = new URL(location.href);

    // Bắt sự kiện onChange
    boxFilter.addEventListener("change", () => {
        const value = boxFilter.value;

        if (value) {
            url.searchParams.set("status", value);
        }
        else {
            url.searchParams.delete("status");
        }

        location.href = url.href;
    });

    // Hiển thị lựa chọn mặc định
    const statusCurrent = url.searchParams.get("status");
    if (statusCurrent) {
        boxFilter.value = statusCurrent;
    }
}
// Hết bộ lọc

// Tìm kiếm
const formSearch = document.querySelector("[form-search]");
if (formSearch) {
    let url = new URL(location.href);

    formSearch.addEventListener("submit", (event) => {
        event.preventDefault();
        const value = formSearch.keyword.value;

        if (value) {
            url.searchParams.set("keyword", value);
        }
        else {
            url.searchParams.delete("keyword");
        }

        location.href = url.href
    });

    // Hiển thị từ khóa mặc định
    const valueCurrent = url.searchParams.get("keyword");
    if (valueCurrent) {
        formSearch.keyword.value = valueCurrent;
    }
}
// Hết tìm kiếm

// Phân trang
const listButtonPagination = document.querySelectorAll("[button-pagination]");
if (listButtonPagination.length > 0) {
    let url = new URL(location.href);

    listButtonPagination.forEach((button) => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");
            if (page) {
                url.searchParams.set("page", page);
            }
            else {
                url.searchParams.delete("page");
            }
            location.href = url.href;
        })
    })

    // Hiển thị trang mặc định
    const pageCurrent = url.searchParams.get("page") || 1;
    const buttonCurrent = document.querySelector(`[button-pagination="${pageCurrent}"]`);
    if (buttonCurrent) {
        buttonCurrent.parentNode.classList.add("active");
    }
}
// Hết phân trang

// Đổi trạng thái 1 sản phẩm
const listButtonChangeStatus = document.querySelectorAll("[button-change-status]");
if (listButtonChangeStatus.length > 0) {
    listButtonChangeStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const itemId = button.getAttribute("item-id");
            const statusChange = button.getAttribute("button-change-status");
            const path = button.getAttribute("data-path");

            const data = {
                id: itemId,
                status: statusChange
            }

            fetch(path, {
                method: "PATCH",
                headers: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "success") {
                        location.reload();
                    }
                })
        })
    })
}
// Hết đổi trạng thái 1 sản phẩm

// Đổi trạng thái cho nhiều bản ghi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (event) => {
        event.preventDefault();

        const path = formChangeMulti.getAttribute("data-path");
        const status = formChangeMulti.status.value;

        if (status == "delete") {
            const isConfirm = confirm("Bạn có chắc muốn xóa những bản ghi này?");
            if (!isConfirm) {
                return;
            }
        }

        const listInputChangeChecked = document.querySelectorAll("[input-change]:checked");
        const ids = [];
        listInputChangeChecked.forEach((input) => {
            const id = input.getAttribute("input-change");
            ids.push(id);
        })

        const data = {
            ids: ids,
            status: status
        }

        fetch(path, {
            method: "PATCH",
            headers: {
                "content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                if (data.code == "success") {
                    location.reload();
                }
            })

    })

}
// Hết đổi trạng thái cho nhiều bản ghi

// Xóa bản ghi
const listButtonDelete = document.querySelectorAll("[button-delete]");
if (listButtonDelete.length > 0) {
    listButtonDelete.forEach((button) => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn xóa bản ghi này?");

            if (isConfirm) {
                const id = button.getAttribute("item-id");
                const path = button.getAttribute("data-path");

                fetch(path, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    method: "PATCH",
                    body: JSON.stringify({
                        id: id
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.code == "success") {
                            location.reload();
                        }
                    })
            }
        })
    })
}
// Hết xóa bản ghi

// Thùng rác
// 1. Khôi phục
const listButtonRestore = document.querySelectorAll("[button-restore]");
if (listButtonRestore.length > 0) {
    listButtonRestore.forEach((button) => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn khôi phục không?");
            if (isConfirm) {
                const id = button.getAttribute("item-id");
                const path = button.getAttribute("data-path");

                fetch(path, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: "PATCH",
                    body: JSON.stringify({
                        id: id
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.code == "success") {
                            location.reload();
                        }
                    })
            }
        })
    })
}

// 2. Xóa vĩnh viễn
const listButtonDeleteDestroy = document.querySelectorAll("[button-delete-destroy]");
if (listButtonDeleteDestroy.length > 0) {
    listButtonDeleteDestroy.forEach((button) => {
        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn xóa vĩnh viễn?");
            if (isConfirm) {
                const id = button.getAttribute("item-id");
                const path = button.getAttribute("data-path");

                fetch(path, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: "DELETE",
                    body: JSON.stringify({
                        id: id
                    })
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.code == "success") {
                            location.reload();
                        }
                    })
            }

        })
    })
}
// Hết thùng rác

// Đổi vị trí
const listInputPosition = document.querySelectorAll("[input-position]");
if (listInputPosition.length > 0) {
    listInputPosition.forEach((input) => {
        input.addEventListener("change", () => {
            const position = parseInt(input.value);
            const id = input.getAttribute("item-id");
            const path = input.getAttribute("data-path");

            fetch(path, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "PATCH",
                body: JSON.stringify({
                    id: id,
                    position: position
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == "success") {
                        location.reload();
                    }
                })
        })
    })
}
// Hết đổi vị trí

// alert-message
const alertMessage = document.querySelector("[alert-message]");
if(alertMessage){
    setTimeout(() => {
        alertMessage.style.display = "none";
    }, 3000)
}
// Hết alert-message

// Preview ảnh
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage){
    const uploadImageInput = document.querySelector("[upload-image-input]");
    const uploadImagePreview = document.querySelector("[upload-image-preview]");
    const uploadImageDelete = document.querySelector("[upload-image-delete]");

    uploadImageInput.addEventListener("change", () => {
        const file = uploadImageInput.files[0];
        if(file){
            uploadImagePreview.src = URL.createObjectURL(file);
            uploadImageDelete.style.display = "inline";
        }
    })

    uploadImageDelete.addEventListener("click", () => {
        uploadImageInput.value = "";
        uploadImagePreview.src = "";
        uploadImageDelete.style.display = "none";
    })
}
// Hết preview ảnh