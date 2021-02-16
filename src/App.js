import React, { useState, useEffect } from 'react';
import './App.css';
import {FormControl, Select, MenuItem, Card} from '@material-ui/core'
import InfoBox from './InfoBox';
import LineGraph from './LineGraph';
import Table from './Table';
import Map from './Map';
import {sortData, prettyPrintStat} from './util.js';
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(['worldwide']);
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 22.060691462628547,
    lng: 83.73040960386805
  });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCaseType] = useState("cases");

  useEffect( () => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  }, [])

  useEffect( () => {
    const getCountryData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then( (response) => response.json())
        .then( (data) => {
          const countries = data.map( (country) => ({
            name: country.country,
            value: country.countryInfo.iso2
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);

        });
    };

    getCountryData();
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    // console.log(event.target.value);
    setCountry(countryCode);

    const url = countryCode == 'worldwide' 
                          ? 'https://disease.sh/v3/covid-19/all' 
                          : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
    
    await fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(countryCode);
      setCountry(countryCode);
      console.log(countryCode);
      setCountryInfo(data);
      // console.log(data.countryInfo.lat, data.countryInfo.long);
      setMapCenter([ data.countryInfo.lat, data.countryInfo.long ]);
      setMapZoom(4);
      // console.log(mapCenter, mapZoom);
      // console.log(mapZoom);

    });
    
  };

  // console.log(countryInfo);
  // console.log(mapZoom);
  // console.log(mapCenter, mapZoom);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" value={country} onChange={onCountryChange}> 
              
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => {
                return ( <MenuItem value={country.value}> {country.name} </MenuItem> );
              })}
            </Select>
          </FormControl>
        </div>
        
        <div className="app__stats">
              <InfoBox 
                isRed
                active={casesType === "cases"}
                onClick={(e) => setCaseType("cases")}
                title="CoronaVirus Cases" 
                total={prettyPrintStat(countryInfo.cases)} 
                cases={prettyPrintStat(countryInfo.todayCases)}/>
              <InfoBox 
                active={casesType === "recovered"}
                onClick={(e) => setCaseType("recovered")}
                title="Recovery Cases" 
                total={prettyPrintStat(countryInfo.recovered)} 
                cases={prettyPrintStat(countryInfo.todayRecovered)}/>
              <InfoBox 
                isRed
                active={casesType === "deaths"}
                onClick={(e) => setCaseType("deaths")}
                title="Deaths" 
                total={prettyPrintStat(countryInfo.deaths)} 
                cases={prettyPrintStat(countryInfo.todayDeaths)}/>
        </div>


        {/* {console.log(mapZoom)} */}
        <Map 
          casesType={casesType}
          countries={mapCountries}
          // casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
              <h3>Live Cases By Country</h3>
              <Table countries={tableData}/>
              <h3>WorldWide New {casesType}</h3>
              <LineGraph className="app__graph" casesType={casesType}/>
      </Card>
    </div>
  );
}

export default App;