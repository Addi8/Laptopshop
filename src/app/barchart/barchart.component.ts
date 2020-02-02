import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
})
export class BarchartComponent implements OnInit {
  @Input() positive: Number;
  @Input() neutral: Number;
  @Input() negative: Number;
  @Input() attribute: String

  public barChartOptions;
  public barChartOptions1;
  public barChartType;
  public barChartData;
  public barChartData1;
  public barChartData2;

  constructor() { }

  ngOnInit() {
    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          stacked: true,
          gridLines: {
            color: 'rgba(0, 0, 0, 0)',
          },
          display: false
        }],
        yAxes: [{
          stacked: true,
          gridLines: {
            color: 'rgba(0, 0, 0, 0)',
          },
          display: false
        }]
      },
      legend: {
        display: false,
      },
      tooltips: {
        callbacks: {
          // label: tooltipItem => `${tooltipItem.yLabel}: ${tooltipItem.xLabel}`,
          title: () => null,
        }
      },
      title: {
        display: true,
        text: this.attribute
      }
    };

    this.barChartType = 'horizontalBar';
    this.barChartData = [
      {
        data: [this.positive],
        barPercentage: 1,
        label: 'Positive',
        barThickness: 6,
        maxBarThickness: 8,
        minBarLength: 2,
        backgroundColor: 'rgb(52, 135, 25)',
        // hoverBackgroundColor: "rgba(50,90,100,1)"
      },
      {
        data: [this.positive],
        barPercentage: 1,
        label: 'Neutral',
        barThickness: 6,
        maxBarThickness: 8,
        minBarLength: 2,
        backgroundColor: 'rgb(250, 135, 25)',
        // hoverBackgroundColor: "rgba(140,85,100,1)"
      },
      {
        data: [this.negative],
        barPercentage: 1,
        label: 'Negative',
        barThickness: 6,
        maxBarThickness: 8,
        minBarLength: 2,
        backgroundColor: 'rgb(192, 0, 0)',
        // hoverBackgroundColor: "rgba(140,85,100,1)"
      }
    ];
  }

}

