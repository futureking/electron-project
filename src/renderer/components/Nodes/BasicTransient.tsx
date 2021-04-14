import React, { Component } from 'react'
import { Color } from '@antv/x6'
import { ReactShape } from '@antv/x6-react-shape'

class BasicTransient extends Component<{
  node?: ReactShape
  text: string
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
    const color = '#1890ff';
    return (
      <div
        style={{
          color: '#fff',
          width: '100px',
          height: '40px',
          textAlign: 'center',
          lineHeight: '40px',
          background: color,
        }}
      >
        {this.props.text}
      </div>
    )
  }
};

export default BasicTransient;