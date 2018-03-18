import React, { Component } from "react";
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from "recharts";
import { Navbar, NavbarGroup, NavbarHeading, Switch } from "@blueprintjs/core";

import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.getData = this.getData.bind(this);
    this.updateGraphs = this.updateGraphs.bind(this);
    this.updateSwitch = this.updateSwitch.bind(this);
    this.chartData = [];
    this.state = {
      data: [],
      switches: [],
      lines: [],
      dataFields: [
        { name: "Kinakujan silta", display: true, color: "blue" },
        { name: "JK-1", display: false, color: "red" },
        { name: "PP-1", display: false, color: "black" },
        { name: "Matkakeskus", display: false, color: "green" },
        { name: "Satama", display: false, color: "orange" },
        { name: "JK-2", display: false, color: "cadetblue" },
        { name: "PP-2", display: false, color: "indigo" },
        { name: "Tourula", display: false, color: "lightslategray" },
        { name: "JK-3", display: false, color: "mediumspringgreen" },
        { name: "PP-3", display: false, color: "olivedrab" },
        { name: "Vaajakoskentie_Jyskä", display: false, color: "sandybrown" }
      ]
    };
  }
  componentDidMount() {
    this.getData();
    this.getSwitches();
    this.updateGraphs();
  }
  getData() {
    fetch("https://api.jyps.fi/api/data/v1/cyclistdata")
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
          return null;
        });
        this.setState({ data: this.chartData });
      })
      .catch(error => {
        console.warn("rekt :( " + error);
      });
  }
  updateGraphs() {
    let lines = [];
    this.state.dataFields.map(item => {
      if (item.display === true) {
        lines.push(
          <Line
            type="monotone"
            key={item.name}
            dataKey={item.name}
            stroke={item.color}
            dot={false}
            activeDot={{ r: 0 }}
          />
        );
      }
      return null;
    });
    this.setState({ lines: lines });
  }
  getSwitches() {
    let switches = [];
    this.state.dataFields.map(field => {
      switches.push(
        <Switch
          checked={field.display}
          key={field.name}
          label={field.name}
          onChange={() => {
            this.updateSwitch(field.name);
          }}
        />
      );
      return null;
    });
    this.setState({ switches: switches });
  }
  updateSwitch(value) {
    let df = this.state.dataFields;
    let field = df.find(o => o.name === value);
    if (field !== undefined) {
      field.display = !field.display;
    }
    this.setState({ dataFields: df });
    this.updateGraphs();
    this.getSwitches();
  }
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
            {this.state.lines}
          </LineChart>
        </div>
        <span>{this.state.switches}</span>
        <br />
        <div className="footer">
          <span>Jyväskylän kaupungin pyöräilydata - Timo Kaipiainen & Jyps Ry / 2018</span>
          <br />
          <span>
            Datalähde: <a href="http://data.jyvaskyla.fi/data.php">Jyväskylän avoin data </a>
          </span>
          <br />
          [<a href="https://www.github.com/kaipi/jyps-pyorailydata">GitHub</a>]
        </div>
      </div>
    );
  }
}
export default App;
