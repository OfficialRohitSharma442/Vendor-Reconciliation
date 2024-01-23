/* eslint-disable @typescript-eslint/no-unused-vars */
import { ArrowRightOutlined, DownloadOutlined, EyeOutlined, FileExcelOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Checkbox, DatePicker, DatePickerProps, Drawer, Input, Modal, Select, Space, Steps, Tooltip, UploadProps, message, theme, } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import Dragger from "antd/es/upload/Dragger";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import DragAndDrop from "../utils/Drag-and-Drop";
import MappingHeadersTable from "../utils/antTable";
import DocTypeMapping from "./DocTypeMapping";
import DownloadReport from "./DownloadReport";
import "./Import.css";
import ShowFile from "./ShowFile";
const { Option } = Select;
const Import = () => {
  // **************Static Data*********************
  const companyHeader = [
    { id: "4", content: "Invoice Number" },
    { id: "5", content: "Closing Balance" },
    { id: "1", content: "Vendor" },
    { id: "2", content: "Vendor Name" },
    { id: "3", content: "Document Number" },
    { id: "6", content: "Invoice Amount" },
    { id: "7", content: "Currency" },
    { id: "8", content: "Due Date" },
    { id: "9", content: "Document Date" },
  ];
  const vendorHeader = [
    { id: "9", content: "Invoice Number" },
    { id: "3", content: "Closing Balance" },
    { id: "7", content: "Document Date" },
    { id: "8", content: "Document Number" },
    { id: "1", content: "Business Partner" },
    { id: "2", content: "Business Partner Name" },
    { id: "4", content: "Invoice Amount" },
    { id: "5", content: "Currency" },
    { id: "6", content: "Due Date" },
  ];
  const detailedHeader = [
    { id: "12", content: "Invoice Number" },
    { id: "9", content: "Invoice Date" },
    { id: "11", content: "Document Number" },
    { id: "6", content: "Payment Document" },
    { id: "10", content: "Document Date" },
    { id: "1", content: "Due Date" },
    { id: "3", content: "Credit Amount(INR)" },
    { id: "4", content: "Debit Amount(INR)" },
    { id: "2", content: "Company Code" },
    { id: "5", content: "Cheque Rtgs Neft" },
    { id: "7", content: "Reference" },
    { id: "8", content: "Grn Number" },
  ];
  // *******************All url *************
  const companyPostUrl = "https://concerned-plum-crayfish.cyclic.app/api/master/dynamic-master";
  const vendorPostUrl = "https://concerned-plum-crayfish.cyclic.app/api/vendor/dynamic-vendor";
  const detailPostUrl = "https://concerned-plum-crayfish.cyclic.app/api/complete/dynamic-complete";
  const companyMappingUrl = "https://concerned-plum-crayfish.cyclic.app/api/mapping/master-mapping";
  const vendorMappingUrl = "https://concerned-plum-crayfish.cyclic.app/api/mapping/vendor-mapping";
  const detailMappingUrl = "https://concerned-plum-crayfish.cyclic.app/api/mapping/complete-mapping";
  const DocMappingUrl = "https://concerned-plum-crayfish.cyclic.app/api/mapping/document-mapping";
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
  const [companyFileHeaderPost, setcompanyFileHeaderPost] = useState<any>([]);
  const [companyFileDataPost, setcompanyFileDataPost] = useState<any>([]);

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
  const [DocModel, setDocModel] = useState(false);
  //***********for loading state */
  const [loading, setloading] = React.useState(false);
  const [disable, setdisable] = React.useState(false);
  /******** state for Reset mapping preview***************/
  const [ResMappingPrevdata, setResMappingPrevdata] = React.useState<any>([])
  const [ResMappingPrevdata1, setResMappingPrevdata1] = React.useState<any>([])
  const [ResMappingPrevdata2, setResMappingPrevdata2] = React.useState<any>([])
  const [ResMappingPrevdata3, setResMappingPrevdata3] = React.useState<any>([])
  const [mappingModal, setMappingModal] = React.useState(false);
  // *************delete mapping***************
  const [deleteMapping, setDeleteMapping] = useState<string[]>([]);
  const [deleteMappingLoading, setDeleteMappingLoading] = useState(false);
  // **************for model delete ************
  const [OptionsId, setOptionsId] = useState({ "Company Open": "", "Vendor Open": "", "Company SOA": "" });
  const [openDeleteMapping, setOpenDeleteMapping] = useState(false);
  function onChange(checkedValues) {
    setDeleteMapping(checkedValues);
  }
  // **********************date and threshold**********
  const [Threshold, setThreshold] = useState<number>(0);
  const [dateVendor, setdateVendor] = useState<any>("");
  const onChangeDate: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
    setdateVendor(dateString);
  };
  function Thresholdcheck(value) {
    const newValue = parseInt(value, 10);
    if (newValue >= 0) {
      setThreshold(newValue);
    } else {
      setThreshold(0);
    }
  }
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
      if (deleteMapping.includes("Company Open")) {
        if (OptionsId["Company Open"] != "") {
          deleteMappings(`https://concerned-plum-crayfish.cyclic.app/api/mapping/master-mapping/${OptionsId["Company Open"]}`);
        }
      }
      if (deleteMapping.includes("Vendor Open")) {
        if (OptionsId["Vendor Open"] != "") {
          deleteMappings(`https://concerned-plum-crayfish.cyclic.app/api/mapping/vendor-mapping/${OptionsId["Vendor Open"]}`);
        }
      }
      if (deleteMapping.includes("Company SOA")) {
        if (OptionsId["Company SOA"] != "") {
          deleteMappings(`https://concerned-plum-crayfish.cyclic.app/api/mapping/complete-mapping/${OptionsId["Company SOA"]}`);
        }
      }
      setTimeout(() => {
        message.success("Reset Mapping Successfully")
        setDeleteMappingLoading(false);
        setOpenDeleteMapping(false);
      }, 2000);
    } else {
      message.error("Please Select File");
    }
  }
  useEffect(() => {
    const fetchData = async () => {
        const res1 = await getMapping(companyMappingUrl);
        if (res1?._id) {
          setOptionsId(prevOptionsId => ({ ...prevOptionsId, "Company Open": res1._id }));
          setResMappingPrevdata1(Object.entries(res1).filter(([key]) => key !== "_id"))
        }
        const res2 = await getMapping(vendorMappingUrl);
        if (res2?._id) {
          setOptionsId(prevOptionsId => ({ ...prevOptionsId, "Vendor Open": res2._id }));
          setResMappingPrevdata2(Object.entries(res2).filter(([key]) => key !== "_id"))
        }
        const res3 = await getMapping(detailMappingUrl);
        if (res3?._id) {
          setOptionsId(prevOptionsId => ({ ...prevOptionsId, "Company SOA": res3._id }));
          setResMappingPrevdata3(Object.entries(res3).filter(([key]) => key !== "_id"))
        }
    };
    fetchData();
  }, [current])

  async function resetMappingView(filetype) {
    if (filetype === "First File") {
      setResMappingPrevdata(ResMappingPrevdata1);
      setMappingModal(true)
    } else if (filetype === "Second File") {
      setResMappingPrevdata(ResMappingPrevdata2);
      setMappingModal(true)
    } else {
      setResMappingPrevdata(ResMappingPrevdata3);
      setMappingModal(true)
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
            // console.log(jsonData)
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
  //************************for first all three step *******************
  const FirstThreeStep = (filename) => (
    <>
      <div style={{ margin: "20px" }}>
        <div className="mainstep">
          <div>
            <Tooltip title={"Download Sample File"}>
              <Button type="primary" icon={<DownloadOutlined />} size={size}>
                Sample file
              </Button>
            </Tooltip>
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            <Tooltip title={"Reset Mapping"}>
              <Button onClick={() => { setOpenDeleteMapping(true) }} type="primary">
                <ReloadOutlined title="Reset Mapping" />
              </Button>
            </Tooltip>
            <Tooltip title={"View Excle File"}>
              <Button onClick={showfiles} type="primary">
                <EyeOutlined title="View Excle File" />
              </Button>
            </Tooltip>
            <Button loading={loading} type="primary" size={size} onClick={() => next()}>
              Next <ArrowRightOutlined />
            </Button>
          </div>
        </div>
        <div>{uploadFile(filename)}</div>
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
          Click or drag file to this area to upload {Filename} File
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
      title: "Company Open",
      content: (FirstThreeStep("Company Open")),
    },
    {
      title: "Vendor Open",
      content: (FirstThreeStep("Vendor Open")),
    },
    {
      title: "Company SOA",
      content: (
        FirstThreeStep("Company SOA")
      ),
    },
    {
      title: "Report",
      content: (
        <>
          <div style={{ margin: "10px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {/* <div>
                <h2 style={{ textAlign: "center", fontWeight: "600",whiteSpace:"nowrap"}}>Create Mapppings</h2>
              </div> */}
              <div style={{ display: "flex", gap: "20px" }}>
                <div>
                  <label style={{ marginRight: "5px", fontWeight: "500" }}>Vendor Name :</label>
                  {/* <span style={{color:"red"}}>*</span> */}
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
                  </Select>
                </div>
                {/* <span style={{color:"red"}}>*</span> */}
                <div>
                  <label style={{ marginRight: "5px", fontWeight: "500" }}>Select Date :</label>
                  <DatePicker format="MM/DD/YYYY" onChange={onChangeDate} />
                </div>
                <div>
                  <label style={{ marginRight: "5px", fontWeight: "500" }}>Select Date :</label>
                  <Input
                    style={{ width: "10px" }}
                    placeholder="Enter your threshold"
                    type="text"
                    onChange={(e) => Thresholdcheck(e.target.value)}
                    className='Threshold'
                    value={Threshold}
                  />
                </div>

              </div>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <Button onClick={() => { setDocModel(true) }} type="primary">
                  <ReloadOutlined title="Reset Mapping" />
                </Button>
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
    if (true) {
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
          if (current <= 2) {
            setdisable(false);
            setloading(false);
            onClose();
            setCurrent(current + 1);
            message.success(`File uploaded successfully. Upload your next file.`);
          }
          else
            message.success(`File uploaded successfully. Please Wait`);
          if (current == 0) {
            setcompanyFileJson([]);
          } else if (current == 1) {
            setvendorFileJson([]);
          } else if (current == 2) {
            setdetailedFileJson([]);
          }
          setUpdateHeader([]);
          return true;
        }
      } catch (error: any) {
        onClose();
        console.log(error);
        message.error(`${error?.response?.data?.error?.message}`);
        setTimeout(() => {
          message.error(`correct and uploading file again`);
        }, 1000);
        setloading(false);
        return false;
      }
    }
  }
  // *****************post vendor naem to this function******
  async function postVendorName() {
    const alldata: any = Cookies.get("VR-user_Role");
    const tokens = JSON.parse(alldata).token;
    const url =
      "https://concerned-plum-crayfish.cyclic.app/api/v2/report/dynamic-report";
    const data = {
      // user: JSON.parse(alldata)?.ID,
      vendorName: vendorName,
      dateTypeMapped: dateVendor,
      threshold: Threshold
    };
    try {
      const response = await axios.post(url, data, {
        headers: {
          Authorization: ` Bearer ${tokens}`,
        },
      });
      if (response.data.success === "ok") {
        SaveDocMapping(DocMappingUrl, Mappings);
        const res = await DownloadReport();
        setMappings([{ Column: '', Type: '', Method: '', Value: '' },]);
        setloading(false);
        setCurrent(0);
        setThreshold(0);
        setcompanyFileDataPost([]);
        setcompanyFileHeaderPost([]);
        SetvendorName("");
      }
    } catch (error) {
      console.log(error);
      message.error("error in get report post call");
      setloading(false);
    }
  }
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
      if (response?.data?.data[0]) {
        return response?.data?.data[0];
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return error;
    }
  }
  async function SaveDocMapping(urlforpost: any, postdata: any) {
    let data = await getMapping(urlforpost);
    if (data != null && data?._id) {
      urlforpost = `${urlforpost}/${data._id}`;
    }
    const alldata: any = Cookies.get("VR-user_Role");
    const tokens = JSON.parse(alldata).token;
    const finaltemp = {
      data: postdata,
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
      setcompanyFileHeaderPost(header);
      setcompanyFileDataPost(alldata);
      const transformedData = await transformToObjectsFile1(header, alldata, []);
      console.log(transformedData);
      setdisable(false);
      setloading(false);
      onClose();
      setCustomFileName("");
      setCurrent(current + 1);
      message.success(`File uploaded successfully. Upload your next file.`);
      // try {
      //   // console.log("Transformed data:", transformedData);
      //   await postData(companyPostUrl, transformedData, companyFileName);
      // } catch (error) {
      //   console.error("Error during transformation:", error);
      // }
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
        setcompanyFileHeaderPost(convertFileHeader);
        setcompanyFileDataPost(Allfilejson);
        const transformedData = await transformToObjectsFile1(convertFileHeader, Allfilejson, []);
        console.log(transformedData);
        setCustomFileName("");
        setdisable(false);
        setloading(false);
        onClose();
        setCurrent(current + 1);
        message.success(`File uploaded successfully. Upload your next file.`);
        // try {
        //   const transformedData = await transformToObjectsFile1(
        //     convertFileHeader,
        //     Allfilejson
        //   );
        //   // console.log("Transformed data:", transformedData);
        //   if (transformedData != null) {
        //     onClose();
        //     await postData(companyPostUrl, transformedData, companyFileName);
        //   } else {
        //     message.error(`Check and Upload file Again`);
        //   }
        // } catch (error) {
        //   message.error(`first file upload error`);
        // }
      } else {
        message.error(`Please select a value for each dropdown.`);
      }
    }
  }

  const transformToObjectsFile1 = async (headers: any, data: any, alldocmap: any) => {
    const vendorNamedropdown: any = [];
    const documentMap = alldocmap?.filter(item => item?.Column === "Document Number" && (item?.Type == "Advance Payment" || item?.Type == "Debit note"));
    let TransFormToObjectsData = await Promise.all(
      data?.map(async (row: any, idx: number) => {
        const rowData: any = {};
        await Promise.all(
          headers?.map(async (header: any, index: any) => {
            let value = row[index];
            if (value !== "" && value !== undefined && value !== null) {
              if (header === "Invoice Number" || header === "Document Number") {
                value = String(value)?.replace(/[\W_]+/g, "");
                if (header == "Document Number") {
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
  const transformToObjectsFile3 = async (headers: any, data: any, alldocmap: any) => {
    // const alldocmap = Mappings.slice(0, -1);
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
    const docmap = await getMapping(DocMappingUrl);
    if (docmap?.data?.length > 0) {
      console.log(docmap.data);
      setMappings(docmap.data);
    }
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
      message.success(`Complete Documents Mapping`);
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
        message.success(`Complete Documents Mapping`);
      } else {
        message.error(`Please select a value for each dropdown.`);
      }
    }
  }
  // ************************get reports*********************
  async function getreport() {
    let allmap = Mappings.slice(0, -1);
    const isValid = allmap?.length > 0 && allmap?.every(item => item?.Column?.trim() !== '' && item?.Type?.trim() !== '' && item?.Method?.trim() !== '' && item?.Value?.trim() !== '');
    if (vendorName != "" && vendorName != undefined && vendorName != null && Mappings.length > 1 && allmap.length > 0 && isValid && dateVendor != "" && dateVendor != undefined && dateVendor != undefined && Threshold >= 0) {
      try {
        setloading(true);
        if (companyFileDataPost.length > 0 && companyFileHeaderPost.length > 0) {
          const transformedDatafile1 = await transformToObjectsFile1(companyFileHeaderPost, companyFileDataPost, allmap);
          await postData(companyPostUrl, transformedDatafile1, companyFileName);

          const transformedData = await transformToObjectsFile3(detailedFileJson[0], detailedFileJson, allmap);
          console.log("Transformed data:", transformedData);
          const check = await postData(detailPostUrl, transformedData, detailedFileName);
          if (check) {
            await postVendorName();
          }

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
    height: `${current==3 ? "450px" : "370px"}`,
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

  const optionsWithButtons = Object.entries(OptionsId).map(([key, value]) => {
    return {
      label: (
        <Tooltip title={value !== "" ? "" : "Mapping not available"}>
          <span>
            {key}
            {value !== "" ?
              (
                <EyeOutlined onClick={() => { resetMappingView(key) }}
                  style={{ marginLeft: 8, color: '#1677ff' }}
                />
              ) : (
                <EyeOutlined
                  style={{ marginLeft: 12, color: 'gray', cursor: 'not-allowed' }}
                />
              )}
          </span>
        </Tooltip>
      ),
      value: key,
      disabled: value === "",
    };
  });
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
        className="drag-n-drop-Drawer"
        extra={
          <Space>
            <Tooltip placement="bottom" title={"Show File Preview"}>
              <Button onClick={showfiles} type="primary">
                <EyeOutlined />
              </Button>
            </Tooltip>
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
        onCancel={() => setOpen(false)}
        style={{ padding: "10px", top: "0px" }}
        width={"100%"}
        okButtonProps={{ style: { display: "none" } }}
        // zIndex={10000}
        footer={null}
      >
        <div>
          <ShowFile data={showfile} />
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
        <Checkbox.Group options={optionsWithButtons} onChange={onChange} style={{ margin: "10px 0px 30px 0px  ", display: "flex", alignItems: "center", gap: "10px" }} />
      </Modal>
      <Modal
        title="Saved Mapping"
        open={mappingModal}
        style={{ textAlign: "center" }}
        onCancel={() => setMappingModal(false)}
        width={800}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        zIndex={10000}
      >
        <MappingHeadersTable contents={ResMappingPrevdata} />
      </Modal >
      <Modal title='Do You Want To Reset Document Mapping?'
        open={DocModel}
        onOk={() => { setMappings([{ Column: '', Type: '', Method: '', Value: '' },]), setDocModel(false) }}
        onCancel={() => setDocModel(false)}>
      </Modal>
    </>
  );
};
export default Import;
