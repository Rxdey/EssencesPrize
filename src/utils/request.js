import axios from 'axios';
// import iconv from 'iconv-lite';
import colors from 'colors';

const request = async ({
    url = '',
    headers = {},
    method = 'GET',
    type = ''
}, data = {}) => {
    console.log(url);
    const setting = {
        url,
        method,
        data,
        timeout: 100000,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
            ...headers
        }
    };
    try {
        // console.log(setting);
        const res = await axios(setting);
        return res.data;
    } catch (error) {
        console.log(colors.red(error))
        return '';
    }
};

export default request;