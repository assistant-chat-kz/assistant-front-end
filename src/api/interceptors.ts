import axios, { type CreateAxiosDefaults } from 'axios'


const options: CreateAxiosDefaults = {
	baseURL: 'http://localhost:4200/api',
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true
}

const axiosClassic = axios.create(options)

export { axiosClassic }