const CustomError = require('./../classes/CustomError');

const axiosErrorHandler =  async (callback) => {
    try {
        return await callback();
    } catch (err) {
        if(err.isAxiosError) {
            // console.log(`${chalk.bold.inverse.red(' tryCatch axiosError handler ')}`);
            // if (err.response) throw new CustomError(`ERR_${err.response.status}`, `${err.response.config.baseURL}${err.response.config.url} service : ${err.response.data.message.toLowerCase()}`); 
            if (err.response) throw new CustomError(`ERR_${err.response.status}`, `${err.response.data.message.toLowerCase()}`); 
            if (err.request) throw new CustomError(`ERR_${err.code.toUpperCase()}`, `Unable to connect to ${err.hostname} service`); 
            throw new CustomError('ERR_UNKNOW', `${err.message}`); 
        }
        // console.log(`${chalk.bold.inverse.red(' tryCatch error handler ')}`);
        throw err;
    }
}

module.exports = {axiosErrorHandler} 