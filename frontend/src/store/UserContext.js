// 사용자 정보 관리
// 상태 관리

import React, {createContext, useContext, useEffect, useState} from "react";
import {getState} from '../api/getPdfDatePreProcessingAPI';
const UserContext = createContext(null);


export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // 사용자 정보 상태
    const [pdf_list,set_pdf_list] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser); // 유저 상태 업데이트
            } catch (error) {
                console.error('JSON 파싱 오류:', error);
            }
        }
        // const storedTasks = localStorage.getItem('tasks');
        // if (storedTasks) {
        //     try {
        //         getState();

        //     } catch (error) {
        //         console.error('작업 현황 alert JSON 파싱 오류', error);
        //     }
        // }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser ,pdf_list,set_pdf_list}}>
            {children}
        </UserContext.Provider>
    );
};


