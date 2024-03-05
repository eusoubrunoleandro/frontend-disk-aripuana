import axios from 'axios'

const serverURL = {
    local: "http://localhost:3333",
    web: "https://servidor-disk-aripuana-test-production.up.railway.app"
}

const Api = axios.create({
    baseURL: serverURL.web
})

export default Api;