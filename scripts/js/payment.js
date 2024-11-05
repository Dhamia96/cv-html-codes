document.getElementById("paypal-button").addEventListener("click", function () {
    // يفتح PayPal في نافذة جديدة
    window.location.href = "https://www.paypal.com";
});

document.getElementById("visa-button").addEventListener("click", function () {
    // يظهر حقول البطاقة
    document.getElementById("card-fields").style.display = "block";
});



function showMessage(text, isSuccess) {
    const messageDiv = document.getElementById("message");
    messageDiv.innerText = text;
    messageDiv.className = isSuccess ? "success" : "error";
    messageDiv.style.display = "block";

    // إخفاء الرسالة بعد 3 ثوانٍ
    setTimeout(() => {
        messageDiv.style.display = "none";
    }, 3000);
}

function validateCardDetails(cardNumber, cvc, expiry) {
    function luhnCheck(cardNumber) {
        let sum = 0;
        let shouldDouble = false;
        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber[i]);
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        return sum % 10 === 0;
    }

    if (!/^\d{16}$/.test(cardNumber) || !luhnCheck(cardNumber)) {
        showMessage("رقم البطاقة غير صالح.", false);
        return false;
    }

    if (!/^\d{3,4}$/.test(cvc)) {
        showMessage("رمز CVC غير صالح.", false);
        return false;
    }

    const [expMonth, expYear] = expiry.split("/").map(str => parseInt(str));
    if (isNaN(expMonth) || isNaN(expYear) || expMonth < 1 || expMonth > 12) {
        showMessage("تاريخ انتهاء البطاقة غير صالح.", false);
        return false;
    }

    const currentDate = new Date();
    const expiryDate = new Date(`20${expYear}`, expMonth - 1);
    if (expiryDate < currentDate) {
        showMessage("تاريخ انتهاء البطاقة منقضٍ.", false);
        return false;
    }

    return true;
}

function processPayment() {
    const cardNumber = document.getElementById("cardNumber").value;
    const cvc = document.getElementById("cvc").value;
    const expiry = document.getElementById("expiry").value;

    if (validateCardDetails(cardNumber, cvc, expiry)) {
        fetch("http://localhost:5000/process_payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ cardNumber, cvc, expiry })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showMessage("تمت العملية بنجاح!", true);
                } else {
                    showMessage("فشل الدفع: " + data.message, false);
                }
            })
            .catch(error => {
                console.error("Error:", error);
                showMessage("حدث خطأ أثناء المعالجة.", false);
            });
    }
}

