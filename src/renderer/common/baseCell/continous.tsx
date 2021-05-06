import React, { Component } from 'react'
import { ReactShape } from '@antv/x6-react-shape'

class ContinueNode extends Component<{
  node?: ReactShape
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
      <div>
        <i><img src={require('../imgs/bg_continues.svg')} /></i>
        <label>Continues</label>
      </div>
    )
  }
};

export default ContinueNode;