import React, { useState, useEffect } from 'react';

const SearchInput = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [countryData, setCountryData] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

    useEffect(() => {
        const fetchCountryData = async () => {
            try {
                const response = await fetch('https://studies.cs.helsinki.fi/restcountries/api/all');
                const data = await response.json();
                setCountryData(data);
            } catch (error) {
                console.error('Error fetching country data:', error);
            }
        };

        fetchCountryData();
    }, []);

    useEffect(() => {
        if (searchQuery.length > 0) {
            const matchingCountries = countryData.filter(country =>
                country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (matchingCountries.length > 10) {
                setMessage('Too many matches, please be more specific.');
                setSearchResults([]);
            } else {
                setMessage('');
                setSearchResults(matchingCountries);
            }
        } else {
            setMessage('');
            setSearchResults([]);
        }
    }, [searchQuery, countryData]);

    useEffect(() => {
        if (selectedCountry) {
            const fetchWeatherData = async () => {
                try {
                    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${selectedCountry.capital}&units=metric&appid=${apiKey}`);
                    const data = await response.json();
                    console.log(data)
                    setWeatherData(data);
                } catch (error) {
                    console.error('Error fetching weather data:', error);
                }
            };

            fetchWeatherData();
        }
    }, [selectedCountry]);

    const handleCountryClick = (country) => {
        setSelectedCountry(country);
    };

    return (
        <div>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter a country name"
            />
            {searchQuery.length > 0 && <p>{message}</p>}
            <div>
                {searchResults.length > 0 && (
                    <ul>
                        {searchResults.map(country => (
                            <li key={country.name.common}>
                                <h3>{country.name.common}</h3>
                                <button onClick={() => handleCountryClick(country)}>Show</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {selectedCountry && (
                <div>
                    <h2>{selectedCountry.name.common}</h2>
                    <p>Capital: {selectedCountry.capital}</p>
                    <p>Area: {selectedCountry.area} km²</p>
                    <p>Languages: {Object.values(selectedCountry.languages).join(', ')}</p>
                    <img src={selectedCountry.flags.png} alt="Flag" style={{ width: '100px' }} />
                    {weatherData && (
                        <div>
                            <h3>Weather in {selectedCountry.capital}</h3>
                            <p>Temperature: {weatherData.main.temp} °C</p>
                            <p>Weather: {weatherData.weather[0].description}</p>
                            <p>Wind speed: {weatherData.wind.speed} m/s</p>
                            <img
                                    src={`http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`}
                                    alt="Weather Icon"
                                    style={{ width: '100px' }}
                                />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchInput;