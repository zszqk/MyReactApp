import React, { Component } from 'react' 
import withRouter from '../../utils/withRouter'
class index extends Component {
    handleClick = () => {

        this.props.navigate('/')
    }
    
    render() {
        return (
            <div>this is test page
                <button onClick={this.handleClick}>点击获取</button>
            </div>
        )
    }
}
export default withRouter(index)