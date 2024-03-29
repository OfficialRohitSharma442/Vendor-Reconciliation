import React, { useEffect, useState } from 'react'
import { DownloadOutlined, StopOutlined, PlayCircleOutlined, ShareAltOutlined, DeleteOutlined, FileExcelOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import axios from 'axios';
import Meta from 'antd/es/card/Meta';
import * as XLSX from "xlsx";
import { Button, Card, Input, Layout, Modal, Radio, message } from 'antd';
import moment from 'moment';
import * as ExcelJS from 'exceljs';
import Search from 'antd/es/input/Search';
import { DatePicker } from 'antd';
import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';
import { Footer, Header } from 'antd/es/layout/layout';
const { RangePicker } = DatePicker;
interface Report {
    reportId: string;
}
const Reports = () => {
    const getReportListUrl = "https://concerned-plum-crayfish.cyclic.app/api/report-get/report-list";
    const MainUrl = "https://concerned-plum-crayfish.cyclic.app/api/report-set";
    const allurl = [
        { url: '/p-one-case', sheetName: 'P1' },
        { url: '/p-two-case', sheetName: 'P2' },
        { url: '/p-three-case', sheetName: 'P3' },
        { url: '/k-one-case', sheetName: 'K1' },
        { url: '/k-two-case', sheetName: 'K2' },
        { url: '/f-case', sheetName: 'F' },
        { url: '/f-two-case', sheetName: 'F2' },
        { url: '/a-case', sheetName: 'A' },
        { url: '/g-one-case', sheetName: 'G1' },
        { url: '/g-two-case', sheetName: 'G2' },
        // { url: '/l-one-case', sheetName: 'L1' },
        { url: '/l-two-case', sheetName: 'L2' },
        // { url: '/l-three-case', sheetName: 'L3'},
        { url: '/l-four-case', sheetName: 'L4' },
        // { url: '/m-one-case', sheetName: 'M1' },
        { url: '/m-two-case', sheetName: 'M2' },
        { url: '/m-three-case', sheetName: 'M3' },
        // { url: '/m-four-case', sheetName: 'M4' },
        { url: '/m-five-case', sheetName: 'M5' },
        { url: '/i-one-case', sheetName: 'I1' },
        { url: '/i-two-case', sheetName: 'I2' },
        { url: '/i-three-case', sheetName: 'I3' },
        { url: '/threshold-one-case', sheetName: 'Threshold' },
        { url: '/summary-case', sheetName: 'Summary Report' },
    ];
    const [AllReports, setAllReports] = useState<any[]>([]);
    const [sendEmailModel, setsendEmailModel] = useState(false);
    const [Email, setEmail] = useState("");
    const [file, setFile] = useState<Blob | null>(null);
    const [FilteredReport, setFilteredReport] = useState<any>([]);
    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const [downloadLoading, setDownloadLoading] = useState({});

    const itemRender: PaginationProps['itemRender'] = (_, type, originalElement) => {
        if (type === 'prev') {
            return <a>Previous</a>;
        }
        if (type === 'next') {
            return <a>Next</a>;
        }
        return originalElement;
    };
    const handlePageChange = (pageNumber) => {
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const newFilteredReport = AllReports.slice(startIndex, endIndex);
        setFilteredReport(newFilteredReport);
        setCurrentPage(pageNumber);
    };
    async function getReportList() {
        const alldata: any = Cookies.get("VR-user_Role");
        const tokens = JSON.parse(alldata).token;
        console.log(tokens);
        try {
            const response = await axios.get(getReportListUrl, {
                headers: {
                    Authorization: `Bearer ${tokens}`,
                },
            });
            if (response?.data?.data) {
                console.log({ "response?.data?.data": response?.data?.data })
                setAllReports(response?.data?.data);
                setFilteredReport(response?.data?.data?.slice(0, 8))


            }
        } catch (error) {
            console.error(error);
            return error;
        }

    }
    useEffect(() => {
        getReportList()
    }, [])
    async function getReport(url, sheetName, ID: any, isreco: boolean) {
        const alldata: any = Cookies.get("VR-user_Role");
        const tokens = JSON.parse(alldata).token;
        const finaltemp = {
            userDetailsId: ID,
        };
        try {
            const response = await axios.post(`${MainUrl}${url}`, finaltemp, {
                headers: {
                    Authorization: ` Bearer ${tokens}`,
                },
            });
            if (response && response.data && response.data.data && response.data.data.length > 0) {
                if (isreco) {
                    return response.data.data;
                }
                else
                    return { sheetName, data: response.data.data };
            } else {
                console.log(`No Data find for this ${sheetName} sheet`);
                return null;
            }
        }
        catch (error: any) {
            console.error(`Error fetching data from ${url}:`, error);
            return null;
        }
    }
    async function downloadExcelFile(ID, sendmail) {
        console.log(ID);
        setDownloadLoading({ ...downloadLoading, [ID]: true });
        try {
            const promises = allurl.map(({ url, sheetName }) => getReport(url, sheetName, ID, false));
            const results = await Promise.allSettled(promises);
            const newFile = XLSX.utils.book_new();
            const workbook = new ExcelJS.Workbook();
            if (sendmail) {
                results?.forEach(result => {
                    if (result.status === 'fulfilled' && result?.value && result.value?.data) {
                        const worksheet = workbook.addWorksheet(result.value.sheetName);
                        const headerRow = Object.keys(result.value.data[0]);
                        worksheet.addRow(headerRow);
                        result.value.data.forEach(data => {
                            const dataRow = Object.values(data);
                            worksheet.addRow(dataRow);
                        });
                        worksheet?.columns?.forEach(column => {
                            column.width = 18;
                        });
                    } else if (result.status === 'rejected' && result.reason) {
                        console.error(`Error fetching data: ${result.reason}`);
                    }
                });
            }
            else {
                results?.forEach(result => {
                    if (result.status === 'fulfilled' && result?.value && result.value?.data) {
                        const wsK = XLSX.utils.json_to_sheet(result.value?.data);
                        XLSX.utils.book_append_sheet(newFile, wsK, result.value.sheetName);
                        const defaultWidth: any = 100;
                        const wscols = Array.from({ length: 10 }, () => ({ wpx: defaultWidth }));
                        newFile.Sheets[result.value.sheetName]['!cols'] = wscols;
                    } else if (result.status === 'rejected' && result.reason) {
                        console.error(`Error fetching data: ${result.reason}`);
                    }
                });
            }
            const res = await getReport("/reco", "reco", ID, true);
            if (res != null && res != undefined && res != "") {
                const all = res?.map(item => item?.data);
                let first = [`Vendor Name: ${res[0]["Vendor Name"]}`];
                let second = [`Vendor Code: ${res[0]["Vendor Code"]}`];
                let formattedDate = "";
                if (res[0]["period"]) {
                    const inputDateString = res[0]["period"];
                    formattedDate = moment(inputDateString).format('MM/DD/YYYY');
                }
                let BalanceOutstanding = [`Balance outstanding   ${formattedDate}`, " ", `${res[0]["companyTotal"]}`, `${res[0]["vendorTotal"]}`];
                const headers = Object?.keys(all[0]);
                const allData = [first, second, [], [], headers, BalanceOutstanding];
                let company = 0;
                let vendor = 0;
                let difference = 0;
                all?.forEach(obj => {
                    const rowData: any = headers.map((header) => {
                        if (header == "Company Open") {
                            const Value = parseInt(obj[header]);
                            company = isNaN(Value) ? company : company + Value;
                        }
                        else if (header == "Vendor Open") {
                            const Value = parseInt(obj[header]);
                            vendor = isNaN(Value) ? vendor : vendor + Value;
                        }
                        else if (header == "Difference") {
                            const Value = parseInt(obj[header]);
                            difference = isNaN(Value) ? difference : difference + Value;
                        }
                        return obj[header]
                    });
                    allData.push(rowData);
                });
                let arr = ["Total", " ", `${company}`, `${vendor}`, `${difference}`];
                allData.push(arr);

                if (sendmail) {
                    const worksheet = workbook.addWorksheet("Reco");
                    worksheet.addRows(allData);
                    worksheet?.columns?.forEach(column => {
                        column.width = 30;
                    });
                }
                else {
                    const ws = XLSX.utils.aoa_to_sheet(allData);
                    XLSX.utils.book_append_sheet(newFile, ws, 'Reco');
                    const defaultWidth: any = 180;
                    const wscols: any = [];
                    const totalColumns = headers.length;
                    for (let i = 0; i < totalColumns; i++) {
                        wscols.push({ wpx: defaultWidth });
                    }
                    ws['!cols'] = wscols;
                }
            }
            if (sendmail) {
                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                return blob;
            }
            if (newFile.SheetNames.length > 0) {
                XLSX.writeFile(newFile, "combinedCaseFile.xlsx");
            } else {
                console.log("No data available for any sheets");
            }
            setDownloadLoading({ ...downloadLoading, [ID]: false });
        } catch (error) {
            console.error("Error generating Excel file:", error);
        }
    }
    function deleteExcelFile() {
        throw new Error('Function not implemented.');
    }
    async function SendMail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!Email) {
            message.error('Please enter an email address.');
        } else if (Email.length < 5) {
            message.error('Email address should be at least 5 characters long.');
        } else if (Email.indexOf(' ') !== -1) {
            message.error('Email address should not contain spaces.');
        } else if (!emailRegex.test(Email)) {
            message.error('Please enter a valid email address.');
        } else {
            if (file != null) {
                try {
                    const formData = new FormData();
                    formData.append('file', file, 'workbook.xlsx'); // 'workbook.xlsx' is the filename
                    formData.append('emails', Email);
                    const alldata: any = Cookies.get("VR-user_Role");
                    const tokens = JSON.parse(alldata).token;
                    try {
                        const response = await axios.post("https://concerned-plum-crayfish.cyclic.app/api/mail/upload", formData, {
                            headers: {
                                Authorization: ` Bearer ${tokens}`,
                            },
                        });
                        if (response?.status == 200) {
                            console.log(response);
                            setsendEmailModel(false);
                            setEmail("");
                            message.success("Thank you! Your message has been successfully sent.")
                        }
                    }
                    catch (error: any) {
                        console.error("error in sedn email", error);
                        return null;
                    }
                }
                catch (error) {
                    console.log(error)
                }
            }
        }
    }
    async function prepareFile(ID) {
        setsendEmailModel(true);
        const newFile = await downloadExcelFile(ID, true);
        if (newFile != null && newFile != undefined)
            setFile(newFile);
    }
    const handleOnChageDateChange = (dates) => {
        console.log(AllReports);

        if (!dates || !dates[0] || !dates[1]) {
            // Handle the case when dates are not selected or incomplete
            setFilteredReport(AllReports);
            return;
        }
        debugger
        const filteredData = AllReports.filter(item => {
            const itemDate = moment(item.createdAt);
            return itemDate.isValid() && itemDate.isSameOrAfter(dates[0].$d) && itemDate.isSameOrBefore(dates[1].$d);
        });
        setFilteredReport(filteredData);
    };

    return (
        <Layout style={{ minHeight: "100vh", marginLeft: "10px" }}>
            <div>
                <Header style={{ display: 'flex', justifyContent: "space-between", backgroundColor: '#f5f5f5' }}>
                    <Radio.Group
                        defaultValue="center"
                        buttonStyle="solid"
                        style={{ display: 'flex', alignItems: 'center' }}
                        onChange={(e) => console.log(e.target.value)}
                    >
                        <Radio.Button value="start">
                            <div style={{ display: 'flex', gap: 5 }}>

                                <PlayCircleOutlined /> Start
                            </div>
                        </Radio.Button>
                        <Radio.Button value="center">
                            <div style={{ display: 'flex', gap: 5 }}>

                                <PlayCircleOutlined /> Center
                            </div>
                        </Radio.Button>

                    </Radio.Group>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
                        <RangePicker size="large"
                            onCalendarChange={handleOnChageDateChange}
                            format="MM/DD/YYYY"
                        />
                        <Search
                            size="large"
                            placeholder="Input search text"
                            allowClear
                            onSearch={(e) => console.log(e)}
                            style={{ marginLeft: '10px', width: "unset" }}
                        />
                    </div>
                </Header>
                {FilteredReport.length > 0 ?
                    <div className='' style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                        {FilteredReport?.map((item: any) => {
                            return (
                                <>
                                    <Card
                                        style={{ width: "17rem", borderRadius: 10, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}
                                        actions={[
                                            <Button style={{ border: "none" }} icon={<DownloadOutlined />} onClick={() => downloadExcelFile(item?.reportId, false)} loading={downloadLoading[item?.reportId]} key="download" />,
                                            <Button style={{ border: "none" }} icon={<DeleteOutlined />} onClick={deleteExcelFile} key="delete" />,
                                            <Button style={{ border: "none" }} icon={<ShareAltOutlined />} onClick={() => prepareFile(item?.reportId)} key="preview" />,
                                        ]}
                                    >
                                        <Meta
                                            avatar={
                                                <FileExcelOutlined style={{ fontSize: "40px", color: "green" }} />

                                            }
                                            title="Excel File.xlsx"
                                            description={
                                                <span style={{ display: "flex", alignItems: "center" }}><b style={{ color: "black", marginRight: "2px", fontWeight: "400" }}>Created Date: </b> <span>{moment(item?.createdAt).format('MM/DD/YYYY')}</span></span>
                                            }
                                            style={{ padding: 0, height: 100, }}
                                        />
                                    </Card>

                                </>
                            )
                        })
                        }

                    </div>
                    : <div style={{ display: "grid", alignItems: "center", justifyContent: "center", height: "100vh" }}><div>No Report Found</div></div>
                }
            </div>
            <Modal title='Share Report'
                open={sendEmailModel}
                onOk={SendMail}
                okText='Send'
                onCancel={() => setsendEmailModel(false)}
            >
                <Input
                    placeholder="Text"
                    onChange={(e) => setEmail(e.target.value)}
                    className='doc_type_mapping'
                    value={Email}
                />
            </Modal>
            <Footer style={{ display: 'flex', flexDirection: "row-reverse" }}>
                <Pagination onChange={handlePageChange} showTitle responsive hideOnSinglePage total={AllReports?.length} defaultPageSize={8} itemRender={itemRender} />
            </Footer>
        </Layout>
    )
}

export default Reports


