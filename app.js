let friends = [];

function addFriend() {
    const friendName = document.getElementById('friendName').value;
    if (friendName) {
        friends.push({ name: friendName, points: 0 });
        document.getElementById('friendName').value = '';
        updateTable();
    }
}

function updatePoints(index, change) {
    friends[index].points += change;
    updateTable();
}

function updateTable() {
    friends.sort((a, b) => b.points - a.points);
    const tableBody = document.getElementById('friendsTable');
    tableBody.innerHTML = '';
    friends.forEach((friend, index) => {
        const row = `<tr>
                        <td>${friend.name}</td>
                        <td>${friend.points}</td>
                        <td>
                            <button onclick="updatePoints(${index}, 1)">+1</button>
                            <button onclick="updatePoints(${index}, 5)">+5</button>
                            <button onclick="updatePoints(${index}, -1)">-1</button>
                            <button onclick="updatePoints(${index}, -5)">-5</button>
                        </td>
                    </tr>`;
        tableBody.innerHTML += row;
    });
}

updateTable();
