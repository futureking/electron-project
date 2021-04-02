import React from 'react';
import { SplitBox } from '@antv/x6-react-components'
import Layout from '../../layout';
import '@antv/x6-react-components/es/split-box/style/index.css';

import STYLES from './index.less';

const DashBoard: React.FC = () => {

  return(
    <Layout>
      <div className={STYLES.wrap}>
        <div  
          className={STYLES.content}>
            <SplitBox
              split="vertical"
              minSize={40}
              maxSize={-160}
              defaultSize={240}
              primary="first"
            >
              <div>
                <SplitBox
                  split="vertical"
                  minSize={40}
                  maxSize={-80}
                  defaultSize={'40%'}
                  primary="second"
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <SplitBox
                      split="horizontal"
                      minSize={40}
                      maxSize={-40}
                      defaultSize={80}
                      primary="first"
                    >
                      <div
                        className={STYLES.drawBoard}
                        style={{
                          width: '100%',
                          height: '100%',
                          background: '#e6f7ff',
                        }}
                      >333</div>
                      <div
                        className={STYLES.timeLine}
                        style={{
                          width: '100%',
                          height: '100%',
                          background: '#e6fffb',
                        }}
                      >444</div>
                    </SplitBox>
                  </div>
                  <div
                    className={STYLES.right}
                    style={{
                      width: '100%',
                      height: '100%',
                      background: '#f6ffed',
                    }}
                  >555</div>
                </SplitBox>
              </div>
            </SplitBox>
        </div>
      </div>
    </Layout>
  )
}

export default DashBoard;