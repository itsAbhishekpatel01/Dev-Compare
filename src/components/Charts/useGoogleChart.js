import { useEffect } from 'react';

const useGoogleChart = (chartType, data, options, chartId) => {
  useEffect(() => {
    // Load the specific chart package if it hasn't been loaded yet
    if (!google.visualization.charts[chartType]) {
      google.charts.load('current', { packages: [chartType] });
    }

    google.charts.setOnLoadCallback(() => {
      const chartData = google.visualization.arrayToDataTable(data);
      const chart = new google.visualization[chartType](
        document.getElementById(chartId)
      );
      chart.draw(chartData, options);
    });
  }, [chartType, data, options, chartId]); // Dependencies
};

export default useGoogleChart;
