let friends = [];
let historyLog = [];
let currentPage = 1;
const rowsPerPage = document.getElementById('rowsPerPage').value;

// Function to add a friend
function addFriend() {
    const friendName = document.getElementById('friendName').value;
    if (friendName) {
        friends.push({ name: friendName, points: 0 });
        document.getElementById('friendName').value = '';
        historyLog.push(`Added ${friendName}`);
        updateTable();
        updateHistory();
        saveDataToLocal();
    }
}

// Function to update points
function updatePoints(index, change) {
    const friend = friends[index];
    friend.points += change;
    historyLog.push(`Updated ${friend.name}'s points by ${change} (total: ${friend.points})`);
    updateTable();
    updateHistory();
    saveDataToLocal();
}

// Function to remove a friend
function removeFriend(index) {
    const friend = friends.splice(index, 1)[0];
    historyLog.push(`Removed ${friend.name}`);
    updateTable();
    updateHistory();
    saveDataToLocal();
}

// Function to update points manually
function updatePointsManually(index, newValue) {
    const friend = friends[index];
    const oldValue = friend.points;
    friend.points = newValue;
    historyLog.push(`Manually updated ${friend.name}'s points from ${oldValue} to ${newValue}`);
    updateTable();
    updateHistory();
    saveDataToLocal();
}

// Function to update the table with friends data
function updateTable() {
    friends.sort((a, b) => b.points - a.points);
    const tableBody = document.getElementById('friendsTable');
    tableBody.innerHTML = '';
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedFriends = friends.slice(start, end);

    paginatedFriends.forEach((friend, index) => {
        const row = `<tr>
                        <td>${friend.name}</td>
                        <td><input type="number" value="${friend.points}" onchange="updatePointsManually(${start + index}, parseInt(this.value))"></td>
                        <td>
                            <button class="action-button" onclick="updatePoints(${start + index}, 1)">+1</button>
                            <button class="action-button" onclick="updatePoints(${start + index}, 5)">+5</button>
                            <button class="action-button" onclick="updatePoints(${start + index}, -1)">-1</button>
                            <button class="action-button" onclick="updatePoints(${start + index}, -5)">-5</button>
                            <button class="remove-button" onclick="removeFriend(${start + index})">Remove</button>
                        </td>
                    </tr>`;
        tableBody.innerHTML += row;
    });

    document.getElementById('pageInfo').innerText = `Page ${currentPage} of ${Math.ceil(friends.length / rowsPerPage)}`;
}

// Function to filter the table
function filterTable() {
    const filterValue = document.getElementById('filterInput').value.toLowerCase();
    const filteredFriends = friends.filter(friend => friend.name.toLowerCase().includes(filterValue));
    currentPage = 1; // Reset to first page on filter change
    updateTableWithFilter(filteredFriends);
}

function updateTableWithFilter(filteredFriends) {
    const tableBody = document.getElementById('friendsTable');
    tableBody.innerHTML = '';
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedFriends = filteredFriends.slice(start, end);

    paginatedFriends.forEach((friend, index) => {
        const row = `<tr>
                        <td>${friend.name}</td>
                        <td><input type="number" value="${friend.points}" onchange="updatePointsManually(${start + index}, parseInt(this.value))"></td>
                        <td>
                            <button class="action-button" onclick="updatePoints(${start + index}, 1)">+1</button>
                            <button class="action-button" onclick="updatePoints(${start + index}, 5)">+5</button>
                            <button class="action-button" onclick="updatePoints(${start + index}, -1)">-1</button>
                            <button class="action-button" onclick="updatePoints(${start + index}, -5)">-5</button>
                            <button class="remove-button" onclick="removeFriend(${start + index})">Remove</button>
                        </td>
                    </tr>`;
        tableBody.innerHTML += row;
    });

    document.getElementById('pageInfo').innerText = `Page ${currentPage} of ${Math.ceil(filteredFriends.length / rowsPerPage)}`;
}

// Function to handle pagination
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        updateTable();
    }
}

function nextPage() {
    if (currentPage * rowsPerPage < friends.length) {
        currentPage++;
        updateTable();
    }
}

// Function to update the history log
function updateHistory() {
    const historyList = document.getElementById('historyLog');
    historyList.innerHTML = '';
    historyLog.forEach(entry => {
        const listItem = `<li>${entry}</li>`;
        historyList.innerHTML += listItem;
    });
}

// Function to save data to local storage
function saveDataToLocal() {
    localStorage.setItem('friendsData', JSON.stringify(friends));
    localStorage.setItem('historyLog', JSON.stringify(historyLog));
}

// Function to load data from local storage
function loadDataFromLocal() {
    const friendsData = localStorage.getItem('friendsData');
    const historyData = localStorage.getItem('historyLog');
    if (friendsData) {
        friends = JSON.parse(friendsData);
        updateTable();
    }
    if (historyData) {
        historyLog = JSON.parse(historyData);
        updateHistory();
    }
}

// Function to export data as a JSON file
function exportData() {
    const data = {
        friends: friends,
        historyLog: historyLog
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'friendship_data.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Function to import data from a JSON file
function importData(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const contents = e.target.result;
        const data = JSON.parse(contents);
        if (data && data.friends && data.historyLog) {
            friends = data.friends;
            historyLog = data.historyLog;
            updateTable();
            updateHistory();
            saveDataToLocal();
        } else {
            alert('Invalid file format. Please select a valid JSON file.');
        }
    };
    reader.readAsText(file);
}

// Event listener for file input change
document.getElementById('fileInput').addEventListener('change', importData);

// Initial load of data when the page is loaded
loadDataFromLocal();
