/* eslint-disable @typescript-eslint/no-unused-vars */
import { DownloadOutlined, FileExcelOutlined } from "@ant-design/icons";
import {
  Button,
  Modal,
  Select,
  Steps,
  UploadProps,
  message,
  theme,
} from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import Dragger from "antd/es/upload/Dragger";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import DragAndDrop from "../utils/Drag-and-Drop";
import "./Import.css";
const { Option } = Select;
const Import = () => {
  // **************Static Data*********************
  const companyHeader = [
    { id: "1", content: "Vendor" },
    { id: "2", content: "Vendor Name" },
    { id: "3", content: "Document Number" },
    { id: "4", content: "Invoice Number" },
    { id: "5", content: "Closing Balance" },
    { id: "6", content: "Invoice Amount" },
    { id: "7", content: "Currency" },
    { id: "8", content: "Due Date" },
    { id: "9", content: "Document Date" },
  ];
  const vendorFileHeader = [
    { id: "1", content: "Business Partner" },
    { id: "2", content: "Business Partner Name" },
    { id: "3", content: "Closing Balance" },
    { id: "4", content: "Invoice Amount" },
    { id: "5", content: "Currency" },
    { id: "6", content: "Due Date" },
    { id: "7", content: "Docment Date" },
    { id: "8", content: "Document Number" },
    { id: "9", content: "Invoice Number" },
  ];
  const detailedFileHeader = [
    { id: "1", content: "Due Date" },
    { id: "2", content: "Company Code" },
    { id: "3", content: "Credit Amount(INR)" },
    { id: "4", content: "Debit Amount(INR)" },
    { id: "5", content: "Cheque Rtgs Neft" },
    { id: "6", content: "Payment Docment" },
    { id: "7", content: "Reference" },
    { id: "8", content: "Grn Number" },
    { id: "9", content: "Invoice Date" },
    { id: "10", content: "Document Date" },
    { id: "11", content: "Document Number" },
    { id: "12", content: "Invoice Number" },
  ];

  // @ ts-ignore
  const [UpdatedCompanyHeader, setUpdatedCompanyHeader] = useState([]);

  // @ ts-ignore
  const [size, setSize] = useState<SizeType>();
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  // @ ts-ignore
  const [companyFile, setcompanyFile] = useState([]);
  const [companyFileJson, setcompanyFileJson] = useState<any>([]);
  const [companyFileHeaderJson, setcompanyFileHeaderJson] = useState<any>([]);
  const [companyFileData, setcompanyFileData] = useState<any>([]);
  const [vendorNameOpation, setvendorNameOpation] = useState<any>([]);

  const [companyFileName, setcompanyFileName] = useState("");

  const [vendorfileName, setvendorfileName] = useState("");

  const [detailedFileName, setdetailedFileName] = useState("");
  // @ ts-ignore
  const [sendData, setsendData] = useState(true);
  const [companyFileSelectedValues, setcompanyFileSelectedValues] = useState(
    Array.from({ length: 9 }, () => "")
  );
  const [vendorFileSelectedValues, setvendorFileSelectedValues] = useState(
    Array.from({ length: 9 }, () => "")
  );
  const [detailedFileSelectedValues, setdetailedFileSelectedValues] = useState(
    Array.from({ length: 12 }, () => "")
  );

  const [vendorFileJson, setvendorFileJson] = useState<any>([]);
  const [vendorFileHeaderJson, setvendorFileHeaderJson] = useState<any>([]);
  const [detailedFileJson, setdetailedFileJson] = useState<any>([]);
  const [detailedFileHeaderJson, setdetailedFileHeaderJson] = useState<any>([]);

  // **************for model************
  const [vendorName, SetvendorName] = useState("");
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  //************************** */

  // useEffect(() => {
  //   const getCall = async () => {
  //     const alldata: any = localStorage.getItem("VR-user_Role");

  //     const url = "http://localhost:3000/api/generate-report";
  //     const data = {
  //       vendorName: "UNIPARTS INDIA LTD",
  //     };
  //     const tokens = JSON.parse(alldata).token;
  //     const response = await axios.post(url, data, {
  //       headers: {
  //         Authorization: ` Bearer ${tokens}`,
  //         responseType: "arraybuffer",
  //       },
  //     });

  //     // Create a Blob from the binary data
  //     const blob = new Blob([response.data], {
  //       type: response.headers["content-type"],
  //     });

  //     // Create a download link
  //     const downloadLink = document.createElement("a");
  //     downloadLink.href = window.URL.createObjectURL(blob);
  //     downloadLink.download = "yourFileName.xlsx"; // Specify the file name

  //     // Append the link to the document
  //     document.body.appendChild(downloadLink);

  //     // Trigger the download
  //     downloadLink.click();

  //     // Remove the link from the document
  //     document.body.removeChild(downloadLink);
  //   };
  //   getCall();
  // }, []);

  // WORKING

  // useEffect(() => {
  //   const getCall = async () => {
  //     const alldata: any = localStorage.getItem("VR-user_Role");

  //     const url = "http://localhost:3000/api/generate-report";
  //     const data = {
  //       vendorName: "UNIPARTS INDIA LTD",
  //     };
  //     const tokens = JSON.parse(alldata).token;

  //     try {
  //       const response = await axios.post(url, data, {
  //         headers: {
  //           Authorization: `Bearer ${tokens}`,
  //         },
  //         responseType: "arraybuffer",
  //       });

  //       // Create a Blob from the binary data
  //       const blob = new Blob([response.data], {
  //         type: response.headers["content-type"],
  //       });

  //       // Create a download link
  //       const downloadLink = document.createElement("a");
  //       downloadLink.href = window.URL.createObjectURL(blob);
  //       downloadLink.download = "CasePData.xlsx"; // Specify the file name

  //       // Append the link to the document
  //       document.body.appendChild(downloadLink);

  //       // Trigger the download
  //       downloadLink.click();

  //       // Remove the link from the document
  //       document.body.removeChild(downloadLink);
  //     } catch (error) {
  //       console.error("Error downloading file:", error);
  //       // Handle the error appropriately
  //     }
  //   };

  //   getCall();
  // }, []);

  console.log(companyFileSelectedValues, "lkhk");

  const handleSelectChange2 = (value: any, dropdownIndex: any) => {
    const updatedSelectedValues = [...vendorFileSelectedValues];
    updatedSelectedValues[dropdownIndex] = value;
    setvendorFileSelectedValues(updatedSelectedValues);
  };

  const handleSelectChange3 = (value: any, dropdownIndex: any) => {
    const updatedSelectedValues = [...detailedFileSelectedValues];
    updatedSelectedValues[dropdownIndex] = value;
    setdetailedFileSelectedValues(updatedSelectedValues);
  };

  // const companyFileHeader = [
  //   "Vendor",
  //   "Vendor Name",
  //   "Document Number",
  //   "Invoice Number",
  //   "Closing Balance",
  //   "Invoice Amount",
  //   "Currency",
  //   "Due Date",
  //   "Document Date",
  // ];
  // const vendorFileHeader = [
  //   "Business Partner",
  //   "Business Partner Name",
  //   "Closing Balance",
  //   "Invoice Amount",
  //   "Currency",
  //   "Due Date",
  //   "Docment Date",
  //   "Document Number",
  //   "Invoice Number",
  // ];

  // const detailedFileHeader = [
  //   "Due Date",
  //   "Company Code",
  //   "Credit Amount(INR)",
  //   "Debit Amount(INR)",
  //   "Cheque Rtgs Neft",
  //   "Payment Docment",
  //   "Reference",
  //   "Grn Number",
  //   "Invoice Date",
  //   "Document Date",
  //   "Document Number",
  //   "Invoice Number",
  // ];

  const props: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".xlsm, .xlsx,.xls",
    maxCount: 1,
    // action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    showUploadList: true,
    customRequest: ({ file, onSuccess, onError }: any) => {
      if (
        file != "" &&
        (file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
          file.type === "application/vnd.ms-excel" ||
          file.type === "application/vnd.ms-excel.sheet.macroEnabled.12")
      ) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target) {
            const data = event.target.result;
            const workbook = XLSX.read(data, { type: "binary" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            const headers: any = jsonData[0];
            const trimmedHeaders = headers.map((str: any) =>
              str.trim().replace(/\s+/g, " ")
            );
            jsonData[0] = trimmedHeaders;
            const newArray = trimmedHeaders.map((content: any, index: any) => ({
              id: (index + 1).toString(),
              content,
            }));
            console.log("JSON Data:", jsonData);
            console.log("Headers:", headers);
            if (current == 0) {
              setcompanyFile(file);
              setcompanyFileJson(jsonData);
              setcompanyFileHeaderJson(newArray);
              setcompanyFileName(file.name);
              onSuccess();
            } else if (current == 2) {
              setvendorFileJson(jsonData);
              setvendorFileHeaderJson(trimmedHeaders);
              onSuccess();
              setvendorfileName(file.name);
            } else if (current == 4) {
              setdetailedFileJson(jsonData);
              setdetailedFileHeaderJson(trimmedHeaders);
              setdetailedFileName(file.name);
              onSuccess();
            }
          }
        };
        reader.readAsBinaryString(file);
      } else {
        onError();
        setTimeout(() => {
          message.error(`Please upload excle file.`);
        }, 2000);
      }
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const uploadFile = (Filename: any) => (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        {/* <InboxOutlined /> */}
        <FileExcelOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag file to this area to upload {Filename}
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading
        company data or other banned files.
      </p>
    </Dragger>
  );

  const steps: any = [
    {
      title: "First",
      content: (
        <div style={{ margin: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >
            <div>
              <Button type="primary" icon={<DownloadOutlined />} size={size}>
                Sample file
              </Button>
            </div>
          </div>
          <div>{uploadFile("Company File")}</div>
        </div>
      ),
    },
    {
      title: "Second",
      content: (
        <>
          <DragAndDrop
            initialBoxOneItems={companyFileHeaderJson}
            initialBoxTwoItems={UpdatedCompanyHeader}
            defaultStaticContent={companyHeader}
          />
        </>
      ),
      // content: (
      //   <div className="Step2Main">
      //     <div className="Step2Note">
      //       Note: All the fields are mandatory and Select your file column name
      //       with matched dropdown
      //     </div>
      //     <div className="Step2Dropdown">
      //       {companyFileHeader.map((key: any, index) => (
      //         <div className="DropdownMaindiv" key={index}>
      //           <div style={{ marginLeft: "12px", width: "100%" }}>{key}: </div>
      //           <Select
      //             key={index}
      //             className="Dropdown"
      //             // style={{ width: 300, margin: '8px' }}
      //             placeholder={`select your ${key} column`}
      //             onChange={(value) => handleSelectChange(value, index)}
      //           >
      //             {companyFileHeaderJson
      //               .filter(
      //                 (option: any) =>
      //                   !companyFileSelectedValues.includes(option)
      //               )
      //               .map((option: any) => (
      //                 <Option key={option} value={option}>
      //                   {option}
      //                 </Option>
      //               ))}
      //           </Select>
      //         </div>
      //       ))}
      //     </div>
      //   </div>
      // ),
    },
    {
      title: "Thrid",
      content: (
        <div style={{ margin: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >
            <div>
              <Button type="primary" icon={<DownloadOutlined />} size={size}>
                Sample file
              </Button>
            </div>
          </div>
          <div>{uploadFile("Company File")}</div>
        </div>
      ),
    },
    {
      title: "Foruth",
      content: (
        <div className="Step2Main">
          <div className="Step2Note">
            Note: All the fields are mandatory and Select your file column name
            with matched dropdown
          </div>
          <div className="Step2Dropdown">
            {vendorFileHeader.map((key: any, index) => (
              <div className="DropdownMaindiv" key={index}>
                <div style={{ marginLeft: "12px", width: "100%" }}>{key}: </div>
                <Select
                  key={index}
                  className="Dropdown"
                  // style={{ width: 300, margin: '8px' }}
                  placeholder={`select your ${key} column`}
                  onChange={(value) => handleSelectChange2(value, index)}
                >
                  {vendorFileHeaderJson
                    .filter(
                      (option: any) =>
                        !vendorFileSelectedValues.includes(option)
                    )
                    .map((option: any) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                </Select>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Five",
      content: (
        <div style={{ margin: "20px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >
            <div>
              <Button type="primary" icon={<DownloadOutlined />} size={size}>
                Sample file
              </Button>
            </div>
          </div>
          <div>{uploadFile("Company File")}</div>
        </div>
      ),
    },
    {
      title: "Last",
      content: (
        <div className="Step2Main">
          <div className="Step2Note">
            Note: All the fields are mandatory and Select your file column name
            with matched dropdown
          </div>
          <div className="Step2Dropdownlast">
            {detailedFileHeader.map((key: any, index) => (
              <div className="DropdownMaindivlast" key={index}>
                <div style={{ marginLeft: "12px", width: "100%" }}>{key}: </div>
                <Select
                  key={index}
                  className="Dropdown"
                  // style={{ width: 300, margin: '8px' }}
                  placeholder={`select your ${key} column`}
                  onChange={(value) => handleSelectChange3(value, index)}
                >
                  {detailedFileHeaderJson
                    .filter(
                      (option: any) =>
                        !detailedFileSelectedValues.includes(option)
                    )
                    .map((option: any) => (
                      <Option key={option} value={option}>
                        {option}
                      </Option>
                    ))}
                </Select>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  async function companyFileHeaderChanged() {
    if (companyFileJson.length > 0 && companyFileSelectedValues.length > 0) {
      const data = companyFileJson[0];
      companyFileSelectedValues.forEach((items, indexs) => {
        const index = data.indexOf(items);
        if (index != -1) {
          data[index] = companyHeader[indexs];
        }
      });
      const ans: any = companyFileJson;
      ans[0] = data;
      console.log(data);

      const headers: any = ans[0];
      const dataRows: any = ans;
      const vendorNamedropdown: any = [];

      const transformToObjects = (headers: any, data: any) => {
        let TransFormToObjectsData = data.map((row: any, idx: number) => {
          const rowData: any = {};
          headers.forEach((header: any, index: any) => {
            // rowData[header] = row[index];
            let value = row[index];
            if (value != "" && value != undefined && value != null) {
              if (header == "Invoice Number" || header == "Document Number") {
                if (value != "" && value != undefined && value != null) {
                  value = String(value).replace(/[\W_]+/g, "");
                }
              }
              if (header == "Vendor Name") {
                if (idx !== 0) {
                  vendorNamedropdown.push(value.trim());
                }
              }
              rowData[header] = `${value}`.trim();
            } else {
              // console.log("value", value);
              // message.error(
              //   `Check Your excle file some mandatory filed data is empty.`
              // );
              // setsendData(false);
            }
          });
          return rowData;
        });

        console.log("DATA", vendorNamedropdown);

        console.log({ vendorNamedropdown });
        const set = new Set(vendorNamedropdown);
        console.log({ set });
        const uniqueArray = [...set];
        console.log({ uniqueArray });

        setvendorNameOpation(uniqueArray);

        TransFormToObjectsData = TransFormToObjectsData.slice(1);
        setcompanyFileData(TransFormToObjectsData);
      };

      transformToObjects(headers, dataRows);
      showModal();

      // let response2 = await axios.get(url2,
      //   {
      //     headers: {
      //       'Authorization': ` Bearer ${tokenforcall}`
      //     }
      //   }
      // )

      // console.log(response2);
      // if (response2) {
      //   showModal();
      // }
    }
  }

  async function postData(transformedData: any) {
    const alldata: any = Cookies.get("VR-user_Role");
    const url =
      "https://concerned-plum-crayfish.cyclic.app/api/upload/masterOpen";
    const data1 = {
      user: JSON.parse(alldata)?.ID,
      fileName: companyFileName,
      data: transformedData,
    };
    const url2 =
      "https://concerned-plum-crayfish.cyclic.app/api/upload/getAllMasterData";
    const tokens = JSON.parse(alldata).token;
    //  let tokenforcall = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTY4YjlhZDEyZjhmNjBkZjFiODkyMTEiLCJlbWFpbCI6InVzZXIxQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzAxNDQ2OTc1fQ.c8jFToMIpSLRZtXVxQW1Bj8zfaj6RG89CTab97siz2c";
    try {
      const response = await axios.post(url, data1, {
        headers: {
          Authorization: ` Bearer ${tokens}`,
        },
      });
      if (response.status == 201) {
        const response2 = await axios.get(url2, {
          headers: {
            Authorization: ` Bearer ${tokens}`,
          },
        });

        console.log(response2);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function vendorFileHeaderChanged() {
    if (vendorFileJson.length > 0 && vendorFileSelectedValues.length > 0) {
      const data = vendorFileJson[0];
      vendorFileSelectedValues.forEach((items, indexs) => {
        const index = data.indexOf(items);
        if (index != -1) {
          data[index] = vendorFileHeader[indexs];
        }
      });
      const ans: any = vendorFileJson;
      ans[0] = data;
      console.log(data);

      const headers: any = ans[0];
      const dataRows: any = ans;

      const transformToObjects = (headers: any, data: any) => {
        return data.map((row: any) => {
          const rowData: any = {};
          headers.forEach((header: any, index: any) => {
            // rowData[header] = row[index];
            let value = row[index];
            // Trim all values
            if (header === "Invoice Number" || header === "Document Number") {
              if (value != "" && value != undefined && value != null) {
                value = String(value).replace(/[\W_]+/g, "");
              }
            }
            rowData[header] = `${value}`.trim();
          });
          return rowData;
        });
      };

      let transformedData = transformToObjects(headers, dataRows);
      console.log(transformedData);
      transformedData = transformedData.slice(1);
      setvendorFileJson(transformedData);
      const alldata: any = Cookies.get("VR-user_Role");

      const url =
        "https://concerned-plum-crayfish.cyclic.app/api/upload/vendorOpen";
      const data1 = {
        user: JSON.parse(alldata)?.ID,
        fileName: vendorfileName,
        data: transformedData,
      };
      const url2 =
        "https://concerned-plum-crayfish.cyclic.app/api/upload/getAllVendorData";
      const tokens = JSON.parse(alldata).token;
      //  let tokenforcall = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTY4YjlhZDEyZjhmNjBkZjFiODkyMTEiLCJlbWFpbCI6InVzZXIxQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzAxNDQ2OTc1fQ.c8jFToMIpSLRZtXVxQW1Bj8zfaj6RG89CTab97siz2c";
      try {
        const response = await axios.post(url, data1, {
          headers: {
            Authorization: ` Bearer ${tokens}`,
          },
        });
        if (response.status == 201) {
          const response2 = await axios.get(url2, {
            headers: {
              Authorization: ` Bearer ${tokens}`,
            },
          });
          console.log(response2);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  async function detailedFileHeaderChanged() {
    if (detailedFileJson.length > 0 && detailedFileSelectedValues.length > 0) {
      const data = detailedFileJson[0];
      detailedFileSelectedValues.forEach((items, indexs) => {
        const index = data.indexOf(items);
        if (index != -1) {
          data[index] = detailedFileHeader[indexs];
        }
      });
      const ans: any = detailedFileJson;
      ans[0] = data;
      console.log(data);

      const headers: any = ans[0];
      const dataRows: any = ans;

      const transformToObjects = (headers: any, data: any) => {
        return data.map((row: any) => {
          const rowData: any = {};
          headers.forEach((header: any, index: any) => {
            // rowData[header] = row[index];
            let value = row[index];
            // Trim all values
            if (header == "Invoice Number" || header == "Document Number") {
              if (value != "" && value != undefined && value != null) {
                value = String(value).replace(/[\W_]+/g, "");
              }
            }
            rowData[header] = `${value}`.trim();
          });
          return rowData;
        });
      };

      let transformedData = transformToObjects(headers, dataRows);
      console.log(transformedData);
      transformedData = transformedData.slice(1);
      setdetailedFileJson(transformedData);
      // let newArray = transformedData.flatMap((items:any) => Array(3).fill(items));
      const alldata: any = Cookies.get("VR-user_Role");

      const url =
        "https://concerned-plum-crayfish.cyclic.app/api/upload/CompleteDetails";
      const data1 = {
        user: JSON.parse(alldata)?.ID,
        fileName: detailedFileName,
        data: transformedData,
      };
      const url2 =
        "https://concerned-plum-crayfish.cyclic.app/api/upload/getAllCompleteDetailsData";
      const tokens = JSON.parse(alldata).token;
      //  let tokenforcall = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTY4YjlhZDEyZjhmNjBkZjFiODkyMTEiLCJlbWFpbCI6InVzZXIxQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzAxNDQ2OTc1fQ.c8jFToMIpSLRZtXVxQW1Bj8zfaj6RG89CTab97siz2c";
      try {
        const response = await axios.post(url, data1, {
          headers: {
            Authorization: ` Bearer ${tokens}`,
          },
        });
        if (response.status == 201) {
          const response2 = await axios.get(url2, {
            headers: {
              Authorization: ` Bearer ${tokens}`,
            },
          });
          console.log(response2);
        }
      } catch (error) {
        console.log(error);
      }
    }
    message.success("Processing complete!");
  }

  async function postVendorName(name: any) {
    const alldata: any = Cookies.get("VR-user_Role");
    const tokens = JSON.parse(alldata).token;
    const url =
      "https://concerned-plum-crayfish.cyclic.app/api/generate-report";
    const data = {
      user: JSON.parse(alldata)?.ID,
      vendorName: name,
    };

    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: ` Bearer ${tokens}`,
          responseType: "arraybuffer",
        },
      });
      if (response.status == 201) {
        console.log(response);
      }
      // REPORT
      // Create a Blob from the binary data
      const blob = new Blob([response.data], {
        type: response.headers["content-type"],
      });

      // Create a download link
      const downloadLink = document.createElement("a");
      downloadLink.href = window.URL.createObjectURL(blob);
      downloadLink.download = "CasePData.xlsx"; // Specify the file name

      // Append the link to the document
      document.body.appendChild(downloadLink);

      // Trigger the download
      downloadLink.click();

      // Remove the link from the document
    } catch (error) {
      console.log(error);
    }
  }

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    if (sendData && companyFileData.length > 0) {
      postData(companyFileData);
      setTimeout(() => {
        setOpen(false);
        setConfirmLoading(false);
      }, 2000);
    }
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };

  const next = () => {
    if (current == 0) {
      if (
        companyFileJson.length != undefined &&
        companyFileJson.length != null &&
        companyFileJson.length > 0
      ) {
        setCurrent(current + 1);
      } else {
        message.error(`Please upload excle file.`);
      }
    } else if (current == 1) {
      const allValuesSelected = companyFileSelectedValues.every(
        (value) => value !== ""
      );
      if (allValuesSelected) {
        companyFileHeaderChanged();
        setCurrent(current + 1);
      } else {
        message.error(`Please select a value for each dropdown.`);
      }
    } else if (current == 2) {
      if (
        vendorFileJson.length != undefined &&
        vendorFileJson.length != null &&
        vendorFileJson.length > 0
      ) {
        setCurrent(current + 1);
      } else {
        message.error(`Please upload excle file.`);
      }
    } else if (current == 3) {
      const allValuesSelected = vendorFileSelectedValues.every(
        (value) => value !== ""
      );
      if (allValuesSelected) {
        vendorFileHeaderChanged();
        setCurrent(current + 1);
      } else {
        message.error(`Please select a value for each dropdown.`);
      }
    } else if (current == 4) {
      if (
        detailedFileJson.length != undefined &&
        detailedFileJson.length != null &&
        detailedFileJson.length > 0
      ) {
        setCurrent(current + 1);
      } else {
        message.error(`Please upload excle file.`);
      }
    } else if (current == 5) {
      const allValuesSelected = detailedFileSelectedValues.every(
        (value) => value !== ""
      );
      if (allValuesSelected) {
        detailedFileHeaderChanged();
        if (vendorName != "" && vendorName != null && vendorName != undefined) {
          postVendorName(vendorName);
        }
      } else {
        message.error(`Please select a value for each dropdown.`);
      }
    }
  };
  // const prev = () => {
  //   setCurrent(current - 1);
  // };
  const items = steps.map((item: any) => ({
    key: item.title,
    title: item.title,
  }));

  const contentStyle: React.CSSProperties = {
    height: "350px",
    // textAlign: 'center',
    // display: "grid",
    // placeItems: "center",
    // color: token.colorTextTertiary,
    // backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `2px solid ${token.colorBorder}`,
    // border: `2px dashed ${token.colorBorder}`,
    marginTop: 16,
  };
  return (
    <>
      <div style={{ margin: "20px" }}>
        <Steps current={current} items={items} />
        <div style={contentStyle}>{steps[current].content}</div>
        <div
          style={{
            marginTop: 24,
            display: "Flex",
            justifyContent: "space-around",
          }}
        >
          {/* {current > 0 && (
            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
              Previous
            </Button>
          )} */}
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={next}>
              Generate Report
            </Button>
          )}
        </div>
      </div>

      <Modal
        title="Title"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>Select your vendor name</p>
        <Select
          className="Dropdown"
          // style={{ width: 300, margin: '8px' }}
          placeholder={`select Vender naem`}
          onChange={(value) => SetvendorName(value)}
        >
          {vendorNameOpation.map((option: any) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </Modal>
    </>
  );
};

export default Import;
