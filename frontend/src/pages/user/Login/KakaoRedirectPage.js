import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getAccessToken, getUserWithAccessToken } from "../../../api/kakaoApi";
import {checkAdditionalInfo} from "../../../api/memberApi";
import {useUser} from "../../../store/UserContext";

const KakaoRedirectPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const authCode = searchParams.get("code");

    // 사용자 정보 업데이트
    const { setUser } = useUser();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const accessToken = await getAccessToken(authCode);
                console.log(accessToken);

                const userInfo = await getUserWithAccessToken(accessToken);
                console.log("----------------------");
                console.log(userInfo);

                // setUser({
                //     nickname: userInfo.nickname
                // });

                const userInfomation = {
                    id: userInfo.user_id,
                    nickname: userInfo.nickname,
                    email: userInfo.email,
                    role: userInfo.role,
                    token: userInfo.access_token
                };
                setUser(userInfomation);
                localStorage.setItem('user', JSON.stringify(userInfomation)); // 로컬 스토리지에 저장

                // 이메일에서 kakao_ prefix를 붙여 user_id 생성
                const userId = `kakao_${userInfo.email}`;

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
                console.error('Error during Kakao OAuth process:', error);
                navigate('../../error'); // 에러 페이지로 네비게이션
            }
        };

        if (authCode) {
            fetchUserData();
        }
    }, [authCode, navigate]);

    return (
        <div>
            <div>Kakao Login Redirect</div>
            <div>{authCode}</div>
        </div>
    );
};

export default KakaoRedirectPage;