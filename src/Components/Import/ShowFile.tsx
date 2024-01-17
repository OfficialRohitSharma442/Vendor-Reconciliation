import React, { useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
const ShowFile = ({ data }) => {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [pageSize, setPageSize] = useState(5);
  const [tableKey, setTableKey] = useState(0);

  const handlePageSizeChange = (_, newSize) => {
    setPageSize(newSize);
  };
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = () => {
    setSearchText('');
    setTableKey((prevKey) => prevKey + 1);
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() =>handleReset()}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? 'black' : "white" }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const columns = data[0]?.map((header, index) => ({
    title: header,
    dataIndex: `col_${index}`,
    key: `col_${index}`,
    ...getColumnSearchProps(`col_${index}`),
  }));
  const transformedData = data?.slice(1).map((row, rowIndex) => {
    const rowData = {};
    row?.forEach((cell, cellIndex) => {
      rowData[`col_${cellIndex}`] = cell;
    });
    return {
      key: rowIndex.toString(),
      ...rowData,
    };
  });
  const headerCellStyle = {
    background: 'green',
    color: 'white',
  };
  return (
    <div>
    <Table
     key={tableKey} 
      columns={columns}
      dataSource={transformedData}
      pagination={{
        pageSize: pageSize,
        showSizeChanger: true,
        pageSizeOptions: ['5', '10', '50', '100'], 
        onChange: handlePageSizeChange, 
      }}  
      scroll={{ x: 'max-content'}}
      />
     <style>{`
        .ant-table-thead > tr > th {
          background-color: ${headerCellStyle.background} !important;
          color: ${headerCellStyle.color} !important;
        }
      `}</style>
    </div>
  );
};

export default ShowFile;




// import React, { useState, useRef, useCallback } from 'react';

// const ShowFile = ({ allItems }) => {
//   const [visibleItems, setVisibleItems] = useState(allItems.slice(0, 20));
//   const containerRef = useRef(null);
//   const loadMoreItems = useCallback(() => {
//     // setTimeout(() => {
//     const startIndex = visibleItems.length;
//     const nextItems = allItems.slice(startIndex, startIndex + 1000);
//     setVisibleItems((prevItems) => [...prevItems, ...nextItems]);
//     // }, 1000);
//   }, [visibleItems, allItems]);

//   const handleScroll = useCallback(() => {
//     if (containerRef.current) {
//       const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
//       if (scrollTop + clientHeight >= scrollHeight - 100) {
//         loadMoreItems();
//       }
//     }
//   }, [loadMoreItems]);

//   const isRowLoaded = ({ index }) => index < visibleItems.length;

//   const rowRenderer = ({ index, key, style }) => {
//     const item = visibleItems[index];

//     return (
//       <div key={key} style={style}>
//         {item}
//       </div>
//     );
//   };

//   return (
//     <div
//       ref={containerRef}
//       style={{ overflowY: 'auto', height: '300px' }}
//       onScroll={handleScroll}
//     >
//       {/* {visibleItems.map((item, index) => ( */}

//         <div style={{ height: '300px' }}>
//           {/* {item} */}
//           <div className="Prev_excelFile">
//             <div
//               // style={{
//               //   // overflowX: "auto",
//               //   maxHeight: "320px",
//               // }}
//             >
//               <table
//                 style={{
//                   borderCollapse: "collapse",
//                   width: "100%",
//                   border: "1px solid #ddd",
//                   position: "relative",
//                 }}
//               >
//                 <thead>
//                   <tr>
//                     {visibleItems?.[0] &&
//                       visibleItems?.[0].map((header: any, index: any) => (
//                         <th
//                           key={index}
//                           style={{
//                             border: "1px solid #ddd",
//                             padding: "8px",
//                             backgroundColor: "green",
//                             color: "white",
//                             fontSize: "13px",
//                             fontFamily: "Arial, sans-serif",
//                             whiteSpace: "nowrap",
//                             height: "30px",
//                             position: "sticky",
//                             top: "0",
//                           }}
//                         >
//                           {header}
//                         </th>
//                       ))}
//                   </tr>
//                 </thead>
//                 <tbody style={{ overflowY: "scroll" }}>
//                   {visibleItems?.slice(1)?.map((row: any, rowIndex: any) => (
//                     <tr key={rowIndex}>
//                       {row.map((cell: any, cellIndex: any) => (
//                         <td
//                           key={cellIndex}
//                           style={{
//                             border: "1px solid #ddd",
//                             padding: "8px",
//                             fontSize: "12px",
//                             fontFamily: "Arial, sans-serif",
//                           }}
//                         >
//                           {cell}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
        
//       {/* ))} */}

//     </div>
//   );
// };

// export default ShowFile;









  {/* <div className="Prev_excelFile">
          <div
            style={{
              overflowX: "auto",
              maxHeight: "320px",
            }}
          >
            <table
              style={{
                borderCollapse: "collapse",
                width: "100%",
                border: "1px solid #ddd",
                position: "relative",
              }}
            >
              <thead>
                <tr>
                  {showfile?.[0] &&
                    showfile?.[0].map((header: any, index: any) => (
                      <th
                        key={index}
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          backgroundColor: "green",
                          color: "white",
                          fontSize: "13px",
                          fontFamily: "Arial, sans-serif",
                          whiteSpace: "nowrap",
                          height: "30px",
                          position: "sticky",
                          top: "0",
                        }}
                      >
                        {header}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody style={{ overflowY: "scroll" }}>
                {showfile?.slice(1)?.map((row: any, rowIndex: any) => (
                  <tr key={rowIndex}>
                    {row.map((cell: any, cellIndex: any) => (
                      <td
                        key={cellIndex}
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          fontSize: "12px",
                          fontFamily: "Arial, sans-serif",
                        }}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div> */}

