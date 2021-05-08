import React, { Component } from 'react'
import { ReactShape } from '@antv/x6-react-shape'
import STYLES from './index.less'
class CustomNode extends Component<{
  node?: ReactShape
  text: string
  imgSrc: string
}> {
  shouldComponentUpdate() {
    const node = this.props.node
    if (node) {
      if (node.hasChanged('data')) {
        return true
      }
    }

    return false
  }

  render() {
    return (
      <div className={STYLES.wrap}>
        <i><img src={this.props.imgSrc} /></i>
        <label>{this.props.text}</label>
      </div>
    )
  }
};

export default CustomNode;