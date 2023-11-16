let activities = [];

function addActivity() {
    const score = document.getElementById('current-score').value;
    const weight = document.getElementById('activity-weight').value;

    if (score && weight) {
        activities.push({ score: parseFloat(score), weight: parseFloat(weight) });
        displayActivities();
        document.getElementById('current-score').value = '';
        document.getElementById('activity-weight').value = '';
    } else {
        alert("Please enter both score and weight");
    }
}

function displayActivities() {
    const list = document.getElementById('activities-list');
    list.innerHTML = '<h3>Added Activities</h3>';
    activities.forEach((activity, index) => {
        list.innerHTML += `<p>Activity ${index + 1}: Score = ${activity.score}%, Weight = ${activity.weight}%</p>`;
    });
}

function calculateGrade() {
    const desiredGrade = parseFloat(document.getElementById('desired-grade').value);
    let totalWeight = 0;
    let weightedScoreSum = 0;

    activities.forEach(activity => {
        weightedScoreSum += activity.score * (activity.weight / 100);
        totalWeight += activity.weight;
    });

    const remainingWeight = 100 - totalWeight;
    const requiredScore = (desiredGrade - weightedScoreSum) / (remainingWeight / 100);

    document.getElementById('result').innerText = requiredScore > 0 ? 
        `You need to score ${requiredScore.toFixed(2)}% on the remaining ${remainingWeight.toFixed(2)}%` : 
        "Congratulations! You've already achieved your desired grade.";
}

window.onload = () => {
    document.getElementById('activities-list').innerHTML = '<p>No activities added yet.</p>';
};
