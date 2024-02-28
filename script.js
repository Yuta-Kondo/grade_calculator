document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('exactScore').addEventListener('change', toggleScoreInput);
    document.getElementById('rangeScore').addEventListener('change', toggleScoreInput);
    document.getElementById('activities-list').innerHTML = '<p>No activities added yet.</p>';
});

function toggleScoreInput() {
    const scoreInput = document.getElementById('exact-score-input');
    const rangeInputs = document.getElementById('score-range-inputs');
    
    if (document.getElementById('exactScore').checked) {
        scoreInput.style.display = 'block';
        rangeInputs.style.display = 'none';
    } else {
        scoreInput.style.display = 'none';
        rangeInputs.style.display = 'block';
    }
}

let activities = [];

function addActivity() {
    const scoreInput = document.getElementById('current-score');
    const minScoreInput = document.getElementById('min-score');
    const maxScoreInput = document.getElementById('max-score');
    const weightInput = document.getElementById('activity-weight');
    const weight = parseFloat(weightInput.value);
    let score, minScore, maxScore;

    if (document.getElementById('exactScore').checked) {
        score = parseFloat(scoreInput.value);
        if (score) {
            activities.push({ score: score, weight: weight });
        }
    } else {
        minScore = parseFloat(minScoreInput.value);
        maxScore = parseFloat(maxScoreInput.value);
        if (minScore && maxScore) {
            activities.push({ minScore: minScore, maxScore: maxScore, weight: weight});
        }
    }

    if ((score || (minScore && maxScore)) && weight) {
        displayActivities();
        scoreInput.value = '';
        minScoreInput.value = '';
        maxScoreInput.value = '';
        weightInput.value = '';
    } else {
        alert("Please enter all required fields for the activity.");
    }
}

function displayActivities() {
    const list = document.getElementById('activities-list');
    list.innerHTML = '<h3>Added Activities</h3>';
    activities.forEach((activity, index) => {
        const activityEntry = document.createElement('div');
        const scoreText = activity.score !== undefined ?
            `Score = ${activity.score}%` :
            `Score Range = ${activity.minScore}% - ${activity.maxScore}%`;
        activityEntry.innerHTML = `<p>Activity ${index + 1}: ${scoreText}, Weight = ${activity.weight}% <button onclick="deleteActivity(${index})">Delete</button></p>`;
        list.appendChild(activityEntry);
    });
}
    
function deleteActivity(index) {
    activities.splice(index, 1);
    displayActivities();
}
    
function calculateGrade() {
    let totalWeight = 0;
    let totalFixedScore = 0;
    let totalMinScore = 0;
    let totalMaxScore = 0;

    // Sum up the scores based on whether they're fixed or ranges
    activities.forEach(activity => {
        totalWeight += activity.weight;
        if (activity.score !== undefined) {
            // Fixed score, add to both min and max totals
            totalFixedScore += activity.score * (activity.weight / 100);
            totalMinScore += activity.score * (activity.weight / 100);
            totalMaxScore += activity.score * (activity.weight / 100);
        } else {
            // Variable score, add to min and max totals separately
            totalMinScore += activity.minScore * (activity.weight / 100);
            totalMaxScore += activity.maxScore * (activity.weight / 100);
        }
    });

    // Check if the total weight is valid
    if (totalWeight > 100) {
        document.getElementById('result').innerText = "The total weight cannot exceed 100%. Please adjust the weights.";
        return;
    }

    const desiredGrade = parseFloat(document.getElementById('desired-grade').value);
    const remainingWeight = 100 - totalWeight;
    
    // Handle cases when no remaining weight is left
    if (remainingWeight <= 0) {
        document.getElementById('result').innerText = "All activities added up to 100%. No remaining activities to calculate.";
        return;
    }
    
    // Calculate the required scores for the remaining weight
    const minRequiredScore = (desiredGrade - totalMinScore) / (remainingWeight / 100);
    const maxRequiredScore = (desiredGrade - totalMaxScore) / (remainingWeight / 100);

    let resultText = '';
    if (minRequiredScore <= 0 && maxRequiredScore <= 0) {
        resultText = "Congratulations! You've already achieved your desired grade.";
    } else {
        resultText = `To achieve your desired grade of ${desiredGrade}%, `;
        if (minRequiredScore > 0) {
            resultText += `if you get the minimum expected scores, you need at least ${minRequiredScore.toFixed(2)}% on the remaining weight. `;
        } else {
            resultText += "you do not need any more points for the minimum expected scores. ";
        }
        if (maxRequiredScore > 0) {
            resultText += `If you get the maximum expected scores, you need at least ${maxRequiredScore.toFixed(2)}% on the remaining weight.`;
        } else {
            resultText += "you do not need any more points for the maximum expected scores.";
        }
    }

    document.getElementById('result').innerText = resultText;
}

