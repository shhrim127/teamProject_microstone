// oauth_login

import axios from "axios";
import { BASE_URL } from './config';

const rest_api_key = `c5f4eda7f6af89971e303d04e02a39e3` //REST키값
const redirect_uri = `http://localhost:3000/user/kakao`

const auth_code_path = `https://kauth.kakao.com/oauth/authorize`

const access_token_url = `https://kauth.kakao.com/oauth/token`

export const getKakaoLoginLink = () => {
    const kakaoURL = `${auth_code_path}?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

    return kakaoURL
}

export const getAccessToken = async (authCode) => {

    const header = {
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    }
    const params = {
        grant_type: "authorization_code",
        client_id: rest_api_key,
        redirect_uri: redirect_uri,
        code: authCode
    }

    // post
    const res = await axios.post(access_token_url, params, header)

    const accessToken = res.data.access_token

    return accessToken
}

export const getUserWithAccessToken = async(accessToken) => {

    const res = await axios.get(`${BASE_URL}/api/user/kakao?accessToken=${accessToken}`)

    return res.data
}