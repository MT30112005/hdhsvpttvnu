// Thay thế các giá trị placeholder bằng thông tin thực tế của bạn
const shopName = 'nanglachong';
const apiKey = '6B29010EA18BBABC4B7F887493E5A2F0F9E1E5A5B5824224A22F469E9937750F';

// Light/Dark mode toggle

const themeToggle = document.getElementById('theme-toggle');
const rootElement = document.documentElement;

function updateIcons() {
    document.getElementById('sun-icon').classList.toggle('hidden', !rootElement.classList.contains('dark'));
    document.getElementById('moon-icon').classList.toggle('hidden', rootElement.classList.contains('dark'));
}

if (localStorage.getItem('theme') === 'dark') {
    rootElement.classList.add('dark');
    updateIcons();
}

themeToggle.addEventListener('click', () => {
    rootElement.classList.toggle('dark');
    const isDarkMode = rootElement.classList.contains('dark');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    updateIcons();
});

// List items

const listItem = document.getElementById('item_list');
const itemAmount = config.item_info.length;
const defaultHTML = `
<div class="bg-white rounded-lg shadow-md p-4 dark:bg-gray-800">
    <img src="images/%_f_%" alt="%_t_%" class="rounded-t-lg w-full">
    <div class="mt-4">
        <div class="font-bold">Giá: <span class="text-red-500 dark:text-red-400">%_p_% VND</span></div>
        <div class="mt-2"><strong>Thông Tin:</strong> %_t_%</div>
        <div><strong>Còn Lại:</strong> 10</div>
        <button class="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all"
            onclick="openOrderModal({
                name: '%_t_%',
                image: 'images/%_f_%',
                price: '%_p_%',
                info: 'Mẫu %_t_%',
                orderLink: 'https://forms.gle/b8HqUNBo6txgKNcd6'
            })">
            Đặt hàng
        </button>
    </div>
</div>`;

var resultItem = "";

for (var i = 1; i <= itemAmount; i++) {
    let title = config.item_info[i - 1].title;
    let price = new Intl.NumberFormat().format(config.item_info[i - 1].price);
    let file = config.item_info[i - 1].file;

    let item = defaultHTML.replaceAll("%_t_%", title);
    item = item.replaceAll("%_p_%", price);
    item = item.replaceAll("%_f_%", file);


    resultItem += item;
}

listItem.innerHTML = resultItem;

// Đặt hàng

const orderModal = document.getElementById('order-modal');
const modalTitle = document.getElementById('modal-title');
const modalImage = document.getElementById('modal-image');
const modalPrice = document.getElementById('modal-price');
const closeModalButton = document.getElementById('close-modal');
const orderNowButton = document.getElementById('order-now');

function openOrderModal(product) {
    modalTitle.textContent = `Đặt hàng - ${product.name}`;
    modalImage.src = product.image;
    modalPrice.textContent = `Giá: ${product.price} VND`;
    orderModal.classList.remove('hidden');

    // Example of handling the order button (can be customized to redirect or handle form submissions)
    orderNowButton.onclick = () => {
        const fullname = document.getElementById('fullname').value;
        const phone_number = document.getElementById('phone_number').value;
        const address = document.getElementById('address').value;
        const item_amount = parseInt(document.getElementById('item_amount').value);

        if (!fullname || !address || !item_amount) {
            Swal.fire("Thông báo", "Vui lòng điền đầy đủ thông tin!", "error")
            return;
        }

        if (item_amount <= 0 || item_amount > parseInt(document.getElementById('item_amount').max)) {
            Swal.fire("Thông báo", `Số lượng cần lớn hơn 0 và nhỏ hơn ${document.getElementById('item_amount').max}!`, "error")
            return;
        }

        // Tạo dữ liệu đơn hàng (ví dụ đơn giản)
        const orderData = {
            phone_number,
            fullname,
            address,
            item_amount,
            // price: parseInt(product.price.replaceAll(',', '')),
            product: product.name
        };

        // Chuyển đổi dữ liệu thành JSON
        const jsonData = JSON.stringify(orderData);

        // Tạo URL và header
        const url = `/createorder`;
        const headers = {
            'Content-Type': 'application/json'
        };

        // Gửi yêu cầu POST
        fetch(url, {
            method: 'POST',
            headers: headers,
            body: jsonData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                Swal.fire("Thông báo", data.msg, data.status ? "success" : "error")
                
                setTimeout(() => {
                    location.reload()
                }, 2000)
            })
            .catch(error => {
                console.error(error)
                Swal.fire("Thông báo", "Hệ thống đang có vấn đề!", "error")
            });
    };
}

closeModalButton.addEventListener('click', () => {
    orderModal.classList.add('hidden');
});
