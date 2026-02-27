import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GroupMemberView from './components/GroupMemberView';
// import GroupNonMemberView from './components/GroupNonMemberView';
// import { getUserGroupStatus, getGroupDetails } from '../../api/GroupApi'; // 실제 API는 나중에 연결

const GroupDetailPage = () => {
    const { groupId } = useParams(); // URL에서 그룹 ID를 가져옴
    const [isMember, setIsMember] = useState(false); // 현재 사용자가 그룹에 속해 있는지 여부
    const [groupDetails, setGroupDetails] = useState(null); // 그룹 상세 정보

    useEffect(() => {
        // 임시 데이터 사용
        const mockGroupDetails = {
            groupName: `Group ${groupId}`, // 예: 그룹 이름
            description: `This is the detail for group ${groupId}.`, // 예: 그룹 설명
        };

        const mockUserMembership = groupId % 2 === 1; // 임시 로직: groupId가 짝수인 경우 회원으로 간주

        // 데이터를 설정
        setGroupDetails(mockGroupDetails);
        setIsMember(mockUserMembership);

        // 실제 API 호출 예제 (나중에 사용할 부분)
        /*
        const fetchGroupData = async () => {
            try {
                // 그룹에 대한 세부 정보 가져오기
                const details = await getGroupDetails(groupId);
                setGroupDetails(details);

                // 현재 사용자가 이 그룹에 속해 있는지 확인
                const userId = localStorage.getItem('userId'); // 예: 로그인된 사용자 ID
                const memberStatus = await getUserGroupStatus(userId, groupId);
                setIsMember(memberStatus);
            } catch (error) {
                console.error('그룹 데이터를 가져오는 중 오류 발생:', error);
            }
        };

        fetchGroupData();
        */
    }, [groupId]);

    if (!groupDetails) {
        return <div>로딩 중...</div>; // 데이터를 가져오는 동안 로딩 상태 표시
    }

    return (
        <div>
            {/*{isMember ? (*/}
            {/*    <GroupMemberView groupDetails={groupDetails} />*/}
            {/*) : (*/}
            {/*    <GroupNonMemberView groupDetails={groupDetails} />*/}
            {/*)}*/}
            <GroupMemberView groupDetails={groupDetails} />
        </div>
    );
};

export default GroupDetailPage;