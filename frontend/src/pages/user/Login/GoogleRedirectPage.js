import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getGoogleAccessToken, getUserWithGoogleAccessToken } from "../../../api/googleApi";
import {checkAdditionalInfo} from "../../../api/memberApi";
import {useUser} from "../../../store/UserContext";

const GoogleRedirectPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const authCode = searchParams.get("code");

    // 사용자 정보 업데이트
    const { setUser } = useUser();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const accessToken = await getGoogleAccessToken(authCode);
                console.log(accessToken);

                const userInfo = await getUserWithGoogleAccessToken(accessToken);
                console.log("----------------");
                console.log(userInfo);

                // setUser({
                //     nickname: userInfo.nickname
                // });
                // 로그인 성공 시, UserContext와 로컬 스토리지에 사용자 정보 저장
                const userInfomation = {
                    id: userInfo.user_id,
                    nickname: userInfo.nickname,
                    email: userInfo.email,
                    role: userInfo.role,
                    token: userInfo.access_token
                };
                setUser(userInfomation);
                localStorage.setItem('user', JSON.stringify(userInfomation)); // 로컬 스토리지에 저장

                const userId = `google_${userInfo.email}`;

                // 로컬 스토리지에 user_id 저장
                localStorage.setItem('user_id', userId);
                console.log("user_id:", userId);


                const needsAdditionalInfo = await checkAdditionalInfo(userId);

                if(needsAdditionalInfo) {
                    navigate('/user/register');
                } else {
                    navigate('/')
                }

            } catch (error) {
                console.error('Error during Google OAuth process:', error);
                // 에러 발생 시, 에러 페이지로 리디렉션하거나 메시지 표시
                navigate('/error');
            }
        };

        if (authCode) {
            fetchUserData();
        }
    }, [authCode, navigate]);

    return (
        <div>
            <div>Google Login Redirect</div>
            <div>{authCode}</div>
        </div>
    );
};

export default GoogleRedirectPage;
