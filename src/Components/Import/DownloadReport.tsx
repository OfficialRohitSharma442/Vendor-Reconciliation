import axios from 'axios';
import Cookies from "js-cookie";
import * as XLSX from "xlsx";
// import * as XLSXStyle from 'xlsx-style';
const DownloadReport = async () => {
    const MainUrl = "https://concerned-plum-crayfish.cyclic.app/api/generate-report";
    const allurl = [
        { url: '/p-one-case', sheetName: 'P1' },
        { url: '/p-two-case', sheetName: 'P2' },
        { url: '/k-one-case', sheetName: 'K1' },
        { url: '/k-two-case', sheetName: 'K2' },
        { url: '/f-case', sheetName: 'F' },
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
    ];
    // ************** Fetch data*******
    const fetchData = async (url, sheetName) => {
        const alldata: any = Cookies.get("VR-user_Role");
        const tokens = JSON.parse(alldata).token;
        try {
            const response = await axios.get(`${MainUrl}${url}`, {
                headers: {
                    Authorization: `Bearer ${tokens}`,
                },
            });
            if (response && response.data && response.data.data && response.data.data.length > 0) {
                return { sheetName, data: response.data.data };
            }
            else {
                console.log(`No Data find for this ${sheetName} sheet`);
                return null;
            }
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
            return null;
        }
    };
    // ************** generate excle file*******
    const generateExcelFile = async () => {
        try {
            const promises = allurl.map(({ url, sheetName }) => fetchData(url, sheetName));
            const results = await Promise.allSettled(promises);
            const newFile = XLSX.utils.book_new();
            results.forEach(result => {
                // if (result && result?.data) {
                //     const wsK = XLSX.utils.json_to_sheet(result.value?.data);
                //     XLSX.utils.book_append_sheet(wb, wsK, result.sheetName);
                // }
                if (result.status === 'fulfilled' && result?.value && result.value?.data) {
                    const wsK = XLSX.utils.json_to_sheet(result.value?.data);
                    XLSX.utils.book_append_sheet(newFile, wsK, result.value.sheetName);
                } else if (result.status === 'rejected' && result.reason) {
                    console.error(`Error fetching data: ${result.reason}`);
                }
            });

            const res = await getReco("https://concerned-plum-crayfish.cyclic.app/api/generate-report/reco");
            if (res != null && res != undefined && res != "") {
                const all = res.map(item => item?.data);
                console.log(all);
                let first = [`Vendor Code: ${res[0]["Vendor Name"]}`];
                let second = [`Vendor Name: ${res[0]["Vendor Code"]}`];
                const headers = Object.keys(all[0]);
                const allData = [first, second, [], [], headers];
                let total = 0;
                all.forEach(obj => {
                    const rowData: any = headers.map((header) => {
                        if (header == "Company") {
                            total = total + parseInt(obj[header]);
                        }
                        return obj[header]
                    });
                    allData.push(rowData);
                });
                let arr = ["Total", "  ", `${total}`];
                allData.push(arr);
                const ws = XLSX.utils.aoa_to_sheet(allData);

                // const boldEnlargeStyle = {
                //     font: { bold: true, size: 16 }
                // };

                // XLSXStyle.utils.sheet_set_range_style(ws, { s: { r: 0, c: 0 }, e: { r: 1, c: allData[0].length - 1 } }, boldEnlargeStyle);

                XLSX.utils.book_append_sheet(newFile, ws, 'Reco');
            }
            if (newFile.SheetNames.length > 0) {
                XLSX.writeFile(newFile, "combinedCaseFile.xlsx");
                console.log("Excel file generated successfully");
            } else {
                console.log("No data available for any sheets");
            }
        } catch (error) {
            console.error("Error generating Excel file:", error);
        }
    };
    async function getReco(url: any) {
        const alldata: any = Cookies.get("VR-user_Role");
        const tokens = JSON.parse(alldata).token;
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${tokens}`,
                },
            });
            if (response) {
                return response?.data?.data;
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
            return error;
        }
    }
    await generateExcelFile();
}
export default DownloadReport