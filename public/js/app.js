// console.log('Client side javascript is loaded');

// -- define global var --
let forecastForm;
let search;
let messageOne;
let messageTwo;

const fetchService= (target, formValues, method="get") => {
    if(method=='get') {
        return fetch(`/${target}?${formValues.toString()}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }})
            .then(response => response.json())
            .catch((error) => {
                if (error.name !== 'AbortError') throw error;
        });
    } else {
        return fetch(`/${target}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
            },
            body: formValues})
            .then(response => response.json())
            .catch((error) => {
                if (error.name !== 'AbortError') throw error;
        });
    }
}

const getForecast = (sign) => {
    messageOne.textContent='loading...';
    messageTwo.textContent='';
    if(messageOne.classList.contains('error')) messageOne.classList.remove('error');

    let params = new URLSearchParams();
    params.append('sign', sign);
    fetchService('forecast', params, 'post').then(({error, forecast, sign}={})=>{
        if(error) {
            messageOne.textContent=error;
            messageOne.classList.add('error');
        } else {
            messageOne.textContent=sign;
            messageTwo.textContent=forecast;
        }
    })
}

const init = () => {
    forecastForm = document.querySelector('form');
    search = document.querySelector('select');
    messageOne = document.querySelector('#message-1')
    messageTwo = document.querySelector('#message-2')

    forecastForm,addEventListener('submit', (e) => {
        e.preventDefault();     // <--- prevent default refresh
        getForecast(search.value);
    })
}
