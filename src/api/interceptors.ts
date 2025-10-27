import axios, { type CreateAxiosDefaults } from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_URL || '/api'

const options: CreateAxiosDefaults = {
	baseURL,
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true
}

const axiosClassic = axios.create(options)

export { axiosClassic }

console.log('AXIOS BASE URL:', axiosClassic.defaults.baseURL);