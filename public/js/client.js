// script that runs on client side

let cardsLength = parseInt(document.getElementById("cards").getAttribute("numCards"));

// predefined color combinations
const colorCombinations = [['#F49F05', '#36688D'], ['#132226', '#BE9063'], ['#F3E96B', '#6975a6'], ['#F46A4E', '#5C4A72']];

/* goes through the list of all card elements
   collect properties: total, overlap and name needed for chart rendering
   create pie chart for each card
 */
for(let i = 0; i < cardsLength; i++) {
    let currentCard = document.getElementById("card_"+i);

    const total = currentCard.getAttribute("total");
    const overlap = currentCard.getAttribute("overlap");
    const name = currentCard.getAttribute("name");

    const currentChartCanvas = document.getElementById("chart_"+i);
    const chartCtx = currentChartCanvas.getContext("2d");
    const currentChartData = {
        labels: ['Overlap', 'Total'],
        datasets: [{
            label: 'Overlap statistics',
            backgroundColor: colorCombinations[i],
            data: [overlap, total]
        }]
    }

    new Chart(chartCtx, {
        type: 'pie',
        data: currentChartData,
        options: {
            title: {
                display: true,
                text: name
            }
        }
    });
}

