// dashboard.js

async function fetchFinancialData() {
    const userId = 'USER_ID'; // Replace with unique user identifier logic
    const response = await fetch('/transactions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
    });
    
    if (response.ok) {
        const data = await response.json();
        const transactions = data.transactions; // Get the transactions from the response
        const totalIncome = calculateTotalIncome(transactions);
        const totalExpenses = calculateTotalExpenses(transactions);
        const netSavings = totalIncome - totalExpenses;

        document.getElementById('total-income').textContent = totalIncome.toFixed(2);
        document.getElementById('total-expenses').textContent = totalExpenses.toFixed(2);
        document.getElementById('net-savings').textContent = netSavings.toFixed(2);
    } else {
        console.error('Error fetching financial data:', response.statusText);
    }
}

function calculateTotalIncome(transactions) {
    // Implement logic to calculate total income from transactions
    return transactions
        .filter(tx => tx.amount > 0) // Assuming positive amounts are income
        .reduce((sum, tx) => sum + tx.amount, 0);
}

function calculateTotalExpenses(transactions) {
    // Implement logic to calculate total expenses from transactions
    return transactions
        .filter(tx => tx.amount < 0) // Assuming negative amounts are expenses
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
}

// Call the function to fetch and display financial data
fetchFinancialData();
