export const formatTimeDifference = (serverDateStr=null) => {
    if (serverDateStr === null){
        return null
    }
    const serverDate = new Date(serverDateStr);
    
    // 현재 클라이언트 날짜
    const currentDate = new Date();
    
    // 두 날짜의 차이를 밀리초로 계산
    const timeDifference = currentDate - serverDate;
    
    // 차이를 시간, 분, 초로 변환
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    
    // 24시간 이내일 경우 몇 시간, 몇 분, 몇 초 전에 작성된 글인지 표시
    if (hoursDifference < 24) {
        if (hoursDifference > 0) {
            return `${hoursDifference}시간 전`;
        } else if (minutesDifference > 0) {
            return `${minutesDifference}분 전`;
        } else {
            return `${secondsDifference}초 전`;
        }
    } else {
        // 24시간 이상일 경우 날짜만 표시 (형식은 YYYY-MM-DD)
        return serverDate.toISOString().split('T')[0];
    }
}

export const switchCategory = (value)=> {
    switch (value) {
      case 'all':
        return 'ALL';
      case 'notice':
        return 'ANNOUNCEMENT_BOARD';
      case 'free':
        return 'FREE_BOARD';
      case 'question':
        return 'PROBLEM_SHARE_BOARD';
      case 'problem_sharing':
        return 'QUESTION_BOARD';
      default:
        return value; // 매칭되는 값이 없을 경우, 원래 값을 반환
    }
  }

export const switchCategoryToKorean = (value) => {
    switch (value) {
      case 'ALL':
        return '전체';
      case 'ANNOUNCEMENT_BOARD':
        return '공지';
      case 'FREE_BOARD':
        return '자유';
      case 'PROBLEM_SHARE_BOARD':
        return '문제 공유';
      case 'QUESTION_BOARD':
        return '질문';
      default:
        return value; // 매칭되는 값이 없을 경우, 원래 값을 반환
    }
  };