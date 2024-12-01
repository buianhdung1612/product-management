// alert-message
const alertMessage = document.querySelector("[alert-message]");
if(alertMessage){
    setTimeout(() => {
        alertMessage.style.display = "none";
    }, 3000)
}
// Hết alert-message

// table-cart
const tableCart = document.querySelector("[table-cart]");
if(tableCart){
    const listInputQuantity = tableCart.querySelectorAll("input[name='quantity']");
    listInputQuantity.forEach(input => {
        input.addEventListener("change", () => {
            const path = input.getAttribute("data-path");
            const productId = input.getAttribute("item-id");
            const quantity = input.value;

            fetch(path, {
                method: "PATCH",
                headers: {
                    "content-Type": "application/json"
                },
                body: JSON.stringify({
                    productId: productId,
                    quantity: quantity
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
// Hết table-cart