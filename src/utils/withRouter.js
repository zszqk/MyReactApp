// 由于react-router v6不支持props，这里使用高阶组件的形式进行包装
import React from 'react'
import { useNavigate,useLocation } from 'react-router-dom'
export default function withRouter( Child ) {

    return ( props ) => {
      const location = useLocation();
      const navigate = useNavigate();
      return <Child { ...props } navigate={ navigate } location={ location } />;
    }
  }
  
  