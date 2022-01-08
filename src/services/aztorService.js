
const {axiosErrorHandler} = require('./../utils/toolsHelper');
const aztorApi = require('./../api/aztor');


const doAztor = async (sign) => {
    const response = await aztorApi().post('/', { sign });
    return(response.data);
}

const aztor = async (sign) => await axiosErrorHandler(() => doAztor(sign));

module.exports = {aztor} 