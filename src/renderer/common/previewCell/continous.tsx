// import React, { Component } from 'react'
// import { ReactShape } from '@antv/x6-react-shape'
// import STYLES from './index.less'
// class ContinousNode extends Component<{
//   node?: ReactShape
//   text: string
//   imgSrc: string
// }> {
//   shouldComponentUpdate() {
//     const node = this.props.node
//     if (node) {
//       if (node.hasChanged('data')) {
//         return true
//       }
//     }
//     return false
//   }

//   render() {
//     return (
//       <div className={STYLES.rect}>
//         <i><img src={require('../imgs/bg_continues.svg')} alt="" /></i>
//         <label>Continues</label>
//       </div>
//     )
//   }
// };

// export default ContinousNode;

import React from 'react';

import STYLES from './index.less';

interface IProps extends React.HTMLProps<HTMLDivElement> {
  title?: string;
}

const Cell: React.FC<IProps> = (props) => {
  const { title = 'Continues', ...rest } = props;
  
  return(
    <div>
      <div className={STYLES.rect} {...rest}>
        <i><img src={require('../imgs/bg_continues.svg')} /></i>
        <label>{'Continues'}</label>
      </div>
    </div>
  )
}

export default Cell;
