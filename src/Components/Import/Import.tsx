import React, { useState } from 'react';
import { Button, message, Modal, Select, Steps, theme, UploadProps } from 'antd';
import * as XLSX from 'xlsx';
import Dragger from 'antd/es/upload/Dragger';
import { DownloadOutlined } from '@ant-design/icons';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import { FileExcelOutlined } from '@ant-design/icons';
import './Import.css';
import axios from 'axios';
import Vendor from '../Vendor/vendor';
const { Option } = Select;
const Import = () => {

 


  const [size, setSize] = useState<SizeType>();
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [companyFile, setcompanyFile] = useState([]);
  const [companyFileJson, setcompanyFileJson] = useState<any>([]);
  const [companyFileHeaderJson, setcompanyFileHeaderJson] = useState<any>([]);
  const [companyFileData, setcompanyFileData] = useState<any>([]);
  const [vendorNameOpation, setvendorNameOpation] = useState<any>([]);


  const [companyFileName, setcompanyFileName] = useState("");

  const [vendorfileName, setvendorfileName] = useState("");

  const [detailedFileName, setdetailedFileName] = useState("");


  const [sendData, setsendData] = useState(true);
  

  const [companyFileSelectedValues, setcompanyFileSelectedValues] = useState(Array.from({ length: 9 }, () => ''));
  const [vendorFileSelectedValues, setvendorFileSelectedValues] = useState(Array.from({ length: 9 }, () => ''));
  const [detailedFileSelectedValues, setdetailedFileSelectedValues] = useState(Array.from({ length: 12 }, () => ''));


  const [vendorFileJson, setvendorFileJson] = useState<any>([]);
  const [vendorFileHeaderJson, setvendorFileHeaderJson] = useState<any>([]);
  const [detailedFileJson, setdetailedFileJson] = useState<any>([]);
  const [detailedFileHeaderJson, setdetailedFileHeaderJson] = useState<any>([]);


  // **************for model************
  const [vendorName, SetvendorName] = useState("");
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  //************************** */

  console.log(companyFileSelectedValues, "lkhk")

  const handleSelectChange = (value: any, dropdownIndex: any) => {
    const updatedSelectedValues = [...companyFileSelectedValues];
    updatedSelectedValues[dropdownIndex] = value;
    setcompanyFileSelectedValues(updatedSelectedValues);
  };

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

  const companyFileHeader = [
    "Vendor",
    "Vendor Name",
    "Document Number",
    "Invoice Number",
    "Closing Balance",
    "Invoice Amount",
    "Currency",
    "Due Date",
    "Document Date",
  ];
  const vendorFileHeader = [
    "Business Partner",
    "Business Partner Name",
    "Closing Balance",
    "Invoice Amount",
    "Currency",
    "Due Date",
    "Docment Date",
    "Document Number",
    "Invoice Number",
  ];

  const detailedFileHeader = [
    "Due Date",
    "Company Code",
    "Credit Amount(INR)",
    "Debit Amount(INR)",
    "Cheque Rtgs Neft",
    "Payment Docment",
    "Reference",
    "Grn Number",
    "Invoice Date",
    "Document Date",
    "Document Number",
    "Invoice Number",
  ]
  const props: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.xlsm, .xlsx,.xls',
    maxCount: 1,
    // action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    showUploadList: true,
    customRequest: ({ file, onSuccess, onError, onUpload }: any) => {
      if (file != "" && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel' || file.type === 'application/vnd.ms-excel.sheet.macroEnabled.12')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target) {
            const data = event.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            const headers: any = jsonData[0];
            const trimmedHeaders = headers.map((str: any) => str.trim().replace(/\s+/g, ' '));
            jsonData[0] = trimmedHeaders;
            console.log('JSON Data:', jsonData);
            console.log('Headers:', headers);
            if (current == 0) {
              setcompanyFile(file);
              setcompanyFileJson(jsonData);
              setcompanyFileHeaderJson(trimmedHeaders);
              setcompanyFileName(file.name);
              onSuccess();
            }
            else if (current == 2) {
              setvendorFileJson(jsonData);
              setvendorFileHeaderJson(trimmedHeaders);
              onSuccess();
              setvendorfileName(file.name)
            }
            else if (current == 4) {
              setdetailedFileJson(jsonData);
              setdetailedFileHeaderJson(trimmedHeaders);
              setdetailedFileName(file.name);
              onSuccess();
            }
          }
        };
        reader.readAsBinaryString(file);
      }
      else {
        onError();
        setTimeout(() => {
          message.error(`Please upload excle file.`);
        }, 2000);
      }
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };
  const uploadFile = (Filename: any) => (
    <Dragger {...props}>
      <p className="ant-upload-drag-icon">
        {/* <InboxOutlined /> */}
        <FileExcelOutlined />
      </p>
      <p className="ant-upload-text">Click or drag file to this area to upload {Filename}</p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibited from uploading company data or other
        banned files.
      </p>
    </Dragger>
  );
  const steps: any = [
    {
      title: 'First',
      content: (
        <div style={{ margin: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "50px" }}>
            <div>
              Note:
            </div>
            <div>
              <Button type="primary" icon={<DownloadOutlined />} size={size}>
                Sample file
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
      title: 'Second',
      content: (
        <div className='Step2Main'>
          <div className='Step2Note'>
            Note: All the fields are mandatory and Select your file column name with matched dropdown
          </div>
          <div className='Step2Dropdown'>
            {
              companyFileHeader.map((key: any, index) => (
                <div className='DropdownMaindiv' key={index}>
                  <div style={{ marginLeft: "12px", width: "100%" }}>{key}: </div>
                  <Select
                    key={index}
                    className='Dropdown'
                    // style={{ width: 300, margin: '8px' }}
                    placeholder={`select your ${key} column`}
                    onChange={(value) => handleSelectChange(value, index)}
                  >
                    {companyFileHeaderJson
                      .filter((option: any) => !companyFileSelectedValues.includes(option))
                      .map((option: any) => (
                        <Option key={option} value={option}>
                          {option}
                        </Option>
                      ))}
                  </Select>
                </div>
              ))
            }
          </div>
        </div>
      )
    },
    {
      title: 'Thrid',
      content: (
        <div style={{ margin: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "50px" }}>
            <div>
              Note:
            </div>
            <div>
              <Button type="primary" icon={<DownloadOutlined />} size={size}>
                Sample file
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
      title: 'Foruth',
      content: (
        <div className='Step2Main'>
          <div className='Step2Note'>
            Note: All the fields are mandatory and Select your file column name with matched dropdown
          </div>
          <div className='Step2Dropdown'>
            {
              vendorFileHeader.map((key: any, index) => (
                <div className='DropdownMaindiv' key={index}>
                  <div style={{ marginLeft: "12px", width: "100%" }}>{key}: </div>
                  <Select
                    key={index}
                    className='Dropdown'
                    // style={{ width: 300, margin: '8px' }}
                    placeholder={`select your ${key} column`}
                    onChange={(value) => handleSelectChange2(value, index)}
                  >
                    {vendorFileHeaderJson
                      .filter((option: any) => !vendorFileSelectedValues.includes(option))
                      .map((option: any) => (
                        <Option key={option} value={option}>
                          {option}
                        </Option>
                      ))}
                  </Select>
                </div>
              ))
            }
          </div>
        </div>
      ),
    },
    {
      title: 'Five',
      content: (
        <div style={{ margin: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "50px" }}>
            <div>
              Note:
            </div>
            <div>
              <Button type="primary" icon={<DownloadOutlined />} size={size}>
                Sample file
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
      title: 'Last',
      content: (
        <div className='Step2Main'>
          <div className='Step2Note'>
            Note: All the fields are mandatory and Select your file column name with matched dropdown
          </div>
          <div className='Step2Dropdown'>
            {
              detailedFileHeader.map((key: any, index) => (
                <div className='DropdownMaindiv' key={index}>
                  <div style={{ marginLeft: "12px", width: "100%" }}>{key}: </div>
                  <Select
                    key={index}
                    className='Dropdown'
                    // style={{ width: 300, margin: '8px' }}
                    placeholder={`select your ${key} column`}
                    onChange={(value) => handleSelectChange3(value, index)}
                  >
                    {detailedFileHeaderJson
                      .filter((option: any) => !detailedFileSelectedValues.includes(option))
                      .map((option: any) => (
                        <Option key={option} value={option}>
                          {option}
                        </Option>
                      ))}
                  </Select>
                </div>
              ))
            }
          </div>
        </div>
      ),
    },
  ];

  async function companyFileHeaderChanged() {
    if (companyFileJson.length > 0 && companyFileSelectedValues.length > 0) {
      let data = companyFileJson[0];
      companyFileSelectedValues.forEach((items, indexs) => {
        let index = data.indexOf(items);
        if (index != -1) {
          data[index] = companyFileHeader[indexs];
        }
      })
      let ans: any = companyFileJson;
      ans[0] = data;
      console.log(data)

      const headers: any = ans[0];
      const dataRows: any = ans;
      let vendorNamedropdown:any = [];
      const transformToObjects = (headers: any, data: any) => {
        return data.map((row: any) => {
          const rowData: any = {};
          headers.forEach((header: any, index: any) => {
            // rowData[header] = row[index];
            let value = row[index];
            if (value != "" && value != undefined && value != null) {
              if (header == "Invoice Number" || header == "Document Number") {
                if (value != "" && value != undefined && value != null) {
                  value = String(value).replace(/[\W_]+/g, '');
                }
              }
              if (header == "Vendor Name") {
                vendorNamedropdown.push(value.trim());
              }
              rowData[header] = `${value}`.trim();
            }
            else {
              message.error(`Check Your excle file some mandatory filed data is empty.`);
              setsendData(false);
            }

          });
          return rowData;
        });
      };
      setvendorNameOpation(vendorNamedropdown);
      let transformedData = transformToObjects(headers, dataRows);
      console.log(transformedData);
      transformedData = transformedData.slice(1);
      setcompanyFileData(transformedData);
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

 async function postData(transformedData:any){

      const url = "https://concerned-plum-crayfish.cyclic.app/api/upload/masterOpen";
      let data1 = {
        user: "6568b9ad12f8f60df1b89211",
        fileName: companyFileName,
        data: transformedData
      }
      const url2 = "https://concerned-plum-crayfish.cyclic.app/api/upload/getAllMasterData";
      let alldata: any = localStorage.getItem("VR-user_Role");
      let tokens = JSON.parse(alldata).token;
      //  let tokenforcall = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTY4YjlhZDEyZjhmNjBkZjFiODkyMTEiLCJlbWFpbCI6InVzZXIxQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzAxNDQ2OTc1fQ.c8jFToMIpSLRZtXVxQW1Bj8zfaj6RG89CTab97siz2c";
      try {
        let response = await axios.post(url, data1,
          {
            headers: {
              'Authorization': ` Bearer ${tokens}`
            }
          }
        )
        if (response.status == 201) {

          let response2 = await axios.get(url2,
            {
              headers: {
                'Authorization': ` Bearer ${tokens}`
              }
            }
          )

          console.log(response2);
        }

      }
      catch (error) {
        console.log(error)
      }

  }

  async function vendorFileHeaderChanged() {
    if (vendorFileJson.length > 0 && vendorFileSelectedValues.length > 0) {
      let data = vendorFileJson[0];
      vendorFileSelectedValues.forEach((items, indexs) => {
        let index = data.indexOf(items);
        if (index != -1) {
          data[index] = vendorFileHeader[indexs];
        }
      })
      let ans: any = vendorFileJson;
      ans[0] = data;
      console.log(data)

      const headers: any = ans[0];
      const dataRows: any = ans;

      const transformToObjects = (headers: any, data: any) => {
        return data.map((row: any, indexs: any) => {
          const rowData: any = {};
          headers.forEach((header: any, index: any) => {
            // rowData[header] = row[index];
            let value = row[index];
            // Trim all values
            if (header === "Invoice Number" || header === "Document Number") {
              if (value != "" && value != undefined && value != null) {
                value = String(value).replace(/[\W_]+/g, '');
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

      const url = "https://concerned-plum-crayfish.cyclic.app/api/upload/vendorOpen";
      let data1 = {
        user: "6568b9ad12f8f60df1b89211",
        fileName: vendorfileName,
        data: transformedData
      }
      const url2 = "https://concerned-plum-crayfish.cyclic.app/api/upload/getAllVendorData";
      let alldata: any = localStorage.getItem("VR-user_Role");
      let tokens = JSON.parse(alldata).token;
      //  let tokenforcall = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTY4YjlhZDEyZjhmNjBkZjFiODkyMTEiLCJlbWFpbCI6InVzZXIxQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzAxNDQ2OTc1fQ.c8jFToMIpSLRZtXVxQW1Bj8zfaj6RG89CTab97siz2c";
      try {
        let response = await axios.post(url, data1,
          {
            headers: {
              'Authorization': ` Bearer ${tokens}`
            }
          }
        )
        if (response.status == 201) {

          let response2 = await axios.get(url2,
            {
              headers: {
                'Authorization': ` Bearer ${tokens}`
              }
            }
          )
          console.log(response2);
        }

      }
      catch (error) {
        console.log(error)
      }

    }
  }

  async function detailedFileHeaderChanged() {
    if (detailedFileJson.length > 0 && detailedFileSelectedValues.length > 0) {
      let data = detailedFileJson[0];
      detailedFileSelectedValues.forEach((items, indexs) => {
        let index = data.indexOf(items);
        if (index != -1) {
          data[index] = detailedFileHeader[indexs];
        }
      })
      let ans: any = detailedFileJson;
      ans[0] = data;
      console.log(data)

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
                value = String(value).replace(/[\W_]+/g, '');
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

      const url = "https://concerned-plum-crayfish.cyclic.app/api/upload/CompleteDetails";
      let data1 = {
        user: "6568b9ad12f8f60df1b89211",
        fileName: detailedFileName,
        data: transformedData
      }
      const url2 = "https://concerned-plum-crayfish.cyclic.app/api/upload/getAllCompleteDetailsData";
      let alldata: any = localStorage.getItem("VR-user_Role");
      let tokens = JSON.parse(alldata).token;
      //  let tokenforcall = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTY4YjlhZDEyZjhmNjBkZjFiODkyMTEiLCJlbWFpbCI6InVzZXIxQGdtYWlsLmNvbSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzAxNDQ2OTc1fQ.c8jFToMIpSLRZtXVxQW1Bj8zfaj6RG89CTab97siz2c";
      try {
        let response = await axios.post(url, data1,
          {
            headers: {
              'Authorization': ` Bearer ${tokens}`
            }
          }
        )
        if (response.status == 201) {

          let response2 = await axios.get(url2,
            {
              headers: {
                'Authorization': ` Bearer ${tokens}`
              }
            }
          )
          console.log(response2);
        }

      }
      catch (error) {
        console.log(error)
      }

    }
    message.success('Processing complete!')
  }

  async function postVendorName(name:any){
    let alldata: any = localStorage.getItem("VR-user_Role");
    let tokens = JSON.parse(alldata).token;
    const url = "https://concerned-plum-crayfish.cyclic.app/api/generate-report";
      let data1 = {
        user: "6568b9ad12f8f60df1b89211",
        VendorName: name
      }

      try {
        let response = await axios.post(url, data1,
          {
            headers: {
              'Authorization': ` Bearer ${tokens}`
            }
          }
        )
        if (response.status == 201) {
          console.log(response);
        }

      }
      catch (error) {
        console.log(error)
      }
  }

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    if(sendData && companyFileData.length > 0 ){
      postData(companyFileData);
      setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
     }, 2000);
   }
   else{}

  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen(false);
  };


  const next = () => {
    if (current == 0) {
      if (companyFileJson.length != undefined && companyFileJson.length != null && companyFileJson.length > 0) {
        setCurrent(current + 1);
      }
      else {
        message.error(`Please upload excle file.`);
      }
    }
    else if (current == 1) {
      const allValuesSelected = companyFileSelectedValues.every(value => value !== '');
      if (allValuesSelected) {
        companyFileHeaderChanged();
        setCurrent(current + 1);
      } 
      else {
        message.error(`Please select a value for each dropdown.`);
      }
    }
    else if (current == 2) {
      if (vendorFileJson.length != undefined && vendorFileJson.length != null && vendorFileJson.length > 0) {
        setCurrent(current + 1);
      }
      else {
        message.error(`Please upload excle file.`);
      }
    }
    else if (current == 3) {
      const allValuesSelected = vendorFileSelectedValues.every(value => value !== '');
      if (allValuesSelected) {
        vendorFileHeaderChanged();
        setCurrent(current + 1);
      }
      else {
        message.error(`Please select a value for each dropdown.`);
      }

    }
    else if (current == 4) {
      if (detailedFileJson.length != undefined && detailedFileJson.length != null && detailedFileJson.length > 0) {
        setCurrent(current + 1);
      }
      else {
        message.error(`Please upload excle file.`);
      }
    }
    else if (current == 5) {
      const allValuesSelected = detailedFileSelectedValues.every(value => value !== '');
      if (allValuesSelected) {
        detailedFileHeaderChanged();
        if(vendorName != "" && vendorName != null && vendorName != undefined){
        postVendorName(vendorName);
        }
      }
      else {
        message.error(`Please select a value for each dropdown.`);
      }
    }
  };
  // const prev = () => {
  //   setCurrent(current - 1);
  // };
  const items = steps.map((item: any) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    height: "450px",
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
        <div style={{ marginTop: 24, display: "Flex", justifyContent: "space-around" }}>
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
          className='Dropdown'
          // style={{ width: 300, margin: '8px' }}
          placeholder={`select Vender naem`}
          onChange={(value) => SetvendorName(value)}
        >
         { vendorNameOpation.map((option: any) => (
              <Option key={option} value={option}>
                {option}
              </Option>
            ))
         }
        </Select>
      </Modal>
    </>
  );
}

export default Import