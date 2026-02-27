import React from 'react';

const GroupTable = ({ paginatedData, hoveredRow, handleMouseEnter, handleMouseLeave, goToContent }) => {
    return (
        <table className="dt-multilingual table border-top dataTable no-footer dtr-column collapsed">
            <thead>
                <tr>
                    <th>No</th>
                    <th>그룹이름</th>
                    <th>그룹장</th>
                    <th>멤버</th>
                </tr>
            </thead>
            <tbody className="table-border-bottom-0">
                {paginatedData.map((group, index) => (
                    <tr
                        key={group.group_id}
                        onClick={() => goToContent(group.group_id)}
                        onMouseEnter={() => handleMouseEnter(group.group_id)}
                        onMouseLeave={handleMouseLeave}
                        className={hoveredRow === group.group_id ? 'table-light' : ''}
                    >
                        <td>{index + 1}</td>
                        <td onClick={() => goToContent(group.group_id)}>{group.group_name}</td>
                        {/* 그룹 이름 */}
                        <td>{group.admin_nickname}</td>
                        {/* 그룹 장 */}
                        <td>{group.present_member_num} / {group.max_member_num}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default GroupTable;