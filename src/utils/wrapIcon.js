import React from "react";
import * as Icon from '@ant-design/icons';
// 将所给的icon字符串转换成组件的形式
export default function wrapIcon(strIcon){
    return React.createElement(Icon[strIcon])  //批量导入后在使用时需要(例如图标<WindowsOutlined />)icon.WindowsOutlined的形式调用
}
