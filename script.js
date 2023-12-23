const seacrh_btn = document.querySelector('#seacrh_btn');
const selectAllCheckbox = document.querySelector('#select_all_checkboxes');
const searchTableBody = document.querySelector('.table tbody');
const ScreenTableBody = document.querySelector('#ScreenTableBody');
const closeModalBtn = document.querySelector('#close_modal_btn');
const SetQuantityTableBody = document.querySelector('#set_quantity_table_body');
const totQty = document.getElementById('tot_qty');
const saveJsonButton = document.querySelector('#save_json_btn');

// global variables
let invokeFunction = true;

const checkedRows = [];
const deleteTableRow = [];
const modalCheckedDataArray = [];
const setQuantityInputs = [];


const fetchData = async () => {
    const response = await fetch('./data.json');
    const data = await response.json();
    return data;
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


    selectAllCheckbox.addEventListener('click', () => {
        if (selectAllCheckbox.checked) {
            checkbox.checked = true;
            modalCheckedDataArray.push(data);
            checkedRows.push(tr);
        }
        else {
            checkbox.checked = false;
        }
    })

    checkbox.addEventListener('click', () => {
        if (checkbox.checked) {
            modalCheckedDataArray.push(data);
            checkedRows.push(tr);
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
    tdQuantity.id = 'Show_Total_quantity';
    const tdRemarks = document.createElement('td');
    const tdActions = document.createElement('td');

    tdStockCode.textContent = data.stockCode;
    tdDescription.textContent = data.description;
    tdUOM.textContent = data.uom;

    const totalQuantity = document.createElement('input');
    totalQuantity.type = 'number';
    totalQuantity.disabled = true;
    totalQuantity.id = 'quantityIssueInput';

    tdQuantity.appendChild(totalQuantity);

    const remarksInput = document.createElement('input');
    remarksInput.type = 'text';
    remarksInput.value = "";
    tdRemarks.appendChild(remarksInput);

    const tdSetQuantityModalBtn = `
        <button 
        type="button" 
        class="btn btn-sm btn-success" 
        data-bs-toggle="modal" 
        data-bs-target="#set_Qty_Modal_Btn"
        >Set Quantity
        </button>
        `;
    createtdSetQuantityModal(data);

    const deleteRow = document.createElement('button');
    deleteRow.id = 'deleteTableRow';
    deleteRow.classList.add('btn', 'btn-sm', 'btn-danger');
    deleteRow.textContent = 'Delete';

    tdActions.innerHTML = tdSetQuantityModalBtn;
    tdActions.appendChild(deleteRow);

    tr.appendChild(tdStockCode);
    tr.appendChild(tdDescription);
    tr.appendChild(tdUOM);
    tr.appendChild(tdQuantity);
    tr.appendChild(tdRemarks);
    tr.appendChild(tdActions);

    ScreenTableBody.appendChild(tr);

    deleteRow.addEventListener('click', () => {
        if (true) {
            deleteTableRow.push(tr);
            tr.remove();
        }
    })


    // Assuming you already have the saveJsonButton defined
    saveJsonButton.addEventListener('click', () => {
        const tableRows = document.querySelectorAll('#ScreenTableBody tr');
        const jsonDataArray = [];

        tableRows.forEach((row) => {
            const rowData = {
                "Stock Code": row.querySelector('td:nth-child(1)').textContent,
                "Description": row.querySelector('td:nth-child(2)').textContent,
                "UOM": row.querySelector('td:nth-child(3)').textContent,
                "Quantity Issue": totalQuantity.value,
                "Remarks": remarksInput.value,
            };
            jsonDataArray.push(rowData);
        });
        console.log(JSON.stringify(jsonDataArray, null, 2));
    });


}


function createtdSetQuantityModal(data) {
    const tr = document.createElement('tr');

    const tdDropdown = document.createElement('td');
    const dropdownSelect = document.createElement('select');

    const quantityKeys = Object.keys(data.quantity);

    for (let key of quantityKeys) {
        const dropdownOption = document.createElement('option');
        dropdownOption.value = key;
        dropdownOption.textContent = key;
        dropdownSelect.appendChild(dropdownOption);
    }

    // Add an event listener to update the available quantity input
    dropdownSelect.addEventListener('change', function () {
        const selectedKey = this.value;
        tdAvailableQuantityInput.value = data.quantity[selectedKey];
        tdSetQuantityInput.value = "";
    });

    tdDropdown.appendChild(dropdownSelect);
    tr.appendChild(tdDropdown);

    const tdAvailableQuantity = document.createElement('td');
    const tdAvailableQuantityInput = document.createElement('input');
    tdAvailableQuantityInput.type = 'number';
    tdAvailableQuantityInput.disabled = true;
    tdAvailableQuantity.appendChild(tdAvailableQuantityInput);
    tr.appendChild(tdAvailableQuantity);

    const tdSetQuantity = document.createElement('td');
    const tdSetQuantityInput = document.createElement('input');
    tdSetQuantityInput.type = 'number';
    tdSetQuantityInput.value = "";
    tdSetQuantityInput.addEventListener('input', updateTotalQuantity);
    tdSetQuantity.appendChild(tdSetQuantityInput);
    tr.appendChild(tdSetQuantity);

    setQuantityInputs.push(tdSetQuantityInput);

    // Add event listener to validate set quantity
    tdSetQuantityInput.addEventListener('input', function () {
        const setQuantityValue = parseFloat(this.value);
        const availableQuantityValue = parseFloat(tdAvailableQuantityInput.value);

        if (isNaN(setQuantityValue) || setQuantityValue > availableQuantityValue) {
            this.value = "";
        }
    });

    // Prevent scrolling beyond available quantity
    tdSetQuantityInput.addEventListener('wheel', function (event) {
        const setQuantityValue = parseFloat(this.value);
        const availableQuantityValue = parseFloat(tdAvailableQuantityInput.value);

        if (event.deltaY > 0 && setQuantityValue >= availableQuantityValue) {
            // Scrolling down and set quantity is already at or above available quantity
            event.preventDefault();
        } else if (event.deltaY < 0 && setQuantityValue === availableQuantityValue) {
            // Scrolling up and set quantity is at available quantity
            event.preventDefault();
        }
    });

    // Prevent incrementing beyond available quantity using up arrow key
    tdSetQuantityInput.addEventListener('keydown', function (event) {
        const setQuantityValue = parseFloat(this.value);
        const availableQuantityValue = parseFloat(tdAvailableQuantityInput.value);

        if (event.key === 'ArrowUp' && setQuantityValue >= availableQuantityValue) {
            // Up arrow key pressed and set quantity is already at or above available quantity
            event.preventDefault();
        }
    });

    const tdbuttons = document.createElement('td');

    const addNewRow = document.createElement('button');
    addNewRow.classList.add('btn', 'btn-sm', 'btn-success', 'mx-1');
    addNewRow.textContent = '+';
    tdbuttons.appendChild(addNewRow);

    const removeRow = document.createElement('button');
    removeRow.classList.add('btn', 'btn-sm', 'btn-danger');
    removeRow.textContent = '-';
    tdbuttons.appendChild(removeRow);

    addNewRow.addEventListener('click', () => {
        createtdSetQuantityModal(data);
    })

    removeRow.addEventListener('click', () => {
        tr.remove();
    })

    tr.appendChild(tdbuttons);

    SetQuantityTableBody.appendChild(tr);
}

function updateTotalQuantity() {
    // Calculate the sum of all tdSetQuantityInput values
    const totalQuantity = setQuantityInputs.reduce((sum, input) => {
        const value = parseFloat(input.value) || 0;
        return sum + value;
    }, 0);

    totQty.innerHTML = `Total Quantity: ${totalQuantity}`;

    const quantityIssueInput = document.getElementById('quantityIssueInput');
    quantityIssueInput.value = totalQuantity;
}


function renderCheckedDataInTable() {
    invokeFunction = false;

    // console.log("modalCheckedDataArray", modalCheckedDataArray);
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

    checkedRows.forEach(row => {
        row.remove();
    });

    // Clear the modalCheckedDataArray and checkedRows
    modalCheckedDataArray.length = 0;
    checkedRows.length = 0;
});