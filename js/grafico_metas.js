    // Dados para o gráfico
    const ctx = document.getElementById('graficoGeral').getContext('2d');
    const graficoGeral = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['2019','2020','2021', '2022', '2023', '2024', '2025'],
        datasets: [{
          label: 'Toneladas Arrecadadas',
          data: [10, 12, 14, 16, 18, 20, 22], /* Toneladas Arrecadas */
          backgroundColor: [
            '#034794',
            '#0056b3',
            '#f7d708',
            '#f76b07',
            '#28a745',
            '#6f42c1',
            '#d11507',
            '#20c997',
            '#ff5733',
            '#ffc107'
          ],
          borderColor: [
            '#034794',
            '#0056b3',
            '#f7d708',
            '#f76b07',
            '#28a745',
            '#6f42c1',
            '#d11507',
            '#20c997',
            '#ff5733',
            '#ffc107'
          ],
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#f7d708',
            borderWidth: 1
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Toneladas',
              color: '#333',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Anos',
              color: '#333',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            grid: {
            display: false
          }
        }
      },
      animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  }
});