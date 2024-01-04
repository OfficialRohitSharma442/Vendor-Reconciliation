/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArrowRightOutlined, DownloadOutlined, EyeOutlined, ReloadOutlined, FileExcelOutlined } from "@ant-design/icons";
import { Button, Checkbox, DatePicker, DatePickerProps, Drawer, Modal, Select, Space, Steps, UploadProps, message, theme, } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import Dragger from "antd/es/upload/Dragger";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import DragAndDrop from "../utils/Drag-and-Drop";
import "./Import.css";
import DocTypeMapping from "./DocTypeMapping";
import DownloadReport from "./DownloadReport";
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
  // *******************All url *************
  const companyPostUrl = "https://concerned-plum-crayfish.cyclic.app/api/master/dynamic-master";
  const vendorPostUrl = "https://concerned-plum-crayfish.cyclic.app/api/vendor/dynamic-vendor";
  const detailPostUrl = "https://concerned-plum-crayfish.cyclic.app/api/complete/dynamic-complete";
  const companyMappingUrl = "https://concerned-plum-crayfish.cyclic.app/api/mapping/master-mapping";
  const vendorMappingUrl = "https://concerned-plum-crayfish.cyclic.app/api/mapping/vendor-mapping";
  const detailMappingUrl = "https://concerned-plum-crayfish.cyclic.app/api/mapping/complete-mapping";
  // ****************for steps***************************
  // @ ts-ignore
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
  // ************for file name***********
  const [customFileName, setCustomFileName] = useState<string | null>(null);
  // ****************for Panle ***************************
  const [OpenPanel, setOpenPanel] = useState(false);
  // ***************************for mapping********************
  const [UpdateHeader, setUpdateHeader] = useState<any>([]);
  // ************************for vendor name***************
  const [vendorNameOpation, setvendorNameOpation] = useState<any>([]);
  const [vendorName, SetvendorName] = useState<any>("");
  // ******************for show priview*********************
  const [showfile, setshowfile] = useState<any>([]);
  // *****************state for document mapping *********
  const [Mappings, setMappings] = useState([{ Column: '', Type: '', Method: '', Value: '' },]);
  //***********for loading state */
  const [loading, setloading] = React.useState(false);
  const [disable, setdisable] = React.useState(false);
  // *************delete mapping***************
  const [deleteMapping, setDeleteMapping] = useState<string[]>([]);
  const [deleteMappingLoading, setDeleteMappingLoading] = useState(false);
  // **************for model delete ************
  const [openDeleteMapping, setOpenDeleteMapping] = useState(false);
  const plainOptions = ["First File", "Second File", "Third File"];
  function onChange(checkedValues) {
    setDeleteMapping(checkedValues);
  }
  // **********************date**********
  const [dateVendor, setdateVendor] = useState<any>("");
  const onChangeDate: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
    setdateVendor(dateString);
  };
  // **************for get mapping id********
  async function deleteMappings(url: any) {
    const alldata: any = Cookies.get("VR-user_Role");
    const tokens = JSON.parse(alldata).token;
    try {
      const response = await axios.delete(url, {
        headers: {
          Authorization: ` Bearer ${tokens}`,
        },
      });
    }
    catch (error) {
      console.log(error)
    }
  }
  async function getMappingID() {
    if (deleteMapping.length > 0) {
      setDeleteMappingLoading(true);
      if (deleteMapping.includes("First File")) {
        const data = await getMapping(companyMappingUrl);
        if (data?._id != undefined && data?._id != "" && data?._id != null) {
          deleteMappings(`https://concerned-plum-crayfish.cyclic.app/api/mapping/master-mapping/${data?._id}`);
        }
      }
      if (deleteMapping.includes("Second File")) {
        const data = await getMapping(vendorMappingUrl);
        if (data?._id != undefined && data?._id != "" && data?._id != null) {
          deleteMappings(`https://concerned-plum-crayfish.cyclic.app/api/mapping/vendor-mapping/${data?._id}`);
        }
      }
      if (deleteMapping.includes("Third File")) {
        const data = await getMapping(detailMappingUrl);
        if (data?._id != undefined && data?._id != "" && data?._id != null) {
          deleteMappings(`https://concerned-plum-crayfish.cyclic.app/api/mapping/complete-mapping/${data?._id}`);
        }
      }
      setTimeout(() => {
        message.success("Reset Mapping Successfully")
        setDeleteMappingLoading(false);
        setOpenDeleteMapping(false);
      }, 1000);
    } else {
      message.error("Please Select File");
    }
  }
  // ********************for uplode every file***************
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
            const workbook = XLSX.read(data, { type: "binary", cellDates: true, dateNF: "mm-dd-yyyy" });
            const sheetName = workbook.SheetNames[0];
            console.log("sheetName", sheetName)
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, {
              header: 1,
              defval: "",
              blankrows: false,
              raw: false, // Ensure dates are parsed as JavaScript Date objects
              dateNF: "mm-dd-yyyy", // Specify the date format if needed"yyyy-mm-dd"
              cellDates: true, // Parse dates from the cell values
            } as any);
            console.log(jsonData)
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
        // console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        setCustomFileName(info?.file?.name);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  //************************for first all three step *******************8
  const FirstThreeStep = () => (
    <>
      <div style={{ margin: "20px" }}>
        <div className="mainstep">
          <div>
            <Button type="primary" icon={<DownloadOutlined />} size={size}>
              Sample file
            </Button>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <Button onClick={() => { setOpenDeleteMapping(true) }} type="primary">
              <ReloadOutlined title="Reset Mapping" />
            </Button>
            <Button onClick={showfiles} type="primary">
              <EyeOutlined title="View Excle File" />
            </Button>
            <Button loading={loading} type="primary" size={size} onClick={() => next()}>
              Next <ArrowRightOutlined />
            </Button>
          </div>
        </div>
        <div>{uploadFile("Company File")}</div>
      </div>
    </>
  );
  // *****************for show uplode every file************
  const uploadFile = (Filename: any) => (
    <>
      <Dragger {...props} disabled={disable}>
        <p className="ant-upload-drag-icon">
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
  // ***************** main steps****************
  const steps: any = [
    {
      title: "First",
      content: (FirstThreeStep()),
    },
    {
      title: "Second",
      content: (FirstThreeStep()),
    },
    {
      title: "Third",
      content: (
        FirstThreeStep()
      ),
    },
    {
      title: "Report",
      content: (
        <>
          <div style={{ margin: "0px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between",alignItems:"center" }}>
              <div>
              <h2 style={{ textAlign: "center", fontWeight: "600" }}>Create Mapppings</h2>
              </div>
              <div style={{ display: "flex", gap: "20px" }}>
                {/* <p style={{ whiteSpace: "nowrap" }}>Select your vendor name</p> */}
                {/* <label style={{ marginRight: '8px' }}>Vendor name *</label> */}
                <span style={{color:"red"}}>*</span>
                <Select
                  // className="Dropdown"
                  style={{ width: "300" }}
                  placeholder={`select Vendor name`}
                  onChange={(value) => SetvendorName(value)}
                >
                  {vendorNameOpation.map((option: any) => (
                    <Option key={option} value={option}>
                      {option}
                    </Option>
                  ))}
                </Select><span style={{color:"red"}}>*</span>
                <DatePicker format="MM/DD/YYYY" onChange={onChangeDate} />
                <Button onClick={showfiles} type="primary">
                  <EyeOutlined />
                </Button>
                <Button loading={loading} type="primary" onClick={getreport}>
                  Generate Report
                </Button>
              </div>
            </div>
            <div style={{ display: "grid", placeItems: "center" }}>
              <DocTypeMapping Mappings={Mappings} setMappings={setMappings} />
            </div>
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
        // console.log(response);
        setCustomFileName("");
        if (current != 3) {
          setdisable(false);
          setloading(false);
          onClose();
          setCurrent(current + 1);
          setTimeout(() => {
            message.success(`Upload your next file`);
          }, 2000);
        }
        if (current == 0) {
          setcompanyFileJson([]);
        } else if (current == 1) {
          setvendorFileJson([]);
        } else if (current == 2) {
          setdetailedFileJson([]);
        }
        setUpdateHeader([]);
        message.success(`Your file upload successfully`);
        return true;
      }
    } catch (error: any) {
      onClose();
      console.log(error);
      message.error(`${error?.response?.data?.error?.message}`);
      setTimeout(() => {
        message.error(`correct and uploading file again`);
      }, 1000);
      return false;
    }
  }
  // *****************post vendor naem to this function******
  async function postVendorName() {
    const alldata: any = Cookies.get("VR-user_Role");
    const tokens = JSON.parse(alldata).token;
    const url =
      "https://concerned-plum-crayfish.cyclic.app/api/v2/report/dynamic-report";
    const data = {
      user: JSON.parse(alldata)?.ID,
      vendorName: vendorName,
      dateTypeMapped:dateVendor
    };
    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: ` Bearer ${tokens}`,
        },
      });
      if (response.data.success === "ok") {
        await DownloadReport();
        setMappings([{ Column: '', Type: '', Method: '', Value: '' },]);
        setloading(false);
        setCurrent(0);
      }
    } catch (error) {
      console.log(error);
      message.error("error in get report post call");
      setloading(false);
    }
  }
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };
  // ******************save mapping *********
  async function saveMapping(keyforjson: any, valueforjson: any, urlforpost: any) {
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
    setdisable(true);
    setloading(true);
    const data = await getMapping(companyMappingUrl);
    const header = companyFileJson[0];
    const contentArray: any = [];
    for (const key in data) {
      if (key !== "user" && key !== "_id") {
        // @ ts-ignore
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
      setdisable(false);
      setloading(false);
      setOpenPanel(true);
    }
  }
  async function companyFileMapping() {
    if (current == 0) {
      if (UpdateHeader?.length == companyHeader?.length) {
        setdisable(true);
        setloading(true);
        saveMapping(companyHeader, UpdateHeader, companyMappingUrl);
        const convertFileHeader = companyFileHeader.map(
          (item: any) => item.content
        );
        const convertHeader = companyHeader.map((item: any) => item.content);
        UpdateHeader?.forEach((item: any, idx: any) => {
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
            onClose();
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
      data?.map(async (row: any, idx: number) => {
        const rowData: any = {};
        await Promise.all(
          headers?.map(async (header: any, index: any) => {
            let value = row[index];
            if (value !== "" && value !== undefined && value !== null) {
              if (header === "Invoice Number" || header === "Document Number") {
                value = String(value)?.replace(/[\W_]+/g, "");
              }
              if (header === "Vendor Name" && idx !== 0) {
                vendorNamedropdown?.push(value?.trim());
              }
              rowData[header] = `${value}`?.trim();
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
      data?.map(async (row: any) => {
        const rowData: any = {};
        await Promise.all(
          headers?.map(async (header: any, index: any) => {
            let value = row[index];
            if (value !== "" && value !== undefined && value !== null) {
              if (header === "Invoice Number" || header === "Document Number") {
                value = String(value)?.replace(/[\W_]+/g, "");
              }
              rowData[header] = `${value}`?.trim();
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
    TransFormToObjectsData = TransFormToObjectsData?.slice(1);
    return TransFormToObjectsData;
  };
  async function vendorFileCheck() {
    setdisable(true);
    setloading(true);
    const data: any = await getMapping(vendorMappingUrl);
    const header = vendorFileJson[0];
    const contentArray: any = [];
    for (const key in data) {
      if (key !== "user" && key !== "_id") {
        // @ ts-ignore
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
      setdisable(false);
      setloading(false);
      setOpenPanel(true);
    }
  }
  async function vendorFileMapping() {
    if (current == 1) {
      if (UpdateHeader?.length == vendorHeader?.length) {
        setdisable(true);
        setloading(true);
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
          onClose();
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
    const alldocmap = Mappings.slice(0, -1);
    const documentMap = alldocmap?.filter(item => item?.Column === "Document Number");
    const paymentMap = alldocmap?.filter(item => item?.Column === "Payment Document");
    let TransFormToObjectsData = await Promise.all(
      data?.map(async (row: any) => {
        const rowData: any = {};
        await Promise.all(
          headers?.map(async (header: any, index: any) => {
            let value = row[index];
            if (value !== undefined && value !== null) {
              if (header === "Invoice Number" || header === "Document Number" || header == "Payment Document") {
                value = String(value).replace(/[\W_]+/g, "");
                if (header == "Document Number") {
                  // if (rowData["DocumentTypeMapped"])
                  //   console.log(rowData["DocumentTypeMapped"]);
                  let DocumentTypeMapped = "";
                  if (documentMap?.length > 0 && value != "") {
                    for (let i = 0; i < documentMap?.length; i++) {
                      const item = documentMap[i];
                      if (item?.Method === "Contains" && value?.toLowerCase().includes(item?.Value.toLowerCase())) {
                        DocumentTypeMapped = item?.Type;
                        break;
                      } else if (item?.Method === "StartsWith" && value?.toLowerCase().startsWith(item?.Value.toLowerCase())) {
                        DocumentTypeMapped = item?.Type;
                        break;
                      } else if (item?.Method === "EndsWith" && value?.toLowerCase().endsWith(item?.Value.toLowerCase())) {
                        DocumentTypeMapped = item?.Type;
                        break;
                      }
                    }
                  }
                  rowData["DocumentTypeMapped"] = DocumentTypeMapped;
                }
                else if (header == "Payment Document") {
                  let PaymentTypeMapped = "";
                  if (paymentMap?.length > 0 && value != "") {
                    for (let i = 0; i < paymentMap?.length; i++) {
                      const item = paymentMap[i];
                      if (item?.Method === "Contains" && value?.toLowerCase().includes(item?.Value.toLowerCase())) {
                        PaymentTypeMapped = item?.Type;
                        break;
                      } else if (item?.Method === "StartsWith" && value?.toLowerCase().startsWith(item?.Value.toLowerCase())) {
                        PaymentTypeMapped = item?.Type;
                        break;
                      } else if (item?.Method === "EndsWith" && value?.toLowerCase().endsWith(item?.Value.toLowerCase())) {
                        PaymentTypeMapped = item?.Type;
                        break;
                      }
                    }
                  }
                  rowData["PaymentTypeMapped"] = PaymentTypeMapped;
                }
              }
              rowData[header] = `${value}`?.trim();
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
    setdisable(true);
    setloading(true);
    const data: any = await getMapping(detailMappingUrl);
    const header = detailedFileJson[0];
    const contentArray: any = [];
    for (const key in data) {
      if (key !== "user" && key !== "_id") {
        // @ ts-ignore
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
      setdisable(false);
      setloading(false);
      setCurrent(current + 1);
    } else {
      setdisable(false);
      setloading(false);
      setOpenPanel(true);
    }
  }
  async function detailedFileMapping() {
    if (current == 2) {
      if (UpdateHeader?.length == detailedHeader?.length) {
        setdisable(true);
        setloading(true);
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
        setdisable(false);
        setloading(false);
        onClose();
        setCurrent(current + 1);
      } else {
        message.error(`Please select a value for each dropdown.`);
      }
    }
  }
  // ************************get reports*********************
  async function getreport() {
    if (vendorName != "" && vendorName != undefined && vendorName != null && Mappings.length > 1 && dateVendor != "" && dateVendor != undefined && dateVendor != undefined) {
      try {
        setloading(true);
        const transformedData = await transformToObjectsFile3(detailedFileJson[0], detailedFileJson);
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
  // *********************for click on next step***********
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
    height: "360px",
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
    } else if ((current == 2 || current == 3) && detailedFileJson.length > 0) {
      setshowfile(detailedFileJson);
      setOpen(true);
    } else {
      message.error("Please Upload file");
    }
  }

  return (
    <>
      <div style={{ margin: "20px" }}>
        <Steps current={current} items={items} />
        <div style={{ display: "grid", placeItems: "center" }}>
        </div>
        <div style={contentStyle}>{steps[current]?.content}</div>
        <div
          style={{
            marginTop: 24,
            display: "Flex",
            justifyContent: "space-around",
          }}
        >
        </div>
      </div>
      <Drawer
        title={`File Mapping`}
        placement="right"
        size={"large"}
        onClose={onClose}
        open={OpenPanel}
        zIndex={1000}
        width={900}
        extra={
          <Space>
            <Button onClick={showfiles} type="primary">
              <EyeOutlined />
            </Button>
            <Button loading={loading} onClick={MappingCheck} type="primary">
              Save
            </Button>
          </Space>
        }
      >
        <DragAndDrop
          initialBoxOneItems={current === 0
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
        title={`Preview ${customFileName}`}
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
      <Modal
        title='Do You Want To Reset Mapping?'
        open={openDeleteMapping}
        onOk={getMappingID}
        onCancel={() => { setOpenDeleteMapping(false) }}
        okText='Reset Mapping'
        cancelText='Cancel'
        confirmLoading={deleteMappingLoading}
      >
        <p style={{ margin: "0", fontWeight: "500" }}>Select File :</p>
        <Checkbox.Group options={plainOptions} onChange={onChange} style={{ margin: "10px 0px" }} />
      </Modal>
    </>
  );
};
export default Import;
