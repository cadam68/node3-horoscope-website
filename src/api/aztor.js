const axios = require('axios');     

module.exports = () => {
    let instance = axios.create({
        baseURL: 'https://aztro.sameerkumar.website',
        timeout: 2000,
    });
  
    // Set the AUTH token for any request
    instance.interceptors.request.use(function (config) {
        config.params = { sign:config.data.sign, day:'today' };
        delete config.data;
        return config;
    });

    return instance;
};

