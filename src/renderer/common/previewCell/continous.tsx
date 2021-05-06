import React, { Component } from 'react'
import { ReactShape } from '@antv/x6-react-shape'
import STYLES from './index.less'
class ContinousNode extends Component<{
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
      <div className={STYLES.rect}>
        <i><img src={require('../imgs/bg_continues.svg')} /></i>
        <label>{this.props.text}</label>
      </div>
    )
  }
};

export default ContinousNode;