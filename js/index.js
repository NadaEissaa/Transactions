document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:4000/api/data'; 
  
    const customerTable = document.getElementById('customerTable').getElementsByTagName('tbody')[0];
    const filterName = document.getElementById('filterName');
    const filterAmount = document.getElementById('filterAmount');
    const plotlyChart = document.getElementById('plotlyChart');
    let data = [];
  
    const fallbackData = {
      customers: [
        {
          "id": 1,
          "name": "Ahmed Ali"
        },
        {
          "id": 2,
          "name": "Aya Elsayed"
        },
        {
          "id": 3,
          "name": "Mina Adel"
        },
        {
          "id": 4,
          "name": "Sarah Reda"
        },
        {
          "id": 5,
          "name": "Mohamed Sayed"
        }
      ],
      transactions: [
        { "id": 1, "customer_id": 1, "date": "2022-01-01", "amount": 1000 },
        { "id": 2, "customer_id": 1, "date": "2022-01-02", "amount": 2000 },
        { "id": 3, "customer_id": 2, "date": "2022-01-01", "amount": 550 },
        { "id": 4, "customer_id": 3, "date": "2022-01-01", "amount": 500 },
        { "id": 5, "customer_id": 2, "date": "2022-01-02", "amount": 1300 },
        { "id": 6, "customer_id": 4, "date": "2022-01-01", "amount": 750 },
        { "id": 7, "customer_id": 3, "date": "2022-01-02", "amount": 1250 },
        { "id": 8, "customer_id": 5, "date": "2022-01-01", "amount": 2500 },
        { "id": 9, "customer_id": 5, "date": "2022-01-02", "amount": 875 }
      ]
    };
  
    async function fetchData() {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        data = await response.json();
        if (!data || !data.customers || !data.transactions) {
          throw new Error('Data structure from server is invalid');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        showErrorMessage('Failed to fetch data from the server. Using fallback data.');
        data = fallbackData;
      }
      displayData(data.customers, data.transactions);
      drawChart(data.transactions); 
    }
  
    function displayData(customers, transactions) {
      customerTable.innerHTML = '';
      transactions.forEach(transaction => {
        const customer = customers.find(c => c.id === transaction.customer_id); 
        const row = customerTable.insertRow();
        row.insertCell(0).textContent = customer ? customer.name : 'Unknown Customer';
        row.insertCell(1).textContent = transaction.amount;
        row.insertCell(2).textContent = transaction.date;
      });
    }
  
    function filterData() {
      const nameFilter = filterName.value.toLowerCase().trim();
      const amountFilter = parseFloat(filterAmount.value) || 0;
      let filteredTransactions = [...data.transactions]; 
  
      if (nameFilter) {
     
        filteredTransactions = filteredTransactions.filter(transaction => {
          const customer = data.customers.find(c => c.id === transaction.customer_id);
          const customerName = customer ? customer.name.toLowerCase() : '';
          return customerName.includes(nameFilter);
        });
      }
  
      if (amountFilter > 0) {

        filteredTransactions = filteredTransactions.filter(transaction => transaction.amount <= amountFilter);
      }
  
      displayData(data.customers, filteredTransactions);
      drawChart(filteredTransactions); 
    }
  
    function drawChart(transactions) {
      const dates = [...new Set(transactions.map(t => t.date))];
      const amounts = dates.map(date =>
        transactions.filter(t => t.date === date).reduce((sum, t) => sum + t.amount, 0)
      );
  
     
      const plotlyData = [{
        x: dates,
        y: amounts,
        type: 'scatter',
        mode: 'lines+markers',
        line: { color: 'rgb(75, 192, 192)' },
        fill: 'tozeroy'
      }];
  
      const plotlyLayout = {
        title: 'Total Transaction Amount',
        xaxis: { title: 'Date' },
        yaxis: { title: 'Amount' }
      };
  

      Plotly.newPlot(plotlyChart, plotlyData, plotlyLayout);
    }
  
    function showErrorMessage(message) {
      const errorMessage = document.createElement('div');
      errorMessage.classList.add('error-message');
      errorMessage.textContent = message;
      document.getElementById('app').appendChild(errorMessage);
    }
  
    filterName.addEventListener('input', filterData);
    filterAmount.addEventListener('input', filterData);
  
    fetchData(); 
  });
  