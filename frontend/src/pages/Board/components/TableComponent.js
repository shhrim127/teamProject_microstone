import React from 'react';
import { formatTimeDifference ,switchCategoryToKorean} from '../../../api/util';
const TableComponent = ({ tables, goToContent, handleMouseEnter, handleMouseLeave, hoveredRow }) => {
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', minWidth: '980px'}}>
    <table className="dt-multilingual table border-top dataTable no-footer dtr-column collapsed" style={{ padding: '0 16px', margin: '0 24px', width: '100%'}}>
      <thead>
        <tr>
          <th style={{ width: '140px', boxSizing: 'border-box' }}>No</th>
          <th style={{ width: '350px', boxSizing: 'border-box' }}>제목</th>
          <th style={{ width: '140px', boxSizing: 'border-box' }}>카테고리</th>
          <th style={{ width: '190px', boxSizing: 'border-box' }}>글쓴이</th>
          <th style={{ width: '120px', boxSizing: 'border-box' }}>댓글</th>
          <th style={{ width: '120px', boxSizing: 'border-box' }}>추천</th>
          <th style={{ width: '240px', boxSizing: 'border-box' }}>작성일</th>
        </tr>
      </thead>
      <tbody className="table-border-bottom-0">
        {tables && tables.length > 0 ? (
        tables.map((table,index) => (
              <tr
              key={index}
              onClick={()=> goToContent(table.post_id)}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              style={{
                backgroundColor:
                  hoveredRow === index ? '#f0f0f0' : 'transparent',
              }}
            >
              <td>{table.post_id}</td>
              <td>{table.title}</td>
              <td>{switchCategoryToKorean(table.category)}</td>
              <td>{table.nickname}</td>
              <td>{table.reply_num}</td>
              <td>{table.recommend_num}</td>
              <td>{formatTimeDifference(table.created_at)}</td>
            </tr>
        ))
        ) : (
          <tr>
            <td colSpan="5">게시글이 없습니다.</td>
          </tr>
        )}
      </tbody>
    </table>
    </div>
  );
};

export default TableComponent;