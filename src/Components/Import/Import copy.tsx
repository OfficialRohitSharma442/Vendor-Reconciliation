import {
  ArrowRightOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileExcelOutlined,
  LoadingOutlined
} from "@ant-design/icons";
import {
  Button,
  Cascader,
  Drawer,
  Input,
  Modal,
  Select,
  Space,
  Spin,
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
  const [loading, setloading] = React.useState(false)
  const [loadingpannel, setloadingpannel] = React.useState(false)
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
  const vendorHeader = [
    { id: "1", content: "Business Partner" },
    { id: "2", content: "Business Partner Name" },
    { id: "3", content: "Closing Balance" },
    { id: "4", content: "Invoice Amount" },
    { id: "5", content: "Currency" },
    { id: "6", content: "Due Date" },
    { id: "7", content: "Document Date" },
    { id: "8", content: "Document Number" },
    { id: "9", content: "Invoice Number" },
  ];
  const detailedHeader = [
    { id: "1", content: "Due Date" },
    { id: "2", content: "Company Code" },
    { id: "3", content: "Credit Amount(INR)" },
    { id: "4", content: "Debit Amount(INR)" },
    { id: "5", content: "Cheque Rtgs Neft" },
    { id: "6", content: "Payment Document" },
    { id: "7", content: "Reference" },
    { id: "8", content: "Grn Number" },
    { id: "9", content: "Invoice Date" },
    { id: "10", content: "Document Date" },
    { id: "11", content: "Document Number" },
    { id: "12", content: "Invoice Number" },
  ];
  const DocumentTypeHeader = ["TDS Document Type", "PID Document Type"];
  const DocumentOptions = [
    {
      value: "starts-with",
      label: "Starts with",
    },
    {
      value: "ends-with",
      label: "Ends with",
    },
    {
      value: "Contains",
      label: "Contains",
    },
  ];
  // *******************url *************
  const companyPostUrl =
    "https://concerned-plum-crayfish.cyclic.app/api/master/dynamic-master";
  const vendorPostUrl =
    "https://concerned-plum-crayfish.cyclic.app/api/vendor/dynamic-vendor";
  const detailPostUrl =
    "https://concerned-plum-crayfish.cyclic.app/api/complete/dynamic-complete";
  const companyMappingUrl =
    "https://concerned-plum-crayfish.cyclic.app/api/mapping/master-mapping";
  const vendorMappingUrl =
    "https://concerned-plum-crayfish.cyclic.app/api/mapping/vendor-mapping";
  const detailMappingUrl =
    "https://concerned-plum-crayfish.cyclic.app/api/mapping/complete-mapping";
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

  // **************for model************

  // ******************for show priview*********************
  const [showfile, setshowfile] = useState<any>([]);
  // *****************state for document mapping *********
  const [inputValues, setInputValues] = useState([]);
  const [dropdownValues, setDropdownValues] = useState([]);

  // ********************for uplode every file***************
  const [customFileName, setCustomFileName] = useState<string | null>(null);

  const props: UploadProps = {
    name: "file",
    multiple: false,
    accept: ".xlsm, .xlsx,.xls",
    maxCount: 1,
    showUploadList: false,
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
            const jsonData = XLSX.utils.sheet_to_json(sheet, {
              header: 1,
              defval: "",
              blankrows: false,
            });
            const headers: any = jsonData[0];
            const trimmedHeaders = headers.map((str: any) =>
              str.trim().replace(/\s+/g, " ")
            );
            jsonData[0] = trimmedHeaders;
            const newArray = trimmedHeaders.map((content: any, index: any) => ({
              id: (index + 4).toString(),
              content,
            }));
            // console.log("JSON Data:", jsonData);
            // console.log("Headers:", headers);

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
    beforeUpload: (file) => {
      const customFileName = file.name;
      setCustomFileName(file.name);
      const modifiedFile = new File([file], customFileName, {
        type: file.type,
      });
      return Promise.resolve(modifiedFile);
    },

    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
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
    <>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          {/* <InboxOutlined /> */}
          <FileExcelOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload {Filename}
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from
          uploading company data or other banned files.
        </p>
      </Dragger>
      {customFileName && (
        <>
          <p>{customFileName}</p>
        </>
      )}
    </>
  );

  // ***********************
  const handleInputChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValues: any = [...inputValues];
    newInputValues[index] = e.target.value;
    setInputValues(newInputValues);
    // console.log(newInputValues);
  };
  const handleCascaderChange = (index: number, value: any) => {
    const newDropdownValues: any = [...dropdownValues];
    newDropdownValues[index] = value;
    setDropdownValues(newDropdownValues);
    // console.log(newDropdownValues)
  };

  // ***************** main steps****************
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
            <div style={{ display: "flex", gap: "20px" }}>
              <Button onClick={showfiles} type="primary">
                <EyeOutlined />
              </Button>
              <Button type="primary" size={size} onClick={() => next()}>
                Next <ArrowRightOutlined />
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
            <div style={{ display: "flex", gap: "20px" }}>
              <Button onClick={showfiles} type="primary">
                <EyeOutlined />
              </Button>
              <Button type="primary" size={size} onClick={() => next()}>
                Next <ArrowRightOutlined />
              </Button>
            </div>
          </div>
          <div>{uploadFile("Company File")}</div>
        </div>
      ),
    },
    {
      title: "Third",
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
            <div style={{ display: "flex", gap: "20px" }}>
              <Button onClick={showfiles} type="primary">
                <EyeOutlined />
              </Button>
              <Button type="primary" size={size} onClick={() => next()}>
                Next <ArrowRightOutlined />
              </Button>
            </div>
          </div>
          <div>{uploadFile("Company File")}</div>
        </div>
      ),
    },
    {
      title: "Report",
      content: (
        <>
          <div
            style={{
              display: "Grid",
              placeItems: "center",
              gridTemplateColumns: "1fr 1fr",
              margin: "20px",
            }}
          >
            {DocumentTypeHeader.map((item: any, idx: any) => {
              return (
                <div key={item}>
                  <p>{item}</p>
                  <Input
                    addonAfter={
                      <Cascader
                        options={DocumentOptions}
                        placeholder="Select Filter"
                        style={{ width: 150 }}
                        onChange={(value) => handleCascaderChange(idx, value)}
                      />
                    }
                    value={inputValues[idx] || ""}
                    onChange={handleInputChange(idx)}
                  />
                </div>
              );
            })}
          </div>
          <div style={{ display: "grid", placeItems: "center" }}>
            <p>Select your vendor name</p>
            <Select
              className="Dropdown"
              style={{ width: "300" }}
              placeholder={`select Vendor name`}
              onChange={(value) => SetvendorName(value)}
            >
              {vendorNameOpation.map((option: any) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </div>
        </>
      ),
    },
  ];

  // *****************************post all data to this function******
  async function postData(url: any, data: any, FileName: any) {
    const alldata: any = Cookies.get("VR-user_Role");
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
        onClose();
        if (current != 3) {
          setCurrent(current + 1);
          setTimeout(() => {
            message.success(`Upload your next file`);
          }, 2000);
        }
        if(current == 0){
          setcompanyFileJson([]);
        }
        else if(current == 1){
          setvendorFileJson([]);
        }
        else if(current == 2){
          setdetailedFileJson([]);
        }
        setUpdateHeader([]);
        message.success(`Your file upload successfully`);
        return true;
      }
    }
    catch (error: any) {
      onClose();
      console.log(error);
      message.error(`${error?.response?.data?.error?.message}`);
      setTimeout(() => {
        message.error(`correct and uploading file again`);
      }, 1000);
      return false;
    }
  }

  // *****************post vendor naem to this function******8

  async function postVendorName() {
    const alldata: any = Cookies.get("VR-user_Role");
    const tokens = JSON.parse(alldata).token;
    const url =
      "https://concerned-plum-crayfish.cyclic.app/api/report/dynamic-report";
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
        const getPCaseUrl =
          "https://concerned-plum-crayfish.cyclic.app/api/generate-report/p-case";
        const getKCaseUrl =
          "https://concerned-plum-crayfish.cyclic.app/api/generate-report/k-case";
        const getLCaseUrl =
          "https://concerned-plum-crayfish.cyclic.app/api/generate-report/l-case";
        const getMCaseUrl =
          "https://concerned-plum-crayfish.cyclic.app/api/generate-report/m-case";
        const getFCaseUrl =
          "https://concerned-plum-crayfish.cyclic.app/api/generate-report/f-case";
        try {
          const pCaseResponse = await axios.get(getPCaseUrl, {
            headers: {
              Authorization: `Bearer ${tokens}`,
            },
          });
          const kCaseResponse = await axios.get(getKCaseUrl, {
            headers: {
              Authorization: `Bearer ${tokens}`,
            },
          });
          const lCaseResponse = await axios.get(getLCaseUrl, {
            headers: {
              Authorization: `Bearer ${tokens}`,
            },
          });
          const mCaseResponse = await axios.get(getMCaseUrl, {
            headers: {
              Authorization: `Bearer ${tokens}`,
            },
          });
          const fCaseResponse = await axios.get(getFCaseUrl, {
            headers: {
              Authorization: `Bearer ${tokens}`,
            },
          });

          const pCaseData = pCaseResponse?.data?.data;
          const kCaseData = kCaseResponse?.data?.data;
          const lCaseData = lCaseResponse?.data?.data;
          const mCaseData = mCaseResponse?.data?.data;
          const fCaseData = fCaseResponse?.data?.data;
          console.log({ pCaseData });
          console.log({ kCaseData });
          console.log({ lCaseData });
          console.log({ mCaseData });
          console.log({ fCaseData });
          const wb = XLSX.utils.book_new();

          if (pCaseData && pCaseData.length > 0) {
            const wsP = XLSX.utils.json_to_sheet(pCaseData);
            XLSX.utils.book_append_sheet(wb, wsP, "P");
          }

          // Create "K" sheet if data is available
          if (kCaseData && kCaseData.length > 0) {
            const wsK = XLSX.utils.json_to_sheet(kCaseData);
            XLSX.utils.book_append_sheet(wb, wsK, "K");
          }

          // Create "L" sheet if data is available
          if (lCaseData && lCaseData.length > 0) {
            const wsK = XLSX.utils.json_to_sheet(lCaseData);
            XLSX.utils.book_append_sheet(wb, wsK, "L");
          }

          // Create "M" sheet if data is available
          if (mCaseData && mCaseData.length > 0) {
            const wsK = XLSX.utils.json_to_sheet(mCaseData);
            XLSX.utils.book_append_sheet(wb, wsK, "M");
          }
          // Create "F" sheet if data is available
          if (fCaseData && fCaseData.length > 0) {
            const wsK = XLSX.utils.json_to_sheet(fCaseData);
            XLSX.utils.book_append_sheet(wb, wsK, "F");
          }

          // Save the Excel file only if at least one sheet is created
          if (wb.SheetNames.length > 0) {
            XLSX.writeFile(wb, "combinedCaseFile.xlsx");
            console.log(
              "Excel file with both P and K sheets generated successfully"
            );
          } else {
            console.log("No data available for either P or K sheets");
          }
          setCurrent(0);
        } catch (error) {
          console.error("Error fetching data or generating Excel file:", error);
        }
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };
  // ******************save mapping *********
  async function saveMapping(
    keyforjson: any,
    valueforjson: any,
    urlforpost: any
  ) {
    const data = await getMapping(urlforpost);
    if (data != null && data?._id) {
      urlforpost = `${urlforpost}/${data._id}`;
    }
    const resultJSON: any = {};
    keyforjson.forEach((item: any, index: any) => {
      resultJSON[item.content] = valueforjson[index].content;
    });
    const alldata: any = Cookies.get("VR-user_Role");
    const tokens = JSON.parse(alldata).token;
    const finaltemp = {
      data: resultJSON,
    };
    if (data != null && data._id) {
      try {
        const response = await axios.put(urlforpost, finaltemp, {
          headers: {
            Authorization: ` Bearer ${tokens}`,
          },
        });
        if (response.status == 201) {
          console.log(response);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await axios.post(urlforpost, finaltemp, {
          headers: {
            Authorization: ` Bearer ${tokens}`,
          },
        });
        if (response.status == 201) {
          console.log(response);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  async function getMapping(url: any) {
    const alldata: any = Cookies.get("VR-user_Role");
    const tokens = JSON.parse(alldata).token;
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${tokens}`,
        },
      });
      if (response.data.data[0]) {
        return response?.data?.data[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  }
  // *************for first file / companyfile ********************

  async function companyFileCheck() {
    const data = await getMapping(companyMappingUrl);
    const header = companyFileJson[0];
    const contentArray = [];
    for (const key in data) {
      if (key !== "user" && key !== "_id") {
        contentArray.push(data[key]);
      }
    }
    const allValuesExist = contentArray.every((value) =>
      header.includes(value)
    );
    if (allValuesExist && data != null) {
      for (const key in data) {
        const index = header.indexOf(data[key]);
        if (index !== -1) {
          header[index] = key;
        }
      }
      const alldata = companyFileJson;
      alldata[0] = header;
      try {
        const transformedData = await transformToObjectsFile1(header, alldata);
        console.log("Transformed data:", transformedData);
        await postData(companyPostUrl, transformedData, companyFileName);
      } catch (error) {
        console.error("Error during transformation:", error);
      }
    } else {
      setOpenPanel(true);
    }
  }

  async function companyFileMapping() {
    if (current == 0) {
      if (UpdateHeader?.length == companyHeader?.length) {
        saveMapping(companyHeader, UpdateHeader, companyMappingUrl);
        const convertFileHeader = companyFileHeader.map(
          (item: any) => item.content
        );
        const convertHeader = companyHeader.map((item: any) => item.content);
        UpdateHeader.forEach((item: any, idx: any) => {
          const index = convertFileHeader.indexOf(item?.content);
          if (index != -1) {
            convertFileHeader[index] = convertHeader[idx];
          }
        });
        const Allfilejson = companyFileJson;
        Allfilejson[0] = convertFileHeader;
        try {
          const transformedData = await transformToObjectsFile1(
            convertFileHeader,
            Allfilejson
          );
          console.log("Transformed data:", transformedData);
          if (transformedData != null) {
            await postData(companyPostUrl, transformedData, companyFileName);
            setTimeout(() => {
              message.success(`Upload your next file`);
            }, 2000);
          } else {
            message.error(`Check and Upload file Again`);
          }
        } catch (error) {
          message.error(`first file upload error`);
        }
      } else {
        message.error(`Please select a value for each dropdown.`);
      }
    }
  }

  const transformToObjectsFile1 = async (headers: any, data: any) => {
    const vendorNamedropdown: any = [];
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

  // **********************for vendor/ first file********************
  const transformToObjectsFile2 = async (headers: any, data: any) => {
    let TransFormToObjectsData = await Promise.all(
      data.map(async (row: any) => {
        const rowData: any = {};
        await Promise.all(
          headers.map(async (header: any, index: any) => {
            let value = row[index];
            // if (value == undefined)
            //   debugger
            console.log(value, index);
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
    );
    TransFormToObjectsData = TransFormToObjectsData.slice(1);
    return TransFormToObjectsData;
  };

  async function vendorFileCheck() {
    const data = await getMapping(vendorMappingUrl);
    const header = vendorFileJson[0];
    const contentArray = [];
    for (const key in data) {
      if (key !== "user" && key !== "_id") {
        contentArray.push(data[key]);
      }
    }
    const allValuesExist = contentArray.every((value) =>
      header.includes(value)
    );
    if (allValuesExist && data != null) {
      for (const key in data) {
        const index = header.indexOf(data[key]);
        if (index !== -1) {
          header[index] = key;
        }
      }
      const alldata = vendorFileJson;
      alldata[0] = header;
      try {
        const transformedData = await transformToObjectsFile2(header, alldata);
        console.log("Transformed data:", transformedData);
        await postData(vendorPostUrl, transformedData, vendorfileName);
      } catch (error) {
        console.error("Error during transformation:", error);
      }
    } else {
      setOpenPanel(true);
    }
  }
  async function vendorFileMapping() {
    if (current == 1) {
      if (UpdateHeader?.length == vendorHeader?.length) {
        saveMapping(vendorHeader, UpdateHeader, vendorMappingUrl);
        const convertFileHeader = vendorFileHeader.map(
          (item: any) => item.content
        );
        const convertHeader = vendorHeader.map((item: any) => item.content);
        UpdateHeader.forEach((item: any, idx: any) => {
          const index = convertFileHeader.indexOf(item?.content);
          if (index != -1) {
            convertFileHeader[index] = convertHeader[idx];
          }
        });
        const Allfilejson = vendorFileJson;
        Allfilejson[0] = convertFileHeader;
        try {
          const transformedData = await transformToObjectsFile2(
            convertFileHeader,
            Allfilejson
          );
          console.log("Transformed data:", transformedData);
          await postData(vendorPostUrl, transformedData, vendorfileName);
        } catch (error) {
          console.error("Error during transformation:", error);
        }
      } else {
        message.error(`Please select a value for each dropdown.`);
      }
    }
  }
  // ***********************for detailed File  ************
  const transformToObjectsFile3 = async (headers: any, data: any) => {
    let TransFormToObjectsData = await Promise.all(
      data.map(async (row: any) => {
        const rowData: any = {};
        await Promise.all(
          headers.map(async (header: any, index: any) => {
            let value = row[index];
            // if(value == undefined)
            // debugger
            // console.log(value,index);
            if (value !== "" && value !== undefined && value !== null) {
              if (header === "Invoice Number" || header === "Document Number") {
                value = String(value).replace(/[\W_]+/g, "");
                if (header == "Document Number") {
                  let assigdata = "SPI";
                  if (dropdownValues[0] == "Starts with") {
                    if (value.startsWith(inputValues[0])) {
                      assigdata = "TDS";
                    }
                  } else if (dropdownValues[0] == "Ends with") {
                    if (value.endsWith(inputValues[0])) {
                      assigdata = "TDS";
                    }
                  } else if (dropdownValues[0] == "Contains") {
                    if (value.includes(inputValues[0])) {
                      assigdata = "TDS";
                    }
                  }
                  if (dropdownValues[1] == "Starts with") {
                    if (value.startsWith(inputValues[1])) {
                      assigdata = "PID";
                    }
                  } else if (dropdownValues[1] == "Ends with") {
                    if (value.endsWith(inputValues[1])) {
                      assigdata = "PID";
                    }
                  } else if (dropdownValues[1] == "Contains") {
                    if (value.includes(inputValues[1])) {
                      assigdata = "PID";
                    }
                  }
                  rowData["NewType"] = assigdata;
                }
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
    TransFormToObjectsData = TransFormToObjectsData.slice(1);
    return TransFormToObjectsData;
  };

  async function detailedFileCheck() {
    const data = await getMapping(detailMappingUrl);
    const header = detailedFileJson[0];
    const contentArray = [];
    for (const key in data) {
      if (key !== "user" && key !== "_id") {
        contentArray.push(data[key]);
      }
    }
    const allValuesExist = contentArray.every((value) =>
      header.includes(value)
    );
    if (allValuesExist && data != null) {
      for (const key in data) {
        const index = header.indexOf(data[key]);
        if (index !== -1) {
          header[index] = key;
        }
      }
      const alldata = detailedFileJson;
      alldata[0] = header;
      setdetailedFileJson(alldata);
      setCurrent(current + 1);
    } 
    else {
      setOpenPanel(true);
    }
  }

  async function detailedFileMapping() {
    if (current == 2) {
      if (UpdateHeader?.length == detailedHeader?.length) {
        saveMapping(detailedHeader, UpdateHeader, detailMappingUrl);
        const convertFileHeader = detailedFileHeader.map(
          (item: any) => item.content
        );
        const convertHeader = detailedHeader.map((item: any) => item.content);
        UpdateHeader.forEach((item: any, idx: any) => {
          const index = convertFileHeader.indexOf(item?.content);
          if (index != -1) {
            convertFileHeader[index] = convertHeader[idx];
          }
        });
        const Allfilejson = detailedFileJson;
        Allfilejson[0] = convertFileHeader;
        setcompanyFileHeader(convertHeader);
        setdetailedFileJson(Allfilejson);
        setCurrent(current + 1);
        onClose();
      } else {
        message.error(`Please select a value for each dropdown.`);
      }
    }
  }

  // ************************get reports*********************8
  async function getreport() {
    const isValidArray1 =
      inputValues.length == 2 &&
      inputValues.every(
        (value) => value !== "" && value !== undefined && value !== null
      );
    const isValidArray2 =
      dropdownValues.length == 2 &&
      dropdownValues.every(
        (value) => value !== "" && value !== undefined && value !== null
      );

    if (
      isValidArray1 &&
      isValidArray2 &&
      vendorName != "" &&
      vendorName != undefined &&
      vendorName != null
    ) {
      try {
        const transformedData = await transformToObjectsFile3(
          detailedFileJson[0],
          detailedFileJson
        );
        console.log("Transformed data:", transformedData);
        const check = await postData(detailPostUrl, transformedData, detailedFileName);
        if (check) {
          await postVendorName();
        }
      } catch (error) {
        console.error("Error during transformation:", error);
      }
    } else {
      message.error("please fill all data");
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
      } else {
        message.error(`Please upload excle file.`);
      }
    } else if (current == 1) {
      if (
        vendorFileJson.length != undefined &&
        vendorFileJson.length != null &&
        vendorFileJson.length > 0
      ) {
        vendorFileCheck();
      } else {
        message.error(`Please upload excle file.`);
      }
    } else if (current == 2) {
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
    } else if (current == 1) {
      vendorFileMapping();
    } else if (current == 2) {
      detailedFileMapping();
    }
  }

  function showfiles() {
    if (current == 0 && companyFileJson.length > 0) {
      setshowfile(companyFileJson);
      setOpen(true);
    } else if (current == 1 && vendorFileJson.length > 0) {
      setshowfile(vendorFileJson);
      setOpen(true);
    } else if (current == 2 && detailedFileJson.length > 0) {
      setshowfile(detailedFileJson);
      setOpen(true);
    } else {
      message.error("Please Upload file");
    }
  }

  return (
    <>



      <Spin tip="Please Wait" spinning={loading} fullscreen={true} size="large" wrapperClassName="overlay" className="overlay" indicator={<LoadingOutlined />} ></Spin>



      <div style={{ margin: "20px" }}>
        <Steps current={current} items={items} />
        {/* <Spin spinning={true} fullscreen /> */}
        <div style={{ display: "grid", placeItems: "center" }}>
          {/* <Spin size="large" /> */}
        </div>
        <div style={contentStyle}>{steps[current]?.content}</div>
        <div
          style={{
            marginTop: 24,
            display: "Flex",
            justifyContent: "space-around",
          }}
        >
          {current === steps.length - 1 && (
            <Button type="primary" onClick={getreport}>
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
        zIndex={1000}
        width={900}
        extra={
          <Space>
            {/* <Button >Cancel</Button> */}
            <Button onClick={showfiles} type="primary">
              <EyeOutlined />
            </Button>
            <Button onClick={MappingCheck} type="primary">
              Save
            </Button>
          </Space>
        }
      >
        <Spin tip="Please Wait" spinning={loadingpannel} fullscreen={true} size="large" className="overlay" indicator={<LoadingOutlined />} ></Spin>

        <DragAndDrop
          initialBoxOneItems={
            current === 0
              ? companyFileHeader
              : current === 1
                ? vendorFileHeader
                : current === 2
                  ? detailedFileHeader
                  : null
          }
          boxTwoItems={UpdateHeader}
          setBoxTwoItems={setUpdateHeader}
          defaultStaticContent={
            current === 0
              ? companyHeader
              : current === 1
                ? vendorHeader
                : current === 2
                  ? detailedHeader
                  : null
          }
        />
      </Drawer>
      <Modal
        title="Title"
        open={open}
        onCancel={handleCancel}
        style={{ padding: "10px" }}
        width={950}
        okButtonProps={{ style: { display: "none" } }}
        zIndex={10000}
      >
        <div className="Prev_excelFile">
          <div
            style={{
              overflowX: "auto",
              maxHeight: "320px" /* Set the max height for the table body */,
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
        </div>
      </Modal>

    </>
  );
};

export default Import;
