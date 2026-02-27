import axios from 'axios';

// export const API_SERVER_HOST = 'http://shinhanstone.click';

import { BASE_URL } from './config';

const host = `${BASE_URL}/api/user/signin`

export const loginPost = async(loginParam) => {
    const header = {header: {"Content-Type": "application/x-www-form-urlencoded"}}

    const form = new FormData()
    form.append('user_id', loginParam.user_id)
    form.append('password', loginParam.password)

    // post 통신
    const res = await axios.post(`${host}`, form, header)

    return res.data
}