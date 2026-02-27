// 0803_google

import axios from "axios";
import { BASE_URL } from './config';

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
const google_redirect_uri  = `http://localhost:3000/user/google`

const google_auth_code_path = `https://accounts.google.com/o/oauth2/v2/auth`;
const google_access_token_url = `https://oauth2.googleapis.com/token`;

// 구글 로그인 URL을 생성하는 함수
export const getGoogleLoginLink = () => {
    const googleURL = `${google_auth_code_path}?client_id=${google_client_id}&redirect_uri=${google_redirect_uri}&response_type=code&scope=openid%20email%20profile`;

    return googleURL;
}

// 인증 코드를 사용하여 액세스 토큰을 얻는 함수
export const getGoogleAccessToken = async (authCode) => {

    const header = {
        "headers": {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    }

    const params = {
        grant_type: "authorization_code",
        client_id: google_client_id,
        client_secret: google_client_secret,
        redirect_uri: google_redirect_uri,
        code: authCode
    }

    const res = await axios.post(google_access_token_url, params, header);

    const accessToken = res.data.access_token;

    return accessToken;
}

// 액세스 토큰을 사용하여 사용자 정보를 가져오는 함수
export const getUserWithGoogleAccessToken = async (accessToken) => {
    const res = await axios.get(`${BASE_URL}/api/user/google?accessToken=${accessToken}`);

    return res.data;
}