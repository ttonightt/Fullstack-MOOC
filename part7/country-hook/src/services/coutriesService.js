import axios from "axios";

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api";

const getAll = async () => {

    return (await axios.get(`${baseUrl}/all`)).data;
};

const getByName = async name => {

    return (await axios.get(`${baseUrl}/name/${name}`)).data;
};

export default {
    getAll,
    getByName
};