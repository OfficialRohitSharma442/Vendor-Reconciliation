import { Button, Input, Space, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import React, { useRef, useState } from 'react';
import type { InputRef } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Adduser from './Adduser';
import axios from 'axios';

interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
}

type DataIndex = keyof DataType;

const Adminmain: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [allusers, setAllusers] = React.useState([]);

    const searchInput = useRef<InputRef>(null);

    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    React.useEffect(() => {


        getAdmins();


    }, [])
    async function getAdmins() {
        try {
            let userdata = localStorage.getItem("VR-user_Role");
            let token;
            if (userdata) {

                const parsedData = JSON.parse(userdata);
                token = parsedData.token;

            }

            const response = await axios.get("https://concerned-plum-crayfish.cyclic.app/api/user/getAllUser", {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });

            setAllusers(response.data)
        } catch (error) {
            throw error; // You might want to handle the error or remove this line based on your use case
        }
    }

    // const data: DataType[] = [
    //     {
    //         key: '1',
    //         name: 'John Brown',
    //         age: 32,
    //         address: 'New York No. 1 Lake Park',
    //     },
    //     {
    //         key: '2',
    //         name: 'Joe Black',
    //         age: 42,
    //         address: 'London No. 1 Lake Park',
    //     },
    //     {
    //         key: '3',
    //         name: 'Jim Green',
    //         age: 32,
    //         address: 'Sydney No. 1 Lake Park',
    //     },
    //     {
    //         key: '4',
    //         name: 'Jim Red',
    //         age: 32,
    //         address: 'London No. 2 Lake Park',
    //     },
    //     {
    //         key: '5',
    //         name: 'John Brown',
    //         age: 32,
    //         address: 'New York No. 1 Lake Park',
    //     },
    //     {
    //         key: '6',
    //         name: 'Joe Black',
    //         age: 42,
    //         address: 'London No. 1 Lake Park',
    //     },
    //     {
    //         key: '7',
    //         name: 'Jim Green',
    //         age: 32,
    //         address: 'Sydney No. 1 Lake Park',
    //     },
    //     {
    //         key: '8',
    //         name: 'Jim Red',
    //         age: 32,
    //         address: 'London No. 2 Lake Park',
    //     },
    //     {
    //         key: '9',
    //         name: 'John Brown',
    //         age: 32,
    //         address: 'New York No. 1 Lake Park',
    //     },
    //     {
    //         key: '10',
    //         name: 'Joe Black',
    //         age: 42,
    //         address: 'London No. 1 Lake Park',
    //     },
    //     {
    //         key: '11',
    //         name: 'Jim Green',
    //         age: 32,
    //         address: 'Sydney No. 1 Lake Park',
    //     },
    //     {
    //         key: '12',
    //         name: 'Jim Red',
    //         age: 32,
    //         address: 'London No. 2 Lake Park',
    //     },
    //     {
    //         key: '13',
    //         name: 'John Brown',
    //         age: 32,
    //         address: 'New York No. 1 Lake Park',
    //     },
    //     {
    //         key: '13',
    //         name: 'Joe Black',
    //         age: 42,
    //         address: 'London No. 1 Lake Park',
    //     },
    //     {
    //         key: '14',
    //         name: 'Jim Green',
    //         age: 32,
    //         address: 'Sydney No. 1 Lake Park',
    //     },
    //     {
    //         key: '15',
    //         name: 'Jim Red',
    //         age: 32,
    //         address: 'London No. 2 Lake Park',
    //     },
    // ];

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close && close();
                        }}
                    >
                        Close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
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

    const columns: ColumnsType<DataType> = [
        {
            title: 'Name',
            dataIndex: 'fullName',
            key: 'fullName',
            width: '30%',
            ...getColumnSearchProps('fullName'),
        },
        {
            title: 'User Name',
            dataIndex: 'username',
            key: 'username',
            width: '20%',
            ...getColumnSearchProps('username'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ...getColumnSearchProps('email'),
            // sorter: (a, b) => a.address.length - b.address.length,
            // sortDirections: ['descend', 'ascend'],
        },
    ];

    return (
        <div className='Admin_main' style={{ flexGrow: "1" }}>
            <div className="Admin_page_cta" style={{ display: "flex", justifyContent: "space-between", marginRight: "3px", marginBottom: "10px" }}>
                <Button size="middle" onClick={showDrawer} type="primary">Add User</Button>
                <Button size="middle" type="primary">All User Report</Button>
            </div>
            <Table
                bordered={true}
                loading={!allusers?.data}
                size="middle"
                columns={columns}
                dataSource={allusers?.data}

            />

            <Adduser
                open={open}
                onClose={onClose}
                getuserdata={() => getAdmins()}

            />
        </div>
    );
}

export default Adminmain;
