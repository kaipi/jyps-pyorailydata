import React, { Component } from "react";
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from "recharts";
import { Navbar, NavbarGroup, NavbarHeading, Icon } from "@blueprintjs/core";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.getData = this.getData.bind(this);
    this.chartData = [];
    this.state = {
      data: []
    };
  }
  componentDidMount() {
    this.getData();
  }
  getData() {
    fetch("http://api.jyps.fi/api/data/v1/cyclistdata")
      .then(response => {
        return response.json();
      })
      .then(data => {
        data.map(item => {
          let found = this.chartData.find(o => o.date === item.date);
          if (found === undefined) {
            this.chartData.push({ date: item.date, [item.location]: item.cyclist_qty });
          } else {
            found[item.location] = item.cyclist_qty;
          }
        });
        this.setState({ data: this.chartData });
      })
      .catch(error => {
        console.warn("rekt :( " + error);
      });
  }
  updateGraphs() {}
  getGraph() {}
  render() {
    return (
      <div className="App">
        <Navbar className="pt-dark">
          <NavbarGroup>
            <NavbarHeading>Jyväskylän pyöräilydata</NavbarHeading>
          </NavbarGroup>
        </Navbar>
        <div className="chart-container">
          <LineChart width={1200} height={400} data={this.state.data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Satama" stroke="#8884d8" dot={false} activeDot={{ r: 0 }} />
            <Line type="monotone" dataKey="PP-1" stroke="#82ca9d" dot={false} activeDot={{ r: 0 }} />
          </LineChart>
        </div>
        <span>Jyväskylän kaupungin pyöräilydata - Timo Kaipiainen & Jyps Ry / 2018</span>
        <br />
        <span>
          Datalähde: <a href="http://data.jyvaskyla.fi/data.php">Jyväskylän avoin data </a>
        </span>
        <br />
        [<a href="https://www.github.com/kaipi/jyps-pyorailydata">GitHub</a>]
      </div>
    );
  }
}
export default App;
