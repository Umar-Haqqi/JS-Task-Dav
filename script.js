const seacrh_btn = document.querySelector('#seacrh_btn');
const selectAllCheckbox = document.querySelector('#select_all_checkboxes');
const searchTableBody = document.querySelector('.table tbody');
const ScreenTableBody = document.querySelector('#ScreenTableBody');
const closeModalBtn = document.querySelector('#close_modal_btn');
const tdSetQuantityTableBody = document.querySelector('#set_quantity_table_body');

// global variables
let invokeFunction = true;

const checkedRows = [];
const deleteTableRow = []
const modalCheckedDataArray = [];

const fetchData = async () => {
    const response = await fetch('./data.json');
    const data = await response.json();
    // console.log(data);
    return data;
}

function selectAll(checkbox) {
    selectAllCheckbox.addEventListener('click', () => {
        checkbox.checked = !checkbox.checked;
        // renderCheckedDataInTable();

    })
}

const createSeachTableTbody = (data) => {
    const tr = document.createElement('tr');

    const tdCheckbox = document.createElement('td');
    const checkbox = document.createElement('input')
    checkbox.type = 'checkbox';
    tdCheckbox.appendChild(checkbox);

    const tdStockCode = document.createElement('td');
    const tdDescription = document.createElement('td');
    const tdUOM = document.createElement('td');
    const tdCategory = document.createElement('td');
    const tdmaterial = document.createElement('td');
    const tdCoatingCost = document.createElement('td');
    const tdgroup = document.createElement('td');

    tdStockCode.textContent = data.stockCode;
    tdDescription.textContent = data.description;
    tdUOM.textContent = data.uom;
    tdCategory.textContent = data.category;
    tdmaterial.textContent = data.material;
    tdCoatingCost.textContent = data.coatingConst;
    tdgroup.textContent = data.group;

    tr.appendChild(tdCheckbox);
    tr.appendChild(tdStockCode);
    tr.appendChild(tdDescription);
    tr.appendChild(tdUOM);
    tr.appendChild(tdCategory);
    tr.appendChild(tdmaterial);
    tr.appendChild(tdCoatingCost);
    tr.appendChild(tdgroup);

    searchTableBody.appendChild(tr);

    // selectAll(checkbox);

    checkbox.addEventListener('click', () => {
        if (checkbox.checked) {
            // checkbox.checked = false;
            modalCheckedDataArray.push(data);
            checkedRows.push(tr);
            // tr.remove();
        }
    })

}



const renderJsonDataInSeacrhTable = () => {
    fetchData().then(data => {
        data.map((item) => {
            if (invokeFunction) {
                createSeachTableTbody(item);
            }
        })
    })
}

seacrh_btn.addEventListener('click', renderJsonDataInSeacrhTable);


function createScreenTableBody(data) {
    const tr = document.createElement('tr');

    const tdStockCode = document.createElement('td');
    const tdDescription = document.createElement('td');
    const tdUOM = document.createElement('td');
    const tdQuantity = document.createElement('td');
    const tdRemarks = document.createElement('td');
    const tdActions = document.createElement('td');


    tdStockCode.textContent = data.stockCode;
    tdDescription.textContent = data.description;
    tdUOM.textContent = data.uom;

    const totalQuantity = document.createElement('input');
    totalQuantity.type = 'number';
    totalQuantity.disabled = true;
    totalQuantity.value = "";

    const remarksInput = document.createElement('input');
    remarksInput.type = 'text';
    remarksInput.value = "";
    tdRemarks.appendChild(remarksInput);

    const tdSetQuantityModalBtn = `
        <button type="button" class="btn btn-sm btn-success" data-bs-toggle="modal" data-bs-target="#set_Qty_Modal_Btn">Set Quantity</button>
    `

    createtdSetQuantityModal(data);


    const deleteRow = document.createElement('button');
    deleteRow.id = 'deleteTableRow';
    deleteRow.classList.add('btn', 'btn-sm', 'btn-danger');
    deleteRow.textContent = 'Delete';

    // tdActions.appendChild(tdSetQuantityModalBtn);
    tdQuantity.appendChild(totalQuantity);
    tdActions.innerHTML = tdSetQuantityModalBtn;
    tdActions.appendChild(deleteRow);


    tr.appendChild(tdStockCode);
    tr.appendChild(tdDescription);
    tr.appendChild(tdUOM);
    tr.appendChild(tdQuantity);
    tr.appendChild(tdRemarks);
    tr.appendChild(tdActions);

    ScreenTableBody.appendChild(tr);


    // deleting row from screen table
    deleteRow.addEventListener('click', () => {
        if (true) {
            deleteTableRow.push(tr);
            tr.remove();
        }
    })
}


function createtdSetQuantityModal(data) {
    const tr = document.createElement('tr')

    const tdDropdown = document.createElement('td');
    // const 
    const dropdownSelect = document.createElement('select');

    fetchData().then(data => {
        data.map((item) => {
            const dropdownOption = document.createElement('option');
            console.log("thiiiiiiiiiii", item.quantity);
            dropdownOption.value = item.quantity;
            for (let key in item.quantity) {
                dropdownOption.textContent = item.quantity[key];
            };
            dropdownSelect.appendChild(dropdownOption);
        })
    })
    tdDropdown.appendChild(dropdownSelect);


    const tdAvailableQuantity = document.createElement('td');
    const tdAvailableQuantityInput = document.createElement('input');
    tdAvailableQuantityInput.type = 'text';
    tdAvailableQuantityInput.disabled = true;
    tdAvailableQuantityInput.value = data.quantity.level1;

    const tdSetQuantity = document.createElement('td');
    const tdSetQuantityInput = document.createElement('input');
    tdSetQuantityInput.type = 'number';
    tdSetQuantityInput.value = "";

    const tdbuttons = document.createElement('td');

    const addNewRow = document.createElement('button');
    addNewRow.classList.add('btn', 'btn-sm', 'btn-success');
    addNewRow.textContent = '+';

    const deleteRow = document.createElement('button');
    deleteRow.classList.add('btn', 'btn-sm', 'btn-danger');
    deleteRow.textContent = '-';

    tdbuttons.appendChild(addNewRow);
    tdbuttons.appendChild(deleteRow);


    tr.appendChild(tdDropdown);
    tr.appendChild(tdAvailableQuantity);
    tr.appendChild(tdSetQuantity);
    tr.appendChild(tdbuttons);


    tdSetQuantityTableBody.appendChild(tr);
}


function renderCheckedDataInTable() {
    invokeFunction = false;

    console.log("modalCheckedDataArray", modalCheckedDataArray);
    modalCheckedDataArray.map((item) => {
        createScreenTableBody(item);
    })
}

closeModalBtn.addEventListener('click', () => {
    renderCheckedDataInTable();

    // Uncheck checkboxes in the search table
    modalCheckedDataArray.forEach(item => {
        const checkboxes = document.querySelectorAll('.table tbody input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            if (checkbox.dataset.stockCode === item.stockCode) {
                checkbox.checked = false;
            }
        });
    });

    // Remove rows from the screen table by delete button
    checkedRows.forEach(row => {
        row.remove();
    });

    // Clear the modalCheckedDataArray and checkedRows
    modalCheckedDataArray.length = 0;
    checkedRows.length = 0;
});