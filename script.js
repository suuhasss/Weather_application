let key = 'e30369da97954d21b5540501252605';

async function getTodayForecast() {
    let enteredCityIdEle = document.getElementById("enteredCityId");
    let enteredCity = enteredCityIdEle.value;
    console.log(enteredCity);

    let API = `http://api.weatherapi.com/v1/current.json?key=${key}&q=${enteredCity}`;
    let res = await axios.get(API);
    let data = res.data;
    console.log(data);

    let currentId = document.getElementById("presentDetails");
    let presentDetails = `
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <h1 style="font-size: 2.5rem; font-weight: bold;">${enteredCity}</h1>
                <h1 style="font-size: 5rem;">${data.current.temp_c}°</h1>
            </div>
            <div>
                <img src="${data.current.condition.icon}" alt="${data.current.condition.text}" style="width: 120px; height: 120px;">
            </div>
        </div>
    `;
    currentId.innerHTML = presentDetails;

    await getHourlyForecast(enteredCity);
    await getSevenDayForecast(enteredCity);
    await getAirConditions(enteredCity);
}

async function getHourlyForecast(city) {
    let API = `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=1`;
    let res = await axios.get(API);
    let hourlyData = res.data.forecast.forecastday[0].hour;

    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    let filteredHours = hourlyData.filter(hour => {
        const hourTime = new Date(hour.time).getHours();
        return hourTime >= currentHour;
    }).slice(0, 6);

    if (filteredHours.length < 6) {
        let additionalAPI = `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=2`;
        let additionalRes = await axios.get(additionalAPI);
        let nextDayHours = additionalRes.data.forecast.forecastday[1].hour;
        filteredHours = filteredHours.concat(nextDayHours).slice(0, 6);
    }

    let forecastId = document.getElementById("hourlyForecastDetails");
    let forecastDetails = `
        <h3 class="text-start mb-4" style="font-size: 1rem; color: #ccc; font-weight: normal;">TODAY'S FORECAST</h3>
        <div class="d-flex justify-content-between">
    `;

    filteredHours.forEach(function(hour) {
        forecastDetails += `
            <div class="text-center">
                <p style="font-size: 0.85rem; color: #ccc; margin-bottom: 0.5rem;">${new Date(hour.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</p>
                <img src="${hour.condition.icon}" alt="${hour.condition.text}" style="width: 60px; height: 60px; margin-bottom: 0.5rem;">
                <p style="font-size: 1.2rem; font-weight: bold;">${hour.temp_c}°</p>
            </div>
        `;
    });

    forecastDetails += `</div>`;
    forecastId.innerHTML = forecastDetails;
}

async function getSevenDayForecast(city) {
    let API = `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=7`;
    let res = await axios.get(API);
    let forecastData = res.data.forecast.forecastday;

    let forecastId = document.getElementById("forecastDetails");
    let forecastDetails = `
        <h3 class="text-start mb-4" style="font-size: 1rem; color: #ccc; font-weight: normal;">7-DAY FORECAST</h3>
    `;

    forecastData.forEach(function(day, index) {
        const dayName = index === 0 ? 'Today' : new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
        forecastDetails += `
            <div class="d-flex justify-content-between align-items-center mb-3">
                <p style="font-size: 0.9rem; color: #ccc; margin: 0;">${dayName}</p>
                <div class="d-flex align-items-center">
                    <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" style="width: 40px; height: 40px; margin-right: 10px;">
                    <p style="font-size: 0.9rem; color: #fff; margin: 0;">${day.day.condition.text}</p>
                </div>
            </div>
        `;
    });

    forecastId.innerHTML = forecastDetails;
}

async function getAirConditions(city) {
    let API = `http://api.weatherapi.com/v1/current.json?key=${key}&q=${city}`;
    let res = await axios.get(API);
    let data = res.data;

    let airConditionsId = document.getElementById("airConditionsDetails");
    let airConditionsDetails = `
        <h3 class="text-start mb-4" style="font-size: 1rem; color: #ccc; font-weight: normal;">AIR CONDITIONS</h3>
        <div class="row">
            <div class="col-6 mb-3">
                <p style="font-size: 0.85rem; color: #ccc; margin: 0;">Real Feel</p>
                <p style="font-size: 1rem; color: #fff; margin: 0;">${data.current.feelslike_c}°</p>
            </div>
            <div class="col-6 mb-3">
                <p style="font-size: 0.85rem; color: #ccc; margin: 0;">Wind</p>
                <p style="font-size: 1rem; color: #fff; margin: 0;">${data.current.wind_kph} km/h</p>
            </div>
            <div class="col-6">
                <p style="font-size: 1rem; color: #fff; margin: 0;">${data.current.precip_mm > 0 ? Math.round(data.current.precip_mm * 100) : 0}%</p>
            </div>
            <div class="col-6">
                <p style="font-size: 0.85rem; color: #ccc; margin: 0;">UV Index</p>
                <p style="font-size: 1rem; color: #fff; margin: 0;">${data.current.uv}</p>
            </div>
        </div>
    `;
    airConditionsId.innerHTML = airConditionsDetails;
}