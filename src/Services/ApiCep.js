import axios from 'axios'

const ApiCEP = axios.create({
    baseURL: 'https://viacep.com.br/ws/'
})

export default ApiCEP;