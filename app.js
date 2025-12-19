// ข้อมูลเริ่มต้นตามที่คุณกำหนด
let parts = [
    { id: 'SKU-001', name: 'น็อตตัวเมีย', stock: 10, min: 5 },
    { id: 'SKU-002', name: 'น็อตตัวผู้', stock: 20, min: 5 }
];

let logs = [];

// ฟังก์ชันแสดงผลตารางและ Dropdown
function renderSystem() {
    const tableBody = document.getElementById('stockTable');
    const withdrawSelect = document.getElementById('partSelect');
    const restockSelect = document.getElementById('restockSelect');
    
    tableBody.innerHTML = '';
    withdrawSelect.innerHTML = '<option value="">-- เลือกอะไหล่ --</option>';
    restockSelect.innerHTML = '<option value="">-- เลือกอะไหล่ --</option>';

    parts.forEach((item, index) => {
        // อัปเดตตารางคงเหลือ
        const isLow = item.stock <= item.min;
        const row = `
            <tr class="hover:bg-gray-50 transition">
                <td class="p-4 border-b font-medium">${item.name}</td>
                <td class="p-4 border-b text-center font-bold ${isLow ? 'text-red-500' : 'text-blue-600'}">${item.stock} ตัว</td>
                <td class="p-4 border-b text-center">
                    <span class="px-3 py-1 rounded-full text-[10px] font-bold ${isLow ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}">
                        ${isLow ? '⚠️ ควรเติมของ' : '✅ ปกติ'}
                    </span>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;

        // เติมข้อมูลใน Dropdown
        const option = `<option value="${index}">${item.name}</option>`;
        withdrawSelect.innerHTML += option;
        restockSelect.innerHTML += option;
    });
}

// ฟังก์ชันสำหรับพนักงาน "เบิกของ"
function handleWithdraw() {
    const index = document.getElementById('partSelect').value;
    const qty = parseInt(document.getElementById('withdrawQty').value);

    if (index === "" || isNaN(qty) || qty <= 0) {
        alert("กรุณาระบุข้อมูลให้ครบถ้วน");
        return;
    }

    if (parts[index].stock >= qty) {
        parts[index].stock -= qty;
        addLog(`เบิก ${parts[index].name} ออกไป ${qty} ตัว`, 'out');
        document.getElementById('withdrawQty').value = ""; // ล้างช่องกรอก
        renderSystem();
        alert("เบิกสำเร็จ!");
    } else {
        alert("ขออภัย: สินค้าในสต็อกไม่เพียงพอต่อการเบิก");
    }
}

// ฟังก์ชันสำหรับแอดมิน "เติมของ"
function handleRestock() {
    const index = document.getElementById('restockSelect').value;
    const qty = parseInt(document.getElementById('restockQty').value);

    if (index === "" || isNaN(qty) || qty <= 0) {
        alert("กรุณาเลือกอะไหล่และจำนวนที่ต้องการเติม");
        return;
    }

    parts[index].stock += qty;
    addLog(`เติม ${parts[index].name} เข้าสต็อก ${qty} ตัว`, 'in');
    document.getElementById('restockQty').value = ""; // ล้างช่องกรอก
    renderSystem();
    alert(`เติม ${parts[index].name} เรียบร้อย!`);
}

// ฟังก์ชันบันทึกประวัติ
function addLog(message, type) {
    const time = new Date().toLocaleTimeString();
    const color = type === 'in' ? 'text-green-600' : 'text-orange-600';
    const icon = type === 'in' ? '➕' : '➖';
    logs.unshift(`<div class="p-2 border-b font-medium ${color}">${icon} [${time}] ${message}</div>`);
    
    document.getElementById('historyLog').innerHTML = logs.join('');
}

// ฟังก์ชันเปิด-ปิด แผงแอดมิน
function toggleAdmin() {
    const panel = document.getElementById('adminPanel');
    panel.classList.toggle('hidden');
}

// รันครั้งแรกเมื่อเปิดเว็บ
renderSystem();