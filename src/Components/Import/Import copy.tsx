import React, { useEffect, useState } from "react";
import {
  Button,
  Drawer,
  Grid,
  message,
  Modal,
  Select,
  Space,
  Steps,
  theme,
  UploadProps,
} from "antd";
import * as XLSX from "xlsx";
import Dragger from "antd/es/upload/Dragger";
import { DownloadOutlined } from "@ant-design/icons";
import { ArrowRightOutlined, EyeOutlined } from "@ant-design/icons";

import { SizeType } from "antd/es/config-provider/SizeContext";
import { FileExcelOutlined } from "@ant-design/icons";
import "./Import.css";
import axios from "axios";
import DragAndDrop from "../utils/Drag-and-Drop";

const { Option } = Select;
const Import = () => {
  // **************Static Data*********************
  const companyHeader = [
    { id: '1', content: 'Vendor' },
    { id: '2', content: 'Vendor Name' },
    { id: '3', content: 'Document Number' },
    { id: '4', content: 'Invoice Number' },
    { id: '5', content: 'Closing Balance' },
    { id: '6', content: 'Invoice Amount' },
    { id: '7', content: 'Currency' },
    { id: '8', content: 'Due Date' },
    { id: '9', content: 'Document Date' }
  ];
  const vendorHeader = [
    { id: '1', content: 'Business Partner' },
    { id: '2', content: 'Business Partner Name' },
    { id: '3', content: 'Closing Balance' },
    { id: '4', content: 'Invoice Amount' },
    { id: '5', content: 'Currency' },
    { id: '6', content: 'Due Date' },
    { id: '7', content: 'Docment Date' },
    { id: '8', content: 'Document Number' },
    { id: '9', content: 'Invoice Number' }
  ];
  const detailedHeader = [
    { id: '1', content: 'Due Date' },
    { id: '2', content: 'Company Code' },
    { id: '3', content: 'Credit Amount(INR)' },
    { id: '4', content: 'Debit Amount(INR)' },
    { id: '5', content: 'Cheque Rtgs Neft' },
    { id: '6', content: 'Payment Docment' },
    { id: '7', content: 'Reference' },
    { id: '8', content: 'Grn Number' },
    { id: '9', content: 'Invoice Date' },
    { id: '10', content: 'Document Date' },
    { id: '11', content: 'Document Number' },
    { id: '12', content: 'Invoice Number' }
  ];
  // ****************for steps***************************
  const [size, setSize] = useState<SizeType>();
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(false);
  // ****************for First file / companyfile***************************
  const [companyFileJson, setcompanyFileJson] = useState<any>([]);
  const [companyFileHeader, setcompanyFileHeader] = useState<any>([]);
  const [companyFileName, setcompanyFileName] = useState("");
  // ****************for Second file / Vendorfile***************************
  const [vendorfileName, setvendorfileName] = useState("");
  const [vendorFileHeader, setvendorFileHeader] = useState<any>([]);
  const [vendorFileJson, setvendorFileJson] = useState<any>([]);

  // ****************for Thrid file / detailedFile***************************
  const [detailedFileName, setdetailedFileName] = useState("");
  const [detailedFileJson, setdetailedFileJson] = useState<any>([]);
  const [detailedFileHeader, setdetailedFileHeader] = useState<any>([]);

  // ****************for Panle ***************************
  const [OpenPanel, setOpenPanel] = useState(false);

  // ***************************for mapping********************
  const [UpdateHeader, setUpdateHeader] = useState<any>([]);
  // ************************for vendor name***************
  const [vendorNameOpation, setvendorNameOpation] = useState<any>([]);
  const [vendorName, SetvendorName] = useState("");

  // *****************for reports p case***************
  const [pcaseReport, setpcaseReport] = useState([]);
  const [pcaseReportHeader, setpcaseReportHeader] = useState([]);

  // **************for model************
  const [confirmLoading, setConfirmLoading] = useState(false);

  // ********************for uplode every file***************
  const props: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".xlsm, .xlsx,.xls",
    maxCount: 1,
    // action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    showUploadList: true,
    customRequest: ({ file, onSuccess, onError, onUpload }: any) => {
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
            const newArray = trimmedHeaders.map((content: any, index: any) => ({ id: (index + 5).toString(), content }));
            console.log("JSON Data:", jsonData);
            console.log("Headers:", headers);
            if (current == 0) {
              // setcompanyFile(file);
              setcompanyFileJson(jsonData);
              setcompanyFileHeader(newArray);
              setcompanyFileName(file.name);
              onSuccess();
            } else if (current == 1) {
              setvendorFileJson(jsonData);
              setvendorFileHeader(newArray);
              onSuccess();
              setvendorfileName(file.name);
            } else if (current == 2) {
              setdetailedFileJson(jsonData);
              setdetailedFileHeader(newArray);
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

  // *****************for show uplode every file************
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

  // ***************** main steps****************
  const steps: any = [
    {
      title: "First",
      content: (
        <div style={{ margin: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
            <div>
              <Button type="primary" icon={<DownloadOutlined />} size={size}>
                Sample file
              </Button>
            </div>
            <div>
              <Button type="primary" size={size} onClick={() => next()}>
                Next <ArrowRightOutlined />
              </Button>
            </div>
          </div>
          <div>
            {uploadFile("Company File")}
          </div>
          {/* {companyFileJson.length > 0 ?
            <div className="excel-table-container">
              <table className="excel-table">
                <thead>
                  <tr>
                    {companyFileJson[0].map((header: any, index: any) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {companyFileJson.slice(1).map((row: any, rowIndex: any) => (
                    <tr key={rowIndex}>
                      {row.map((cell: any, cellIndex: any) => (
                        <td key={cellIndex}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            : null} */}
        </div>
      ),
    },
    {
      title: "Second",
      content: (
        <div style={{ margin: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
            <div>
              <Button type="primary" icon={<DownloadOutlined />} size={size}>
                Sample file
              </Button>
            </div>
            <div>
              <Button type="primary" size={size} onClick={() => next()}>
                Next <ArrowRightOutlined />
              </Button>
            </div>
          </div>
          <div>
            {uploadFile("Company File")}
          </div>
        </div>
      ),
    },
    {
      title: "Thrid",
      content: (
        <div style={{ margin: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
            <div>
              <Button type="primary" icon={<DownloadOutlined />} size={size}>
                Sample file
              </Button>
            </div>
            <div>
              <Button type="primary" size={size} onClick={() => next()}>
                Next <ArrowRightOutlined />
              </Button>
            </div>
          </div>
          <div>
            {uploadFile("Company File")}
          </div>
        </div>
      ),
    },
    {
      title: "Report",
      content: (
        <>
          {/* {pcaseReport.length <= 0 && pcaseReportHeader.length <=0 ? */}
          <div style={{ display: "Grid", placeItems: "center" }}>
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
          </div>
          {/* :
            <div className="excel-table-container">
            <table className="excel-table">
              <thead>
                <tr>
                  {pcaseReportHeader?.map((header)=> (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pcaseReport?.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {pcaseReportHeader?.map(header => (
                      <td key={header}>{row[header]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      } */}
        </>
      ),
    },
  ];

  // *****************************post all data to this function******  
  async function postData(url: any, data: any, FileName: any) {
    const alldata: any = localStorage.getItem("VR-user_Role");
    const tokens = JSON.parse(alldata).token;
    const finaltemp = {
      user: JSON.parse(alldata)?.ID,
      fileName: FileName,
      data: data,
    };
    try {
      const response = await axios.post(url, finaltemp, {
        headers: {
          Authorization: ` Bearer ${tokens}`,
        },
      });
      if (response.status == 201) {
        console.log(response);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  // *****************post vendor naem to this function******8

  async function postVendorName() {
    if (vendorName != "" && vendorName != undefined && vendorName != null) {
      const alldata: any = localStorage.getItem("VR-user_Role");
      const tokens = JSON.parse(alldata).token;
      const url = "https://concerned-plum-crayfish.cyclic.app/api/report/dynamic-report";
      const data = {
        user: JSON.parse(alldata)?.ID,
        vendorName: vendorName,
      };

      try {
        const response = await axios.post(url, data, {
          headers: {
            Authorization: ` Bearer ${tokens}`,
          },
        });
        if (response.data.success === "ok") {
          const getPCaseUrl = "https://concerned-plum-crayfish.cyclic.app/api/generate-report/p-case";

          try {
            const pCaseResponse = await axios.get(getPCaseUrl, {
              headers: {
                Authorization: `Bearer ${tokens}`,
              },
            });
            const data = pCaseResponse.data;

            // setpcaseReportHeader(data[0]);
            // const newArray = data.slice(1);
            // setpcaseReport(newArray);

            const ws = XLSX.utils.json_to_sheet(data);

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

            XLSX.writeFile(wb, "pCaseFile.xlsx");

            console.log("Excel file generated successfully");
          } catch (error) {
            console.error("Error fetching data or generating Excel file:", error);
          }
          return;
        }
      } catch (error) {
        console.log(error);
      }
    }
    else {
      message.error(`Please Select vendor Name`);
    }
  }


  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    if (true) {
      // postData(companyFileData);
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

  // *************for first file / companyfile ********************

  function companyFileCheck() {
    setOpenPanel(true);
  }

  async function companyFileMapping() {
    if (current == 0) {
      if (UpdateHeader?.length == companyHeader?.length) {
        let convertFileHeader = companyFileHeader.map((item: any) => item.content);
        let convertHeader = companyHeader.map((item: any) => item.content);
        UpdateHeader.forEach((item: any, idx: any) => {
          const index = convertFileHeader.indexOf(item?.content);
          if (index != -1) {
            convertFileHeader[index] = convertHeader[idx];
          }
        });
        let Allfilejson = companyFileJson;
        Allfilejson[0] = convertFileHeader;
        try {
          const transformedData = await transformToObjects(convertFileHeader, Allfilejson);
          console.log("Transformed data:", transformedData);
          // let url = "https://concerned-plum-crayfish.cyclic.app/api/upload/masterOpen";
          let url = "https://concerned-plum-crayfish.cyclic.app/api/master/dynamic-master";
          await postData(url, transformedData, companyFileName);
          onClose();
          setCurrent(current + 1);
          setUpdateHeader([]);
        }
        catch (error) {
          console.error("Error during transformation:", error);
        }

      }
      else {
        message.error(`Please select a value for each dropdown.`);
      }
    }
  }

  // ****************************for company/ first file
  const transformToObjects = async (headers: any, data: any) => {
    let vendorNamedropdown: any = [];
    let TransFormToObjectsData = await Promise.all(
      data.map(async (row: any, idx: number) => {
        const rowData: any = {};
        await Promise.all(
          headers.map(async (header: any, index: any) => {
            let value = row[index];
            if (value !== "" && value !== undefined && value !== null) {
              if (header === "Invoice Number" || header === "Document Number") {
                value = String(value).replace(/[\W_]+/g, "");
              }
              if (header === "Vendor Name" && idx !== 0) {
                vendorNamedropdown.push(value.trim());
              }
              rowData[header] = `${value}`.trim();
            } else {
              // Handle empty values or show an error message
              // message.error(`Check Your excel file some mandatory filed data is empty.`);
              // setsendData(false);
            }
          })
        );
        return rowData;
      })

    );

    console.log("DATA", vendorNamedropdown);
    console.log({ vendorNamedropdown });

    const set = new Set(vendorNamedropdown);
    console.log({ set });
    const uniqueArray = [...set];
    console.log({ uniqueArray });

    setvendorNameOpation(uniqueArray);

    TransFormToObjectsData = TransFormToObjectsData.slice(1);
    return TransFormToObjectsData;
  };

  // **********************comman********************
  const transformToObjectsAll = async (headers: any, data: any) => {
    let TransFormToObjectsData = await Promise.all(
      data.map(async (row: any) => {
        const rowData: any = {};
        await Promise.all(
          headers.map(async (header: any, index: any) => {
            let value = row[index];
            if (value !== "" && value !== undefined && value !== null) {
              if (header === "Invoice Number" || header === "Document Number") {
                value = String(value).replace(/[\W_]+/g, "");
              }
              rowData[header] = `${value}`.trim();
            } else {
              // Handle empty values or show an error message
              // message.error(`Check Your excel file some mandatory filed data is empty.`);
              // setsendData(false);
            }
          })
        );
        return rowData;
      })

    );;
    TransFormToObjectsData = TransFormToObjectsData.slice(1);
    return TransFormToObjectsData;
  };


  // ***********************for vendor file ************
  function vendorFileCheck() {
    setOpenPanel(true);
  }
  async function vendorFileMapping() {
    if (current == 1) {
      if (UpdateHeader?.length == vendorHeader?.length) {
        let convertFileHeader = vendorFileHeader.map((item: any) => item.content);
        let convertHeader = vendorHeader.map((item: any) => item.content);
        UpdateHeader.forEach((item: any, idx: any) => {
          const index = convertFileHeader.indexOf(item?.content);
          if (index != -1) {
            convertFileHeader[index] = convertHeader[idx];
          }
        });
        let Allfilejson = vendorFileJson;
        Allfilejson[0] = convertFileHeader;
        try {
          const transformedData = await transformToObjectsAll(convertFileHeader, Allfilejson);
          console.log("Transformed data:", transformedData);
          // let url =  "https://concerned-plum-crayfish.cyclic.app/api/upload/vendorOpen";;
          let url = "https://concerned-plum-crayfish.cyclic.app/api/vendor/dynamic-vendor";
          onClose();
          setCurrent(current + 1);
          setUpdateHeader([]);
          await postData(url, transformedData, vendorfileName);
        }
        catch (error) {
          console.error("Error during transformation:", error);
        }

      }
      else {
        message.error(`Please select a value for each dropdown.`);
      }
    }
  }
  // ***********************for detailed File  ************
  function detailedFileCheck() {
    setOpenPanel(true);
  }
  async function detailedFileMapping() {
    if (current == 2) {
      if (UpdateHeader?.length == detailedHeader?.length) {
        let convertFileHeader = detailedFileHeader.map((item: any) => item.content);
        let convertHeader = detailedHeader.map((item: any) => item.content);
        UpdateHeader.forEach((item: any, idx: any) => {
          const index = convertFileHeader.indexOf(item?.content);
          if (index != -1) {
            convertFileHeader[index] = convertHeader[idx];
          }
        });
        let Allfilejson = detailedFileJson;
        Allfilejson[0] = convertFileHeader;
        try {
          const transformedData = await transformToObjectsAll(convertFileHeader, Allfilejson);
          console.log("Transformed data:", transformedData);
          // let url =  "https://concerned-plum-crayfish.cyclic.app/api/upload/CompleteDetails";
          let url = "https://concerned-plum-crayfish.cyclic.app/api/complete/dynamic-complete";
          onClose();
          setCurrent(current + 1);
          await postData(url, transformedData, detailedFileName);
        }
        catch (error) {
          console.error("Error during transformation:", error);
        }
      }
      else {
        message.error(`Please select a value for each dropdown.`);
      }
    }
  }

  // *********************for click on next step

  const next = () => {
    if (current == 0) {
      if (
        companyFileJson.length != undefined &&
        companyFileJson.length != null &&
        companyFileJson.length > 0
      ) {
        companyFileCheck();
      }
      else {
        message.error(`Please upload excle file.`);
      }
    }
    else if (current == 1) {
      if (
        vendorFileJson.length != undefined &&
        vendorFileJson.length != null &&
        vendorFileJson.length > 0
      ) {
        vendorFileCheck();
      } else {
        message.error(`Please upload excle file.`);
      }
    }
    else if (current == 2) {
      if (
        detailedFileJson.length != undefined &&
        detailedFileJson.length != null &&
        detailedFileJson.length > 0
      ) {
        detailedFileCheck();
      } else {
        message.error(`Please upload excle file.`);
      }
    }
    else if (current == 3) {
    }
  };

  const onClose = () => {
    setOpenPanel(false);
  };

  const items = steps.map((item: any) => ({
    key: item.title,
    title: item.title,
  }));

  const contentStyle: React.CSSProperties = {
    height: "310px",
    borderRadius: token.borderRadiusLG,
    border: `2px solid ${token.colorBorder}`,
    marginTop: 16,
  };

  function MappingCheck() {
    if (current == 0) {
      companyFileMapping();
    }
    else if (current == 1) {
      vendorFileMapping();
    }
    else if (current == 2) {
      detailedFileMapping();
    }
  }

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
          {/* {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )} */}
          {current === steps.length - 1 && (
            <Button type="primary" onClick={postVendorName}>
              Generate Report
            </Button>
          )}
        </div>
      </div>
      <Drawer
        title={`large Drawer`}
        placement="right"
        size={"large"}
        onClose={onClose}
        open={OpenPanel}
        width={900}
        extra={
          <Space>
            {/* <Button >Cancel</Button> */}
            <Button onClick={() => setOpen(true)} type="primary">
              <EyeOutlined />
            </Button>
            <Button onClick={MappingCheck} type="primary">
              Save
            </Button>
          </Space>
        }
      >
        <DragAndDrop
          initialBoxOneItems={
            current === 0 ? companyFileHeader :
              current === 1 ? vendorFileHeader :
                current === 2 ? detailedFileHeader :
                  null
          }
          boxTwoItems={UpdateHeader}
          setBoxTwoItems={setUpdateHeader}
          defaultStaticContent={
            current === 0 ? companyHeader :
              current === 1 ? vendorHeader :
                current === 2 ? detailedHeader :
                  null
          }
        />
      </Drawer>
      <Modal
        title="Title"
        open={open}


        onCancel={handleCancel}
        style={{ padding: "10px" }}
        width={950}


      >

        <div className="Prev_excelFile">
          <div style={{ overflowX: 'auto', maxHeight: '320px', /* Set the max height for the table body */ }}>
            <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid #ddd', position: "relative" }}>
              <thead>
                <tr>
                  {companyFileJson?.[0] && companyFileJson?.[0].map((header, index) => (
                    <th key={index} style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: 'green', color: "white", fontSize: '13px', fontFamily: 'Arial, sans-serif', whiteSpace: "nowrap", height: "30px", position: "sticky", top: "0" }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody style={{ overflowY: 'scroll' }}>
                {companyFileJson?.slice(1)?.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} style={{ border: '1px solid #ddd', padding: '8px', fontSize: '12px', fontFamily: 'Arial, sans-serif' }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* <p>Select your vendor name</p>
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
        </Select> */}
      </Modal>
    </>
  );
};

export default Import;
