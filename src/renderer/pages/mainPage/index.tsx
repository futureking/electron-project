import React from 'react';
import { SplitBox } from '@antv/x6-react-components';
import Layout from '@/layout';
import TabList from '@/components/tabList';
import Board from '@/components/board';
import '@antv/x6-react-components/es/split-box/style/index.css';

import STYLES from './index.less';

const DashBoard: React.FC = () => {

  return(
    <Layout>
      <div className={STYLES.wrap}>
        <div className={STYLES.tabList}>
          <TabList />
        </div>
        <div className={STYLES.content}>
          <SplitBox
            split="vertical"
            size={240}
            resizable={false}
            primary="first"
          >
            <div className={STYLES.area}>
              222
            </div>
            <div className={STYLES.area}>
              <SplitBox
                split="vertical"
                minSize={40}
                maxSize={-80}
                resizable={false}
                defaultSize={300}
                primary="second"
              >
                <div className={STYLES.area}>
                  <SplitBox
                    split="horizontal"
                    minSize={40}
                    maxSize={-40}
                    defaultSize={450}
                    primary="first"
                  >
                    <div className={STYLES.area} >
                      333
                      <Board />
                    </div>
                    <div className={STYLES.area} >
                      444
                    </div>
                  </SplitBox>
                </div>
                <div className={STYLES.area} >
                  555
                </div>
              </SplitBox>
            </div>
          </SplitBox>
        </div>
      </div>
    </Layout>
  )
}

export default DashBoard;