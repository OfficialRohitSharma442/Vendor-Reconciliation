import { Button, Input, Pagination, Space, Switch, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import React, { useRef, useState } from 'react';
import type { InputRef } from 'antd';
import type { ColumnType, ColumnsType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import AddAdmin from './AddAdmin';
import { Context } from '../Context/Context';
// import { getAllUsers } from '../utils/getallusers';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons'
import axios from 'axios';
interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
}
type DataIndex = keyof DataType;
const Superadmin: React.FC = () => {
    const { token } = React.useContext(Context);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [open, setOpen] = useState<any>(false);
    const [bulkVenderOpen, setbulkVenderOpen] = React.useState(false)
    const [allusers, setAllusers] = React.useState<any>([]);



    React.useEffect(() => {



        getAdmins(token);


    }, [])
    async function getAdmins(token: string) {
        try {
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

    const showDrawer = () => {
        setOpen(true);
    };


    const onClose = () => {
        setOpen(false);
    };



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
            key: 'email',
            width: '35%',
            // sorter: (a, b) => a.name.localeCompare(b.name),
            ...getColumnSearchProps('fullName'),

        },
        {
            title: 'User Name',
            dataIndex: 'username',
            key: 'username',
            width: '35%',
            ...getColumnSearchProps('username'),
            // sorter: (a, b) => a.address.length - b.address.length,
            // sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '35%',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Active',
            // dataIndex: 'email',
            // key: 'email',
            width: '30%',
            // ...getColumnSearchProps('email'),
            render: () => {
                return <div><Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked
                /></div>
            }
        },
    ];

    return (
        <div style={{ flexGrow: "1" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginRight: "3px", marginBottom: "10px" }}>
                <Button size="middle" type="primary" onClick={showDrawer}>Add Admin</Button>
                {/* <Button size="middle" type="primary" onClick={() => setbulkVenderOpen(true)}>Add BulkVendor</Button> */}
            </div>
            <Table
                bordered={true}
                loading={!allusers?.data}
                size="middle"
                columns={columns}
                dataSource={allusers?.data} />


            <AddAdmin
                open={open}
                onClose={onClose}
                showDetaillistData={getAdmins(token)}
            />

        </div>
    );
}

export default Superadmin;
