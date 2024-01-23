import { DownloadOutlined, InboxOutlined } from "@ant-design/icons";
import { Button, Drawer, Space, Upload, message } from "antd";
import { useState } from "react";
const { Dragger } = Upload;
const Bulkaddvendor = ({ bulkVenderOpen, bulkVendorOpenClose }: any) => {
  const [uploadedFile, setUploadedFile] = useState<any | null>(null);
  const props = {
    name: "file",
    multiple: false,
    maxCount: 1,
    showUploadList: true, // To hide the default antd upload list
    customRequest: ({ file, onSuccess }: any) => {
      setUploadedFile(file);
      onSuccess();
      // onError();
    },
    onChange(info: any) {
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
    onDrop(e: any) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  console.log(uploadedFile);
  return (
    <>
      <Drawer
        title="Create a new account"
        width={720}
        onClose={bulkVendorOpenClose}
        open={bulkVenderOpen}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button type="primary">
              <DownloadOutlined /> Download Sample File{" "}
            </Button>
            <Button type="primary"> Submit </Button>
          </Space>
        }
        forceRender={true}
      >
        <Dragger accept="" {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from
            uploading company data or other banned files.
          </p>
        </Dragger>
      </Drawer>
    </>
  );
};

export default Bulkaddvendor;
