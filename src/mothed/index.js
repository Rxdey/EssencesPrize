import fs from 'fs';
import path from 'path';
import request from '../utils/request.js';

const __dirname = path.resolve();
const jsonTxt = fs.readFileSync(path.join(__dirname, 'src/mothed/data.json'), { encoding: 'utf-8' });
const dataJson = JSON.parse(jsonTxt).entries.filter(item => item.text.search('破空') >= 0 || item.text.length <= 4);

// console.log(dataJson);

const api = {
    search: {
        url: 'https://poe.game.qq.com/api/trade/search/S21%E8%B5%9B%E5%AD%A3',
        method: 'Post',
        headers: {
            'Content-Type': 'application/json',
            Referer: 'https://poe.game.qq.com/trade/search/S21%E8%B5%9B%E5%AD%A3',
            Host: 'poe.game.qq.com',
            Origin: 'https://poe.game.qq.com',
        }
    },
    parse: {
        url: 'https://poe.game.qq.com/api/trade/fetch/',
        headers: {
            'Content-Type': 'application/json',
            Referer: 'https://poe.game.qq.com/trade/search/S21%E8%B5%9B%E5%AD%A3',
            Host: 'poe.game.qq.com',
            Origin: 'https://poe.game.qq.com',
        }
    }
};

const createQueryString = (name = '') => {
    return {
        "query": {
            "status": { "option": "any" },
            "type": name,
            "stats": [{ "type": "and", "filters": [] }],
            "filters": { "misc_filters": { "filters": { "stack_size": { "min": 9 } } } }
        }, "sort": { "indexed": "desc" }
    };
};

const getSearch = async (str = '', POESESSID = '') => {
    const quertString = createQueryString(str);
    return request(
        {
            ...api.search,
            headers: {
                ...api.search.headers,
                Cookie: `POESESSID=${POESESSID};`
            },
        },
        quertString
    );
};

// 解析
const getParse = async (str = '', POESESSID = '') => {
    const url = `${api.parse.url}${str}`;
    return request({
        ...api.parse,
        url,
        headers: {
            ...api.parse.headers,
            Cookie: `POESESSID=${POESESSID};`
        },
    });
};

const getParsePrize = async (name, POESESSID) => {
    const searchRes = await getSearch(name, POESESSID);
    if (!searchRes || !searchRes.result || !searchRes.result.length) return false;
    const str = searchRes.result.slice(0, 10).join(',');
    const res = await getParse(str, POESESSID);
    return res;
};

const sleep = async (dely = 2000) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, dely);
    });
};
// 搜索
export const onSearch = async (req) => {
    const { query } = req;
    const { POESESSID = '', baseType = '' } = query;
    // for (let item of dataJson) {
    //     const { text } = item;
    //     const d = await getParsePrize(text, POESESSID);
    //     await sleep()
    //     res.push(d);
    // }
    // const res = await Promise.allSettled(dataJson.map(item => {
    //     const { text } = item;
    //     return getParsePrize(text, POESESSID);
    // }));
    const res = await getParsePrize(baseType, POESESSID);
    return res;
};


