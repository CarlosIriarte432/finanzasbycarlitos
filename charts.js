// charts.js

// 1. Referencia al lienzo del HTML
const ctxBalance = document.getElementById('graficoBalance').getContext('2d');

const mesesTexto = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// 2. Inicializar el gráfico vacío (se mostrará vacío hasta que el usuario inicie sesión)
const chartBalance = new Chart(ctxBalance, {
    type: 'line',
    data: {
        labels: mesesTexto, // Las 12 etiquetas de los meses en el eje X
        datasets: [{
            label: 'Saldo Mensual ($)',
            data: new Array(12).fill(0), // [0, 0, 0, ..., 0]
            borderColor: '#22c55e',       // Línea verde brillante (combinando con tus estilos)
            backgroundColor: 'rgba(34, 197, 94, 0.1)', // Relleno translúcido
            borderWidth: 3,
            tension: 0.3,                 // Curva suave elegante
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#e2e8f0' // Color del texto de la leyenda para modo oscuro
                }
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#94a3b8' }
            },
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#94a3b8' },
                beginAtZero: true
            }
        }
    }
});

/**
 * Procesa la lista de movimientos y actualiza el gráfico de líneas
 * @param {Array} listaMovimientos - Array de objetos de movimientos de Firestore
 */
export function actualizarGraficoBalance(listaMovimientos) {
    // Array para acumular ingresos y gastos por mes [0 al 11]
    const saldosPorMes = new Array(12).fill(0);

    listaMovimientos.forEach(mov => {
        // En tu app.js guardas el formato "YYYY-MM" en mov.mes (ej: "2026-03")
        if (!mov.mes) return;

        const [anio, stringMes] = mov.mes.split("-");
        const indiceMes = Number(stringMes) - 1; // Convertir "03" a index 2 (Marzo)

        const monto = Number(mov.monto) || 0;

        if (mov.tipo === 'ingreso') {
            saldosPorMes[indiceMes] += monto;
        } else if (mov.tipo === 'gasto') {
            saldosPorMes[indiceMes] -= monto;
        }
    });

    // Pasamos los nuevos datos procesados al dataset de Chart.js
    chartBalance.data.datasets[0].data = saldosPorMes;
    
    // Redibujar el gráfico animado
    chartBalance.update();
}