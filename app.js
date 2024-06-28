let friends = [];
let historyLog = [];

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
    friends.forEach((friend, index) => {
        const row = `<tr>
                        <td>${friend.name}</td>
                        <td><input type="number" value="${friend.points}" onchange="updatePointsManually(${index}, parseInt(this.value))"></td>
                        <td>
                            <button onclick="updatePoints(${index}, 1)">+1</button>
                            <button onclick="updatePoints(${index}, 5)">+5</button>
                            <button onclick="updatePoints(${index}, -1)">-1</button>
                            <button onclick="updatePoints(${index}, -5)">-5</button>
                            <button onclick="removeFriend(${index})">Remove</button>
                        </td>
                    </tr>`;
        tableBody.innerHTML += row;
    });
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

// Initial load of data when the page is loaded
loadDataFromLocal();
