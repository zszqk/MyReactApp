import React, { Component } from 'react'
import { PlusOutlined,LoadingOutlined } from '@ant-design/icons';
import { message, Modal, Upload } from 'antd';
import { reqDeleteImg } from '../../api';
export default class PictureWalls extends Component {
    state = {
        loading: false,
        imageUrl: '',
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [
            // {
            //     uid: '-1',
            //     name: 'image.png',
            //     status: 'done',
            //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            // },
        ]
    }
    getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => resolve(reader.result);

            reader.onerror = (error) => reject(error);
        });
    handleCancel = () => this.setState({ previewVisible: false });
    handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }
        this.setState({
            previewImage:file.url || file.preview,
            previewVisible:true,
            previewTitle:file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
        })
        
    };
    handleChange = async({ fileList,file }) => {
        // console.log('handleChange()', file.status, fileList.length, file===fileList[fileList.length-1])
        // console.log(file)
        // 一旦上传成功, 将当前上传的file的信息修正(name, url)
        if(file.status==='done') {
            const result = file.response  // {status: 0, data: {name: 'xxx.jpg', url: '图片地址'}}
            if(result.status===0) {
              message.success('上传图片成功!')
              const {name, url} = result.data
              file = fileList[fileList.length-1]
              file.name = name
              file.url = url
            } else {
              message.error('上传图片失败')
            }
          } else if (file.status==='removed') { // 删除图片
            const result = (await reqDeleteImg(file.name)).data
            if (result.status===0) {
              message.success('删除图片成功!')
            } else {
              message.error('删除图片失败!')
            }
          }
      
        // 在操作(上传/删除)过程中更新fileList状态
        this.setState({ fileList})
    };
    /*
  获取所有已上传图片文件名的数组
   */
  getImgs  = () => {
    return this.state.fileList.map(file => file.name)
  }
    // 准备图片
    UNSAFE_componentWillMount(){
      if(this.props.imgs){
        const {imgs} = this.props
        const newFileList = imgs.map(img=>{
            return{
                uid:img,
                name:img,
                status:'done',
                url:img
            }
        })
        this.setState({fileList:newFileList})
      }else{
        this.setState({fileList:[]})
      }
        
    }
    render() {
        const { loading, previewVisible, fileList, previewTitle,previewImage } = this.state
        const uploadButton = (
            <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div
                    style={{
                        marginTop: 8,
                    }}
                >
                    Upload
                </div>
            </div>
        )
        return (
            <>
      <Upload
        action="/manage/img/upload"
        listType="picture-card"
        fileList={fileList}
        name='image'
        onPreview={this.handlePreview}
        onChange={this.handleChange}
      >
        {fileList.length >= 3? null : uploadButton}
      </Upload>
      <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={this.handleCancel}>
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </>
        )
    }
}
