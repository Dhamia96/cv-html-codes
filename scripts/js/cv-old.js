
$(document).ready(function () {
    const cardCount = 20;

    for (let i = 1; i <= cardCount; i++) {
        $(`#arrowUp${i}`).on('click', function () {
            $(`#card${i}`).slideToggle(400, function () {
                $(this).toggleClass('d-none active');
            });
            $(`#arrow${i}`).toggleClass('fa-arrow-down fa-arrow-up');

            for (let j = 1; j <= cardCount; j++) {
                if (j !== i && $(`#card${j}`).hasClass('active')) {
                    $(`#card${j}`).slideToggle(400, function () {
                        $(this).toggleClass('d-none active');
                    });
                    $(`#arrow${j}`).removeClass('fa-arrow-up').addClass('fa-arrow-down');
                }
            }
        });
    }
});


document.getElementById('add-edu').addEventListener('click', function () {
    addNewCard();
});

function addNewCard() {
    let newCard = document.getElementById('card-template').cloneNode(true);
    newCard.style.display = 'block';
    newCard.classList.remove('d-none');
    newCard.classList.add('open');

    let saveButton = document.createElement('button');
    saveButton.classList.add('btn', 'btn-info', 'mt-2');
    saveButton.innerText = 'حفظ';
    newCard.querySelector('.card-det').appendChild(saveButton);

    document.getElementById('card2').appendChild(newCard);

    saveButton.addEventListener('click', function () {
        let summaryCard = createSummaryCard(newCard);
        updateSummaryCard(newCard, summaryCard); // تحديث الملخص من الكارد
        document.getElementById('card2').appendChild(summaryCard);
        newCard.remove();
    });
}

function createSummaryCard(card) {
    let summaryCard = document.createElement('div');
    summaryCard.classList.add('card-summary', 'd-flex', 'justify-content-between', 'align-items-center', 'border', 'p-2', 'mb-3');
    summaryCard.innerHTML = `
        <span class="summary-content"> المؤهلات الدراسية: </span>
        <button type="button" class="btn btn-outline-secondary edit-card">
            <i class="fas fa-pencil-alt"></i> تعديل
        </button>
        <button type="button" class="btn btn-outline-danger delete-card">
            <i class="fas fa-trash-alt"></i> حذف
        </button>
    `;

    const editButton = summaryCard.querySelector('.edit-card');
    editButton.addEventListener('click', function () {
        editButton.style.display = 'none';
        let editableCard = card.cloneNode(true);
        editableCard.style.display = 'block';

        // احصل على القيم الحالية من السمري
        const summaryContentText = summaryCard.querySelector('.summary-content').textContent;

        if (summaryContentText) { // تحقق مما إذا كانت القيمة موجودة
            const experienceParts = summaryContentText.split(': ')[1]; // الحصول على الجزء بعد "الخبرة العملية: "
            if (experienceParts) { // تحقق مما إذا كان الجزء موجودًا
                const [jobPosition, jobTitle, city, dateRange] = experienceParts.split(', ');
                const [startDate, endDate] = dateRange ? dateRange.replace('من ', '').split(' إلى ') : ["", ""];

                editableCard.querySelector('.job-position').value = jobPosition || "";
                editableCard.querySelector('.job-title').value = jobTitle || "";
                editableCard.querySelector('.city').value = city || "";
                editableCard.querySelector('.start-date').value = startDate || "";
                editableCard.querySelector('.end-date').value = endDate || "";
            } else {
                console.warn('No experience data found in summaryContentText:', summaryContentText);
            }
        } else {
            console.warn('summaryContentText is not valid:', summaryContentText);
        }

        let saveButton = editableCard.querySelector('.btn-info');
        saveButton.innerText = 'حفظ التعديل';

        saveButton.addEventListener('click', function () {
            updateSummaryCard(editableCard, summaryCard); // تحديث الملخص بالقيم الجديدة
            updateCardFields(editableCard); // تحديث الحقول داخل الكارد المعدل
            summaryCard.style.display = 'block';
            editableCard.remove();
            editButton.style.display = 'inline-block'; // إعادة عرض زر التعديل
        });

        document.getElementById('card2').appendChild(editableCard);
        summaryCard.style.display = 'none';
    });

    // كود deleteButton كما هو
    const deleteButton = summaryCard.querySelector('.delete-card');
    deleteButton.addEventListener('click', function () {
        Swal.fire({
            title: 'هل أنت متأكد؟',
            text: "لن تتمكن من استرجاع هذا الكارد!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'نعم، احذفها!',
            cancelButtonText: 'إلغاء'
        }).then((result) => {
            if (result.isConfirmed) {
                summaryCard.remove();
                card.remove();
                Swal.fire(
                    'تم الحذف!',
                    'تم حذف الكارد بنجاح.',
                    'success'
                );
            }
        });
    });

    return summaryCard;
}

function updateSummaryCard(card, summaryCard) {
    const jobPosition = card.querySelector('.job-position') ? card.querySelector('.job-position').value : "";
    const jobTitle = card.querySelector('.job-title') ? card.querySelector('.job-title').value : "";
    const city = card.querySelector('.city') ? card.querySelector('.city').value : "";
    const startDate = card.querySelector('.start-date') ? card.querySelector('.start-date').value : "";
    const endDate = card.querySelector('.end-date') ? card.querySelector('.end-date').value : "";

    const summaryContent = summaryCard.querySelector('.summary-content');
    summaryContent.textContent = `المؤهلات الدراسية: ${jobPosition}, ${jobTitle}, ${city}, من ${startDate} إلى ${endDate}`;
}

function updateCardFields(card) {
    // تحديث الحقول في الكارد بالقيم الجديدة
    const jobPosition = card.querySelector('.job-position') ? card.querySelector('.job-position').value : "";
    const jobTitle = card.querySelector('.job-title') ? card.querySelector('.job-title').value : "";
    const city = card.querySelector('.city') ? card.querySelector('.city').value : "";
    const startDate = card.querySelector('.start-date') ? card.querySelector('.start-date').value : "";
    const endDate = card.querySelector('.end-date') ? card.querySelector('.end-date').value : "";
    console.log(jobPosition);

    // حفظ القيم المحدثة في الحقول نفسها
    card.querySelector('.job-position').value = jobPosition;
    card.querySelector('.job-title').value = jobTitle;
    card.querySelector('.city').value = city;
    card.querySelector('.start-date').value = startDate;
    card.querySelector('.end-date').value = endDate;
}




// إظهار حقل إدخال الجنسية عند النقر على زر "إضافة جنسية جديدة"
document.getElementById('addNationalityBtn').addEventListener('click', function () {
    document.getElementById('newNationalityContainer').classList.toggle('d-none');
    document.getElementById('newNationality').focus();
});

// إضافة الجنسية الجديدة إلى القائمة عند النقر على زر "إضافة"
document.getElementById('confirmAddNationalityBtn').addEventListener('click', function () {
    var newNationalityInput = document.getElementById('newNationality');
    var nationality = newNationalityInput.value.trim();
    if (nationality) {
        var select = document.getElementById('nationality');
        var option = document.createElement('option');
        option.value = nationality;
        option.textContent = nationality;
        option.classList.add('custom-option'); // فئة خاصة للجنسية الجديدة
        select.appendChild(option);
        select.value = nationality; // تعيين الخيار الجديد كقيمة مختارة
        newNationalityInput.value = ''; // إفراغ حقل الإدخال
        document.getElementById('newNationalityContainer').classList.add('d-none'); // إخفاء حقل الإدخال
    }
});

// حذف آخر جنسية تمت إضافتها يدويًا
document.getElementById('deleteNationalityBtn').addEventListener('click', function () {
    var select = document.getElementById('nationality');
    var options = select.getElementsByClassName('custom-option');
    if (options.length > 0) {
        select.removeChild(options[options.length - 1]); // حذف آخر خيار مضاف
    }
    document.getElementById('newNationalityContainer').classList.add('d-none'); // إخفاء حقل الإدخال
});
$('.add-input-btn').click(function (e) {
    const fieldName = $(this).data('field-name');
    const inputId = `new-input-${fieldName}`;

    if ($(`#${inputId}`).length === 0) {
        const newInput = `
                        <div class="form-group text-right small">
                            <label for="${inputId}">${fieldName}</label>
                            <input type="text" class="form-control" id="${inputId}">
                            <button type="button" class="btn btn-danger remove-input-btn">ازالة</button>
                        </div>
                    `;
        $('#input-container').append(newInput);
    }
});

$('#input-container').on('click', '.remove-input-btn', function () {
    $(this).closest('.form-group').remove();
});



document.addEventListener('DOMContentLoaded', function () {
    const editor = document.getElementById('editor');

    document.querySelectorAll('.format-btn').forEach(button => {
        button.addEventListener('click', function () {
            const action = this.dataset.action;

            switch (action) {
                case 'bold':
                    document.execCommand('bold');
                    break;
                case 'italic':
                    document.execCommand('italic');
                    break;
                case 'left-align':
                    document.execCommand('justifyLeft');
                    break;
                case 'center-align':
                    document.execCommand('justifyCenter');
                    break;
                case 'right-align':
                    document.execCommand('justifyRight');
                    break;
                case 'increase-size':
                    let currentSize = parseInt(window.getComputedStyle(editor).fontSize);
                    editor.style.fontSize = (currentSize + 2) + 'px';
                    break;
                case 'decrease-size':
                    let currentSizeDecrease = parseInt(window.getComputedStyle(editor).fontSize);
                    editor.style.fontSize = (currentSizeDecrease - 2) + 'px';
                    break;
                case 'ordered-list':
                    document.execCommand('insertOrderedList');
                    break;
                case 'underline':
                    document.execCommand('underline', false, null);
                    break;
                case 'unordered-list':
                    document.execCommand('insertUnorderedList');
                    break;
            }
        });
    });
});



$(".js-example-placeholder-single").select2({
    tags: true,
    tokenSeparators: [',', ' ']
});
const countryToCities = {
    "SA": ["الرياض", "جدة", "مكة", "الدمام", "الظهران", "الخبر", "الطائف", "رابغ", "الليث", "القنفذة", "المدينة المنورة", "ينبع", "العلا", "بدر", "الحناكية", "مهد الذهب", "خيبر", "أبها", "خميس مشيط", "بيشة", "النماص", "أحد رفيدة", "رجال ألمع", "محايل عسير", "بلقرن", "بريدة", "عنيزة", "الرس", "البكيرية", "المذنب", "البدائع", "رياض الخبراء", "تبوك", "ضباء", "الوجه", "تيماء", "أملج", "حقل", "البدع", "حائل", "بقعاء", "الشنان", "الغزالة", "الشملي", "جازان", "صبيا", "أبو عريش", "صامطة", "بيش", "العارضة", "فرسان", "نجران", "شرورة", "حبونا", "الباحة", "المندق", "المخواة", "بلجرشي", "العقيق", "عرعر", "رفحاء", "طريف", "سكاكا", "القريات", "دومة الجندل"],
    "EG": ["القاهرة", "الإسكندرية", "الجيزة", "طنطا", "المنصورة", "دمياط", "سوهاج", "أسيوط", "بني سويف", "الفيوم", "قنا", "الزقازيق", "السويس", "شرم الشيخ", "دمنهور", "المنيا", "سيدي عبد الرحمن", "أسوان", "العباسية"],
    "JO": ["عمان", "الزرقاء", "إربد", "جرش", "الكرك", "السلط", "مأدبا", "عجلون", "الطفيلة", "البتراء", "وادي موسى", "معان", "الرمثا", "الأغوار", "الشوبك", "المفرق", "الجويدة", "وادي السير"],
    "AE": ["دبي", "أبوظبي", "الشارقة", "عجمان", "رأس الخيمة", "الفجيرة", "أم القيوين", "الغيص", "الذيد", "الحمرية"],
    "QA": ["الدوحة", "الريان", "الخور", "مسيمير", "الوكرة", "لوسيل", "الشيحانية", "الشمال", "الظعاين", "الضاحية"],
    "AF": ["كابول", "هيرات", "مزار الشريف", "قندهار", "جلال آباد", "بادغيس", "جوزجان", "فارياب", "باميان", "نانجارهار", "تخار", "كابيسا", "لوجر", "غزني", "بلك", "سرابول", "زابل", "هرات", "غزني", "قندوز"],
    "AL": ["تيرانا", "دورس", "فلاش", "شيروك", "بيرات", "كورشا", "لاغا", "فيير", "ساراندا", "ليش", "كافاجا", "هورش", "بيرا", "تيت", "كرويا", "سوبات", "لوشنيا", "فريس", "بونار", "مولج"],
    "DZ": ["الجزائر العاصمة", "وهران", "قسنطينة", "البليدة", "عنابة", "سطيف", "تيزي وزو", "باتنة", "بسكرة", "البرج", "تيارت", "مدية", "الجلفة", "أم البواقي", "الشلف", "خنشلة", "سوق أهراس", "المسيلة", "أدرار", "بشار"],
    "AD": ["أندورا لا فيلا", "إل كاسا", "سانت جولي", "كانييل", "كول ديز بورتس", "سانت بيري", "سانت ماريا", "سانت جوليان", "سانت أوغستين", "لا ماسانا", "كانيللي", "إنتيرلاكن", "بوسكا", "كاب ديل هوس", "أندورا", "سانت دانييل", "سانت مارتن", "سانت أوغستين", "إل كاسا", "كانيل"],
    "AO": ["لواندا", "ناجولا", "سونو", "كابندا", "لوندا", "أونجوي", "موينج", "كابيندا", "كيساما", "مالانج", "غوتا", "سونيغو", "أمبولا", "جيجي", "موجيم", "بيلو", "سنتانا", "موسساكوسو", "جوسي", "توندوا"],
    "AG": ["سانت جونز", "سانت ماري", "سانت جورج", "سانت فيليب", "سانت لويس", "سانت بول", "سانت جوليان", "سانت جيروم", "سانت بطرس", "سانت مارك", "سانت توماس", "سانت بتر", "سانت أندرو", "سانت ماريا", "سانت أنطونيو", "سانت مايكل", "سانت نيكولاس", "سانت كاترين", "سانت جوي", "سانت جوان"],
    "AR": ["بوينس آيرس", "كوردوبا", "روساريو", "منتز", "لا بلاتا", "مار دل بلاتا", "سان ميغيل دي توكومان", "مندوزا", "سان خوان", "سانتافي", "راكفيل", "ريو كويرتو", "الكونكويستا", "باريلوش", "سالنكيس", "خنزت", "ريكا", "سان كروز", "شيلفليو", "الين"],
    "AM": ["يريفان", "غومري", "فاجاراش", "ديلجان", "آرارات", "سيونيك", "خاباروفسك", "تاشين", "آرتاشات", "سيسيان", "كابان", "هرازدان", "سيفان", "هيرابش", "ستيبانافان", "ألفست", "تيبليز", "جيفري", "فيتاغا", "سارا"],
    "AU": ["سيدني", "ملبورن", "بريسبان", "بيرث", "أديلايد", "هوبارت", "داروين", "كانبيرا", "جولد كوست", "نيوكاسل", "سنترال كوست", "لانكستر", "ويغن", "مارغريت ريفير", "بندigo", "ويغنز", "بروكن هيل", "ألبري", "تينده", "بيلينغتون"],
    "AT": ["فيينا", "سالزبورغ", "إنسبروك", "غراتس", "كلاغنفورت", "فلورنس", "براغ", "ليوبن", "شتاينغاد", "تيرول", "جراز", "شيفيلد", "ميونيخ", "كريفيلد", "فيلينج", "وينير نيوشتات", "بادن", "ترين", "كوشينغن", "كولينز"],
    "AZ": ["باكو", "غابالا", "غنجا", "لانكاران", "شيكي", "بيلقان", "سومغايت", "ماسالي", "يوليزي", "كنجة", "أغستافا", "لوكران", "تارتار", "خانلار", "زرداب", "لنكوران", "كولوسو", "أغجاباد", "شيرفان", "مردكان"],
    "BS": ["ناسو", "فريبورت", "بالم بيتش", "غريت إكسوما", "سانت مايكل", "سانت جورج", "سانت أندرو", "سانت جيمس", "سانت لويس", "سانت مارك", "سانت توماس", "سانت فيليب", "سانت أوغستين", "سانت بيتر", "سانت لوسي", "سانت ديفيد", "سانت مايكل", "سانت بطرس", "سانت جيروم", "سانت هيلين"],
    "BH": ["المنامة", "المحرق", "سلمانة", "الرفاع", "الحد", "جساسية", "عالي", "الزنج", "الحالة", "سار", "المحرق", "المنامة", "مقعق", "حلبة", "فقيه", "الداود", "الجديرة", "المطافئ", "المنصورية", "الشارقة"],
    "BD": ["دكا", "تشيتاغونغ", "خولنا", "راجشاهي", "سليت", "باريسال", "مغورا", "بغورا", "كاور", "جوراي", "سانت مارتن", "رامجانج", "دورغات", "نامكان", "مايدا", "دكاري", "سونامجانج", "شايستاغانج", "كيسيج", "موجول", "بيلزار"],
    "BB": ["بريدجتاون", "سانت مايكل", "سانت جيمس", "سانت لوسي", "سانت جورج", "سانت أندرو", "سانت توماس", "سانت فيليب", "سانت جون", "سانت بطرس", "سانت باتريك", "سانت كاترين", "سانت مارتن", "سانت جورج", "سانت جان", "سانت ماري", "سانت فيرناند", "سانت إدوارد", "سانت أندرو", "سانت بتر"],
    "BY": ["مينسك", "غوميل", "بريست", "فتيبسك", "بريست", "موغيليف", "بارانوفيتش", "بريتش", "فيلينس", "بيشكاك", "تشيرنوسو", "ريفاس", "كوبينك", "جيليوف", "غوركي", "فتيبسك", "سيباليك", "شفوك", "سوزوف", "ساشيفو"],
    "BE": ["بروكسل", "أنتويرب", "غنت", "شارلوروا", "نامور", "لييج", "ميز", "بروج", "دينانت", "أوفرسيس", "بورغس", "غيزينز", "لورين", "فلورين", "ماينيز", "تيرزير", "لوكارنو", "تشيفو", "فيلير", "فيلز"],
    "BZ": ["بلموبان", "سان إغناسيو", "سان بيدرو", "كوروزال", "بلسمر", "سانت بتر", "سانت هيلين", "سانت جود", "سانت مارتن", "سانت جورج", "سانت كاترين", "سانت لويس", "سانت توماس", "سانت إدوارد", "سانت بطرس", "سانت جيمس", "سانت مايكل", "سانت ديفيد", "سانت لوسي", "سانت ماري"],
    "BJ": ["بورتو نوفو", "كوتونو", "دجيوه", "بنكوي", "سوكوديه", "أبومي", "كلويكوتا", "تيشون", "تامالي", "زوان", "أبومي", "تندروك", "لا باتين", "سوكوديه", "أكيس", "ساحل النعام", "جودة", "نيريجو", "أشريفو", "بلاتسوس"],
    "BT": ["تيمفو", "بورتو", "فونتسو", "بارو", "جاكيل", "مورغيلونغ", "جوروغ", "بيدبيني", "فورتوينغ", "غليوا", "نافا", "سامدرو", "مناو", "شينج", "كولاني", "باليجولغ", "بانغتس", "تشولمونغ", "زغاغ", "تامبرو"],
    "BO": ["لاباز", "سانتا كروز", "كوتشابامبا", "سوكري", "ترينيداد", "بيني", "تشوكيساكا", "أورورو", "بيدرا", "كارانزابل", "سيربوكورو", "جيما", "جويجوي", "جيوميسو", "سانت أغسطين", "مانو", "أنغارا", "مونتو", "أجريد", "بولو"],
    "BA": ["سراييفو", "بانيا لوكا", "توزلا", "زيلينجا", "بوجاس", "سوسكي", "سارايفا", "ترنوس", "سرايفو", "برودر", "بيلا", "فيسوكو", "فلاغ", "سبريتس", "باناكيتس", "جوردوك", "بوسنتو", "بوستسا", "غيب", "ديراي"],
    "BW": ["غابورون", "بوتسوانا", "ماجوي", "سيروى", "كويكوي", "بولاو", "كاساندي", "نجامبوي", "غابات", "موساكوكو", "تسوديمو", "سيتوي", "موتشينغ", "غشونغ", "غوردون", "بيموينغ", "كيتابو", "بولاو", "غانا", "بوناك"],
    "BR": ["ساو باولو", "ريو دي جانيرو", "سلفادور", "فورتاليزا", "ماناوس", "بيلو هوريزونتي", "ساو بيرناردو دو كامبو", "برازيليا", "ريو برانكو", "غوارولوس", "كونتاجورا", "ساساكو", "كويتزابل", "سيتوبال", "فيساو", "الساو", "سيرزا", "ريو دي جانيرو", "ساو جونسو", "ساو جوني"],
    "BN": ["بندر سيري بيغاوان", "كوالا بيلوت", "بيلايت", "باندانغ", "تونغ", "سيكو", "غونغنغ", "فيتوم", "موتونغ", "تانجونغ", "كوانغ", "جورج تاون", "تيغو", "تنغول", "مالاي", "سيارا", "بولاو", "مالاي", "تيونغ", "كشول"],
    "BG": ["صوفيا", "بلاگويفغراد", "فارنا", "بورغاس", "فليبوف", "بست", "بلغوغراد", "غرازدوف", "بوزوفا", "بنجسكا", "زافورسيا", "كازانلكا", "سوفيكا", "تريشينكا", "هالكوفيك", "يبدو", "ألبانو", "غوبرتش", "ساكليكا", "بلغاد"],
    "BF": ["واغادوغو", "بوبا", "كوسيما", "سيسولا", "بوركينا فاسو", "كوسيما", "سيريه", "غوغا", "كاراغا", "نسا", "بوني", "بورغو", "بولج", "بوغو", "تونيغا", "سوسي", "كوك", "تودغوا", "بريتون", "بغيام"],
    "BI": ["بوجومبورا", "جيتيغا", "رومونغ", "ساوتيم", "بورانغارو", "بروغوني", "مايامبو", "سيرفاي", "كياكو", "كانامو", "سياكو", "مونغا", "كوارغو", "بريارا", "جابورا", "راسي", "كونغو", "غابورا", "غومونغ", "غامبورا"],
    "KH": ["بنوم بنه", "سيام ريب", "باتامبانغ", "سيناكفيل", "كومبونغ تشام", "تاتوك", "سرايف", "كومبونغ سبو", "كومبونغ ثوم", "كومبونغ شنج", "كومبونغ شايل", "بانغكوي", "تيفور", "سيهانوكفيل", "سيرين", "كومبونغ تشام", "بريه فاهان", "كانتشا", "بيكوت", "كامبوت"],
    "CM": ["ياوندي", "دوالا", "غاروا", "بامندا", "إيبينغو", "كومبو", "ماروا", "نوكو", "لا ديوا", "بولا", "لامدوغو", "غونغ", "ماروا", "تاغونغ", "ليتونغ", "ساووا", "كرسونغ", "تشوبو", "كومبام", "بارمونغ"],
    "CA": ["تورنتو", "فانكوفر", "مونتريال", "أوتاوا", "كالغاري", "إدمونتون", "هاليفاكس", "ريجينا", "ساسوكتون", "وينيبغ", "كيتشنر", "لندن", "كانور", "غويلف", "كافين", "ماربل هيل", "غالبا", "ألبرتا", "ستيفن كينغ", "باري"],
    "CV": ["برايا", "ميناء غرافو", "سانتياغو", "فنشنك", "بلدانسانتو", "سالو", "أوغستا", "سانت كروز", "مينادوتا", "سالم", "سانتا كاتارينا", "بيدرا", "أندور", "سانت توماس", "فريسير", "كالا", "مارا", "فيسينس", "غوادالوبي", "باسور"],
    "CF": ["بنكاسو", "بانغي", "بامبو", "بونجو", "باسوبول", "سايا", "بوغندا", "بوكوما", "بارا", "بوسانغو", "كوتيسا", "بانيا", "سونغو", "جوباندو", "كيسكا", "بوسكان", "بونجول", "موركي", "جولد", "خاتس"],
    "TD": ["إنجامينا", "سيدار", "سليم", "باغازو", "كاشولا", "دالجا", "شاري", "سيدي", "غونغونغ", "ميديفان", "دوبا", "بورك", "الطينة", "تريدوك", "إنجمينا", "بيلغور", "بولوبو", "قرقندش", "بليغون", "كوكو"],
    "CL": ["سانتياغو", "فالبارايسو", "كونسبسيون", "لا سيرينا", "أنتوفاغاستا", "تيموكو", "كوكيمبو", "سانتياغو", "أوسورنو", "بورتو مونت", "ماكوندو", "سان أنطونيو", "سان فرناندو", "لونيل", "لا نوسا", "أجوادا", "فوروغو", "أنتافاغاستا", "سانتياغو", "سيرينو"],
    "CN": ["بكين", "شانغهاي", "غوانغزو", "شنتشن", "تيانجين", "شينزين", "شينغدو", "تشونغتشينغ", "نانجينغ", "تشينغداو", "تشنغدو", "سوتشو", "هانغتشو", "ووهان", "جوانغشي", "فووشان", "ووزهون", "جياشينغ", "جينان", "تاينغ"],
    "CO": ["بوغوتا", "ميديلين", "كالي", "بارانكويلا", "بيلوكو", "بوكاسا", "باغوتا", "جواندا", "جويتيريمو", "سينكا", "سان أنطونيو", "كيوندو", "سيرانا", "سوجار", "سيسيل", "تشوكيمات", "بوجوتا", "باجاو", "أوسوروبا", "ترينيدا"],
    "KM": ["موروني", "فومبوني", "موهيلي", "أنجوان", "موهيلي", "بنجا", "سالا", "كريني", "موسيندي", "موهيدا", "فومبوني", "كامبولي", "موروما", "فوتونغو", "ماريمبا", "سلا", "جناي", "بوريما", "موهيدا", "مانجي"],
    "CG": ["برازافيل", "بول", "كومبولا", "غونغو", "ماكونو", "موالي", "بورا", "بونغو", "بانجي", "موكاسا", "سيروتي", "غونغو", "كوريا", "سكاندي", "موليندي", "تاتاكو", "ماكونو", "مورومبا", "سليتان", "كوكو"],
    "CD": ["كينشاسا", "غاديسوك", "ليمبوبو", "ماتادي", "شامبولي", "ماتادي", "سيسبومبا", "لومي", "ماكوندو", "بابوا", "جنغال", "أوفانغو", "نيكو", "تشيكوي", "بولا", "بامبوا", "كاتند", "بوندو", "كوروسكوم", "بوينغو"],
    "CR": ["سان خوسيه", "أليندي", "هيريديا", "جراسيا", "سانتا باربارا", "سجويراس", "ليبيريا", "فورو كولورادو", "ساراسا", "بوينجابي", "هيريدا", "بورازو", "سيرينديلا", "سانتوس", "سان ميغيل", "سوسو", "بورتا بونس", "توسكا", "أوتاوا", "مالتا"],
    "CI": ["أبيدجان", "بواكي", "غران باسام", "ياموسوكرو", "سان بيدرو", "كورهوغو", "زانيابا", "بوموبو", "غابو", "سانت جولي", "كوموي", "تيرجيليو", "غابو", "سيرينديلا", "تونكين", "كونغو", "أبيني", "أبيدجان", "بواكي", "بيكتو"],
    "HR": ["زغرب", "رييكا", "سبليت", "أوسييك", "زارا", "فوشيت", "فيكونيا", "تروغير", "بولا", "كراستوفك", "سيساك", "بيكا", "مارتين", "باريش", "زافيكا", "سيرينغو", "ماكونو", "بادا", "شتايك", "نوفي"],
    "CU": ["هافانا", "سانتياغو دي كوبا", "كاماجوي", "سانتا كلارا", "غوانتانامو", "تارارا", "بونتيانا", "أسينسيو", "باريكويتو", "غريغاريو", "أونيفيريس", "سان تيريزا", "مانزانيلو", "ييلفا", "غوانتانامو", "ميرامار", "سانتا في", "أوفيتا", "سان ميغيل", "تارارا"],
    "CY": ["نيقوسيا", "لارنكا", "ليمسول", "فاماغوستا", "بافوس", "أيا نابا", "أراديف", "بروتيون", "سراييفو", "كازاخستان", "كيرينيا", "سوروشين", "فاراكا", "جماعة الصوفية", "دماء تحت الماء", "ليماسول", "بافوس", "نيركا", "ناسايا", "بريفا"],
    "CZ": ["براغ", "برنو", "أوسترافا", "بيلسن", "ليبيرك", "هراديك كرالوف", "تشيب", "أوبافا", "ترينتشين", "كولوي", "بونوفا", "كازيمير", "إنسبرك", "فوزن", "فيتكو", "سانت إيفز", "أولوموك", "بيليني", "ساندوتش", "ريكا"],
    "DK": ["كوبنهاغن", "أرهوس", "أودنسه", "إلسينور", "هولباك", "سونديرب", "كورسلند", "فيبورج", "سيبنك", "ميلون", "ستفيديبورج", "شونر", "دوندس", "سليتس", "آرهوس", "ساندرينغ", "كوبنهاغن", "فيبورج", "سبير", "فيت"],
    "DJ": ["جيبوتي", "عيرضة", "علي الصباح", "أرض الفقر", "الأمدرمان", "مينقبو", "الشجار", "مجرد طريء", "أكمانتس", "جابو", "مليح", "جماعة بوهدرة", "الشاري", "المجيرون", "القرب", "السوق", "الغور", "المنصورية", "جيبوتي", "غالي"],
    "DM": ["روسو", "سانتياغو", "بواكيه", "سانت جونز", "ماريغوت", "جراند باي", "أنجوي", "بويتس", "بابي", "ريو كويزو", "سانت بطرس", "محمود", "جيما", "الكونكوت", "براجون", "الدامو", "فاسكي", "غراندي", "سانت كاترين", "مستشفى الصعيد"],
    "DO": ["سانتو دومينغو", "سانتاغو", "سان فيليبي", "سانت كاترين", "بونتا كانا", "لا رومانا", "سان بيدرو", "باريشونا", "باسكال", "باكونتوجو", "مالانغو", "جراندي", "سان أندرو", "فوينتي", "سان كريستوبال", "جيرالدو", "ترينيداد", "تشيكاب", "باني"],
    "EC": ["كيتو", "غواياكيل", "كوينكا", "مانابي", "لوجا", "أمباتو", "ريو بامبا", "تولا", "سانتو دومينغو", "مالابو", "كيتو", "كوسكوس", "سانتوس", "سينشا", "جواياكيل", "ألومو", "بيلا", "بورتو فيجو", "باجوار", "سانت بطرس"],
    "EG": ["القاهرة", "الإسكندرية", "الجيزة", "سوهاج", "الأقصر", "أسوان", "بورسعيد", "دمياط", "طنطا", "المنصورة", "بني سويف", "الشرقية", "الفيوم", "المنيا", "أسيوط", "قنا", "محافظة البحر الأحمر", "كفر الشيخ", "السويس", "مرسى مطروح"],
    "SV": ["سان سلفادور", "سان ميغيل", "أوتو", "سانتا آنا", "أسانسون", "سانت لوسيا", "جيسكو", "تودين", "فيراكروز", "غواتيمالا", "بيريرو", "ديمك", "سولا", "بلايا", "سان بيدرو", "بالمير", "بورتو", "سان أنطونيو", "لا بويرا", "السان"],
    "GQ": ["مالابو", "باتا", "إيبيبي", "سيبونغ", "ريوش", "مالابو", "كولا", "أوجي", "كولا", "بينغو", "لوسكا", "إيبينغو", "غينغا", "تريندا", "أنغولا", "غابورون", "سان فيسينتي", "غيشيدو", "كاسابي", "تورينو", "بامباسو"],
    "ER": ["أسمرة", "مسيلي", "كريم", "غابات", "قويديرا", "بري", "أسمرة", "مسيلي", "بنيامو", "ماركت", "تسوغيرا", "بلينغس", "سارونغو", "غابورون", "بيفر", "سودان", "بورتو غاسا", "سيراك", "أسمرة", "غشونغ", "موسيل"],
    "EE": ["تالين", "تارتو", "نارفا", "فورس", "أوفا", "بورتوما", "ماردي", "سيتو", "سيرينتا", "سياكولم", "سيمتس", "فورتيك", "فوليس", "ترينوفو", "الأنجلو", "فالادور", "كوسي", "ريمس", "سكانديا", "فيسان", "مارموريكا"],
    "ET": ["أديس أبابا", "ميكيلي", "ديرداوا", "بحر دار", "بوني", "غيندر", "سيدامو", "غوندر", "أديس أبابا", "بني شنجول", "الكواري", "بوريك", "باميدا", "فاجلا", "بيلي", "ماردو", "سيربا", "تمجيتو", "سومالي", "مانو"],
    "FJ": ["سوغا", "لامباسي", "واتا", "فاكا", "مابوانو", "شاوكي", "ساوما", "غراسي", "نوكوتي", "جونا", "ترانجا", "باسكو", "ماتماتا", "مويا", "أوناجيا", "فينودا", "شاكرا", "ماتارودو", "لاوتا", "فوانا"],
    "FI": ["هلسنكي", "تامبيري", "أولو", "فاسا", "يوفاسكولا", "روبي", "لويولا", "لا تولا", "أوتو", "بورتو", "باريتا", "مويرينغ", "أولو", "تايلا", "سيفو", "فاسا", "باسيلون", "سانت بارتيليموس", "هيلسونكي", "هويج", "كالافيس"],
    "FR": ["باريس", "مارسيليا", "ليون", "ليل", "تولوز", "نيس", "مونبلييه", "نانت", "بوردو", "ستراسبورغ", "رين", "لييل", "تولوز", "أفينيون", "موازيون", "فرساي", "ناربون", "سينت إتيان", "باسكال", "مونتازا", "الآلزاس"],
    "GA": ["ليبرفيل", "بورت جنتيل", "فرانس", "غابون", "باري", "يومو", "موغودو", "غابون", "باري", "بونغو", "شيمبو", "موريتس", "ليبرفيل", "تيمبواتو", "سينو", "تيمبو", "موغودو", "ليما", "بونغو", "فرانس"],
    "GM": ["بانجول", "سيريكوندي", "ماتام", "سينيجال", "باسا", "جولن", "سيرافا", "باكري", "مودو", "كيمو", "كيندو", "جيفو", "كاندال", "بريمان", "سيريكوندي", "بورتو", "بانجول", "جيبون", "سيريكوندي", "غوياسو"],
    "GE": ["تبليسي", "زورمغان", "كوتايسي", "روستافي", "غوري", "زغيديدي", "بوزاني", "تيلافي", "أوني", "تسودوغورا", "فاندي", "مورداني", "غومري", "باتومي", "كوليندي", "سخويتي", "سامتيز", "غورغاسالي", "تيلافي", "ساجري"],
    "DE": ["برلين", "ميونيخ", "فرانكفورت", "هامبورغ", "كولونيا", "شتوتغارت", "دوسلدورف", "دورتموند", "بريمن", "هانوفر", "نورنبرغ", "ماينز", "فيسبادن", "أوجسبورغ", "لايبزيغ", "هيلدسهايم", "مانهايم", "ساربروكن", "بوخوم", "بون"],
    "DJ": ["جيبوتي", "عيرضة", "علي الصباح", "أرض الفقر", "الأمدرمان", "مينقبو", "الشجار", "مجرد طريء", "أكمانتس", "جابو", "مليح", "جماعة بوهدرة", "الشاري", "المجيرون", "القرب", "السوق", "الغور", "المنصورية", "جيبوتي", "غالي"],
    "DO": ["سانتو دومينغو", "سانتاغو", "سان فيليبي", "سانت كاترين", "بونتا كانا", "لا رومانا", "سان بيدرو", "باريشونا", "باسكال", "باكونتوجو", "مالانغو", "جراندي", "سان أندرو", "فوينتي", "سان كريستوبال", "جيرالدو", "ترينيداد", "تشيكاب", "باني"]

};


$(document).ready(function () {
    $('#country-select').on('change', function () {
        var selectedCountry = $(this).val();
        var cities = countryToCities[selectedCountry] || [];

        $('#city-select').empty().append('<option value="" disabled selected>اختر المدينة</option>');
        $.each(cities, function (index, city) {
            $('#city-select').append('<option value="' + city + '">' + city + '</option>');
        });

        $('#city-select').trigger('change');
    });

    $('#city-select').on('select2:select', function (e) {
        var data = e.params.data;
        if (data.newOption) {
            alert('تمت إضافة المدينة الجديدة: ' + data.text);
        }
    });

    // Add Skill Card
    $('#addSkillBtn').on('click', function () {
        addCard('skill', '#skillsContainer');
    });

    // Add Language Card
    $('#addSkillBtnLang').on('click', function () {
        addCard('language', '#skillsContainerLang');
    });

    // Add Hobby Card
    $('#addSkillBtnHop').on('click', function () {
        addCard('hobby', '#skillsContainerHop');
    });

    function addCard(type, containerSelector) {
        const container = $(containerSelector);
        const cardCount = container.find('.skill-card').length + 1;
        const newCard = $(`
            <div class="skill-card text-right" id="${type}Card-${cardCount}">
                <div class="header d-flex justify-content-between align-items-center">
                    <span>${type === 'skill' ? 'المهارة' : type === 'language' ? 'اللغة' : 'الهوايات'} [${cardCount}]</span>
                    <button class="btn btn-outline-secondary edit-btn">
                        <i class="fa fa-pencil"></i>
                    </button>
                </div>
                <div class="card-body">
                    <div class="form-group">
                        <label for="${type}Input${cardCount}">${type === 'skill' ? 'المهارة' : type === 'language' ? 'اللغة' : 'الهوايات'}</label>
                        <input type="text" class="form-control" id="${type}Input${cardCount}" placeholder="">
                    </div>
                    ${type !== 'hobby' ? `
                        <div class="form-group">
                            <label for="${type}Level${cardCount}">المستوى</label>
                            <select class="form-control" id="${type}Level${cardCount}">
                                <option value="">اختر مستوى</option>
                                <option value="1">مبتدأ</option>
                                <option value="2">متوسط</option>
                                <option value="3">جيد</option>
                                <option value="4">قوي</option>
                            </select>
                        </div>
                    ` : ''}
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        
                        <button class="btn btn-outline-secondary delete-btn">
                            <i class="fa fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `);

        container.append(newCard);
    }

    // Delegate event handling for editing and deleting
    $(document).on('click', '.edit-btn', function () {
        const allCards = $('.skill-card');
        allCards.removeClass('open').find('.edit-btn').removeClass('d-none');

        const card = $(this).closest('.skill-card');
        card.addClass('open');
        $(this).addClass('d-none');
    });

    $(document).on('click', '.delete-btn', function () {
        $(this).closest('.skill-card').remove();
    });
});







let cardIndex = 1;
const cardsContainer = document.getElementById('cards-container');
const addTrainingBtn = document.getElementById('add-training-btn');
const cardContainer = document.getElementById('card-container');
const addCertificateBtn = document.getElementById('add-certificate-btn');

let openCard = null;

function createCard(type) {
    cardIndex++;
    const newCard = document.createElement('div');
    newCard.id = type === 'training' ? `cardt${cardIndex}` : `cardc${cardIndex}`;
    newCard.classList.add('card', 'w-100', 'mb-4', 'p-7', 'd-block');

    newCard.innerHTML = `
        <div class="row">
            <div class="card-det col-11 mx-auto">
                <div class="row">
                    <div class="col-12 pt-4">
                        <div class="form-floating">
                            <label for="floatingInput" class="d-flex label">${type === 'training' ? 'الدورات التدريبية' : 'الشهادات'}</label>
                            <input type="text" class="form-control" id="floatingInput" placeholder="">
                        </div>
                    </div>
                    <div class="col-12 mb-4 d-flex p-0 flex-column flex-sm-row  align-items-center justify-content-between">
                        <div class="col-md-6">
                            <label for="start-date" class="d-flex label">تاريخ البدء :</label>
                            <input type="date" class="form-control" id="start-date" name="start-date">
                        </div>
                        <div class="col-md-6">
                            <label for="end-date" class="d-flex label">تاريخ الإنتهاء :</label>
                            <input type="date" class="form-control" id="end-date" name="end-date">
                        </div>
                    </div>
                    <div class="col-12 mb-4">
                        <label for='editor' class="d-flex label">الوصف :</label>
                        <div class="editor-container w-100 py-3">
                            <div class="toolbar border-top pt-2">
                                <!-- Toolbar Buttons -->
                                <button class="format-btn" data-action="bold"><i class="fas fa-bold"></i></button>
                                <button class="format-btn" data-action="italic"><em><i class="fas fa-italic"></i></em></button>
                                <button class="format-btn" data-action="underline"><i class="fas fa-underline"></i></button>
                                <button class="format-btn" data-action="left-align"><i class="fas fa-align-left"></i></button>
                                <button class="format-btn" data-action="center-align"><i class="fas fa-align-center"></i></button>
                                <button class="format-btn" data-action="right-align"><i class="fas fa-align-right"></i></button>
                                <button class="format-btn" data-action="increase-size"><i class="fas fa-plus"></i></button>
                                <button class="format-btn" data-action="decrease-size"><i class="fas fa-minus"></i></button>
                                <button class="format-btn" data-action="ordered-list"><i class="fas fa-list-ol"></i></button>
                                <button class="format-btn" data-action="unordered-list"><i class="fas fa-list-ul"></i></button>
                            </div>
                            <div id="editor" contenteditable="true" class="editor"></div>
                        </div>
                    </div>
                </div>
                <div class="d-flex p-3">
                    <button type="button" class="btn btn-danger delete-btn">حذف</button>
                </div>
            </div>
        </div>
    `;

    return newCard;
}

function handleCardActions(card) {


    const deleteBtn = card.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        card.remove();
    });

    // const editBtn = card.querySelector('.edit-btn');
    // editBtn.addEventListener('click', () => {
    //     if (openCard) {
    //         openCard.classList.remove('d-none');
    //         const openEditBtn = openCard.querySelector('.edit-btn');
    //         openEditBtn.classList.remove('d-none');
    //     }
    //     openCard = card;
    //     card.classList.add('d-none');
    //     editBtn.classList.add('d-none');
    // });
}

addTrainingBtn.addEventListener('click', () => {
    // if (openCard) {
    //     openCard.classList.remove('d-none');
    //     const openEditBtn = openCard.querySelector('.edit-btn');
    //     openEditBtn.classList.remove('d-none');
    // }

    const newCard = createCard('training');
    cardsContainer.appendChild(newCard);
    openCard = newCard;
    handleCardActions(newCard);
});

addCertificateBtn.addEventListener('click', () => {
    const currentCard = document.getElementById(`cardc${cardIndex}`);
    if (currentCard) {
        currentCard.classList.add('d-none');
    }

    const newCard = createCard('certificate');
    cardContainer.appendChild(newCard);
    handleCardActions(newCard);
});
// Function to handle toggling sections
function toggleSection(openId, cardId, arrowId) {
    // Hide all sections
    const sections = ['hop', 'train', 'cert'];
    const cards = ['card6', 'card7', 'card8'];
    const arrows = ['arrow6', 'arrow7', 'arrow8'];

    sections.forEach(section => document.getElementById(section).classList.add('d-none'));
    cards.forEach(card => document.getElementById(card).classList.add('d-none'));
    arrows.forEach(arrow => $(`#${arrow}`).removeClass('fa-arrow-up').addClass('fa-arrow-down'));

    // Show the selected section
    document.getElementById(openId).classList.remove('d-none');
    document.getElementById(cardId).classList.remove('d-none');
    $(`#${arrowId}`).toggleClass('fa-arrow-down fa-arrow-up');

    // Hide all buttons except the clicked one
    const buttons = ['hopps', 'training', 'certificate'];
    buttons.forEach(button => document.getElementById(button).classList.remove('d-none'));
    document.getElementById(openId.replace('hop', 'hopps').replace('train', 'training').replace('cert', 'certificate')).classList.add('d-none');
}

// Event listeners
document.getElementById('hopps').addEventListener('click', () => {
    toggleSection('hop', 'card6', 'arrow6');
});

document.getElementById('training').addEventListener('click', () => {
    toggleSection('train', 'card7', 'arrow7');
});

document.getElementById('certificate').addEventListener('click', () => {
    toggleSection('cert', 'card8', 'arrow8');
});
const uploadButton = document.getElementById('uploadButton');
const fileInput = document.getElementById('fileInput');

uploadButton.addEventListener('click', () => {
    fileInput.click(); // فتح نافذة اختيار الملفات
});

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        console.log(`تم اختيار الملف: ${file.name}`);
        // يمكنك هنا إضافة منطق لتحميل الملف أو عرضه
    }
});
const uploadImageButton = document.getElementById('uploadImageButton');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');

uploadImageButton.addEventListener('click', () => {
    imageInput.click(); // فتح نافذة اختيار الملفات
});

imageInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block'; // عرض الصورة المختارة
        }
        reader.readAsDataURL(file); // قراءة ملف الصورة كـ base64
    }
});

document.getElementById('submitForm').addEventListener('click', function () {
    let isValid = true;

    // الاسم الأول
    const givenName = document.getElementById('focus-id-name-givenName').value.trim();
    if (givenName === '') {
        document.getElementById('errorGivenName').textContent = 'يرجى إدخال الاسم الأول';
        isValid = false;
    } else {
        document.getElementById('errorGivenName').textContent = '';
    }

    // اسم العائلة
    const familyName = document.getElementById('focus-id-name-familyName').value.trim();
    if (familyName === '') {
        document.getElementById('errorFamilyName').textContent = 'يرجى إدخال اسم العائلة';
        isValid = false;
    } else {
        document.getElementById('errorFamilyName').textContent = '';
    }

    // البريد الإلكتروني
    const email = document.getElementById('emailVal').value.trim();
    const emailPattern = a = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById('errorEmail').textContent = 'يرجى إدخال بريد إلكتروني صحيح';
        isValid = false;
    } else {
        document.getElementById('errorEmail').textContent = '';
    }

    // العنوان الرئيسي
    const mainAddress = document.getElementById('focus-id-name-mainAddress').value.trim();
    if (mainAddress === '') {
        document.getElementById('errorMainAddress').textContent = 'يرجى إدخال العنوان الرئيسي';
        isValid = false;
    } else {
        document.getElementById('errorMainAddress').textContent = '';
    }

    // الرمز البريدي
    const zipcode = document.getElementById('focus-id-address-zipcode').value.trim();
    if (zipcode === '' || zipcode.length !== 5) {
        document.getElementById('errorZipcode').textContent = 'يرجى إدخال الرمز البريدي (5 أرقام)';
        isValid = false;
    } else {
        document.getElementById('errorZipcode').textContent = '';
    }

    // المدينة
    const city = document.getElementById('focus-id-address-city').value.trim();
    if (city === '') {
        document.getElementById('errorCity').textContent = 'يرجى إدخال المدينة';
        isValid = false;
    } else {
        document.getElementById('errorCity').textContent = '';
    }

    if (isValid) {
        alert('تم تقديم النموذج بنجاح');
    }
});


document.getElementById('ًwebsites').addEventListener('click', function () {
    // Show the first card by removing the 'd-none' class
    document.getElementById('card10').classList.remove('d-none');
    document.getElementById('website').classList.remove('d-none');

});

document.getElementById('addWebSite').addEventListener('click', function () {
    // Get the container where new website cards will be added
    var websiteContainer = document.getElementById('websiteContainer');

    // Get the current number of website cards
    var cardCount = websiteContainer.querySelectorAll('.webSite-card').length;

    // Create a new card element
    var newCard = document.createElement('div');
    newCard.classList.add('webSite-card');
    newCard.id = `card-${cardCount + 1}`;
    newCard.innerHTML = `
        <div class="header d-flex justify-content-between align-items-center">
            <span>الموقع [${cardCount + 1}]</span>
            <button class="btn btn-outline-secondary edit-btn d-none">
                <i class="fa fa-pencil"></i>
            </button>
        </div>
        <div class="card-body">
            <div class="form-group">
                <label for="websiteName${cardCount + 1}">اسم الموقع</label>
                <input type="text" class="form-control" id="websiteName${cardCount + 1}" placeholder="">
            </div>
                  <div class="form-group">
                                    <label for="websiteUrl">رابط الموقع </label>
                                    <input type="text" class="form-control" id="websiteUrl" placeholder="">
                               </div>
            <div class="d-flex justify-content-between align-items-center mt-3">
               
                <button class="btn btn-outline-secondary delete-btn">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        </div>
    `;

    websiteContainer.appendChild(newCard);
});


function addCardEventListeners(card) {
    card.querySelector('.delete-btn').addEventListener('click', function () {
        card.remove();
    });

    // card.querySelector('.success-btn').addEventListener('click', function () {
    //     card.querySelector('.card-body').classList.add('bg-success', 'text-white'); // Add success styles
    //     this.disabled = true;
    // });
}

document.querySelectorAll('.webSite-card').forEach(addCardEventListeners);

document.getElementById('upload').addEventListener('change', function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const img = document.createElement('img');
        img.src = e.target.result;

        const cardBody = document.getElementById('card-body');
        cardBody.appendChild(img);
    }

    if (file) {
        reader.readAsDataURL(file);
    }
});

document.getElementById('arrowUp11').addEventListener('click', function () {
    const parcode = document.getElementById('parcode');
    const card11 = document.getElementById('card11');

    if (parcode.style.display === 'none') {
        parcode.style.display = 'block';
        card11.style.display = 'block';
    } else {
        parcode.style.display = 'none';
        card11.style.display = 'none';
    }
});

document.querySelector('.delete-bar').addEventListener('click', function () {
    const cardBody = document.getElementById('card-body');
    cardBody.innerHTML = `
        <label for="upload">رفع الباركود الخاص بك</label>
        <input type="file" id="upload" accept="image/*" />
    `;
});










function addNewCard2() {
    let newCard = document.getElementById('card-template2').cloneNode(true);
    newCard.style.display = 'block';
    newCard.classList.remove('d-none');
    newCard.classList.add('open');

    let saveButton = document.createElement('button');
    saveButton.classList.add('btn', 'btn-info', 'mt-2');
    saveButton.innerText = 'حفظ';
    newCard.querySelector('.card-det').appendChild(saveButton);

    document.getElementById('card3').appendChild(newCard);

    saveButton.addEventListener('click', function () {
        let summaryCard = createSummaryCard2(newCard);
        updateSummaryCard2(newCard, summaryCard); // تحديث الملخص من الكارد
        document.getElementById('card3').appendChild(summaryCard);
        updateCardFields2(newCard); // تحديث الحقول في الكارد
        newCard.remove();
    });
}

function createSummaryCard2(card) {
    let summaryCard = document.createElement('div');
    summaryCard.classList.add('card-summary', 'd-flex', 'justify-content-between', 'align-items-center', 'border', 'p-2', 'mb-3');
    summaryCard.innerHTML = `
        <span class="summary-content"> الخبرة العملية: </span>
        <button type="button" class="btn btn-outline-secondary edit-card2">
            <i class="fas fa-pencil-alt"></i> تعديل
        </button>
        <button type="button" class="btn btn-outline-danger delete-card2">
            <i class="fas fa-trash-alt"></i> حذف
        </button>
    `;

    const editButton = summaryCard.querySelector('.edit-card2');
    editButton.addEventListener('click', function () {
        editButton.style.display = 'none';
        let editableCard = card.cloneNode(true);
        editableCard.style.display = 'block';

        // احصل على القيم الحالية من السمري
        const summaryContentText = summaryCard.querySelector('.summary-content').textContent;

        if (summaryContentText) { // تحقق مما إذا كانت القيمة موجودة
            const experienceParts = summaryContentText.split(': ')[1]; // الحصول على الجزء بعد "الخبرة العملية: "
            if (experienceParts) { // تحقق مما إذا كان الجزء موجودًا
                const [jobPosition, jobTitle, city, dateRange] = experienceParts.split(', ');
                const [startDate, endDate] = dateRange ? dateRange.replace('من ', '').split(' إلى ') : ["", ""];

                editableCard.querySelector('.job-position').value = jobPosition || "";
                editableCard.querySelector('.job-title').value = jobTitle || "";
                editableCard.querySelector('.city').value = city || "";
                editableCard.querySelector('.start-date').value = startDate || "";
                editableCard.querySelector('.end-date').value = endDate || "";
            } else {
                console.warn('No experience data found in summaryContentText:', summaryContentText);
            }
        } else {
            console.warn('summaryContentText is not valid:', summaryContentText);
        }

        let saveButton = editableCard.querySelector('.btn-info');
        saveButton.innerText = 'حفظ التعديل';

        saveButton.addEventListener('click', function () {
            updateSummaryCard2(editableCard, summaryCard); // تحديث الملخص بالقيم الجديدة
            updateCardFields2(editableCard); // تحديث الحقول داخل الكارد المعدل
            summaryCard.style.display = 'block';
            editableCard.remove();
            editButton.style.display = 'inline-block'; // إعادة عرض زر التعديل
        });

        document.getElementById('card3').appendChild(editableCard);
        summaryCard.style.display = 'none';
    });

    // كود deleteButton كما هو
    const deleteButton = summaryCard.querySelector('.delete-card2');
    deleteButton.addEventListener('click', function () {
        Swal.fire({
            title: 'هل أنت متأكد؟',
            text: "لن تتمكن من استرجاع هذا الكارد!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'نعم، احذفها!',
            cancelButtonText: 'إلغاء'
        }).then((result) => {
            if (result.isConfirmed) {
                summaryCard.remove();
                card.remove();
                Swal.fire(
                    'تم الحذف!',
                    'تم حذف الكارد بنجاح.',
                    'success'
                );
            }
        });
    });

    return summaryCard;
}


function updateSummaryCard2(card, summaryCard) {
    const jobPosition = card.querySelector('.job-position').value || "";
    const jobTitle = card.querySelector('.job-title').value || "";
    const city = card.querySelector('.city').value || "";
    const startDate = card.querySelector('.start-date').value || "";
    const endDate = card.querySelector('.end-date').value || "";

    const summaryContent = summaryCard.querySelector('.summary-content');
    summaryContent.textContent = `الخبرة العملية: ${jobPosition}, ${jobTitle}, ${city}, من ${startDate} إلى ${endDate}`;
}
function updateCardFields2(card) {
    // تحديث الحقول في الكارد بالقيم الجديدة
    const jobPosition = card.querySelector('.job-position').value; // احصل على القيمة الحالية
    const jobTitle = card.querySelector('.job-title').value;
    const city = card.querySelector('.city').value;
    const startDate = card.querySelector('.start-date').value;
    const endDate = card.querySelector('.end-date').value;

    // طباعة القيم في الكونسل للتأكد من أنها صحيحة
    console.log(`Job Position: ${jobPosition}, Job Title: ${jobTitle}, City: ${city}, Start Date: ${startDate}, End Date: ${endDate}`);

    // حفظ القيم المحدثة في الحقول نفسها
    card.querySelector('.job-position').value = jobPosition; // تأكد من أنها تحمل القيمة الصحيحة
    card.querySelector('.job-title').value = jobTitle;
    card.querySelector('.city').value = city;
    card.querySelector('.start-date').value = startDate;
    card.querySelector('.end-date').value = endDate;
}
