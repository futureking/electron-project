import React, { useState, useEffect } from 'react';
import { Tabs } from 'antd';
import STYLES from './index.less';

const { TabPane } = Tabs;

const initialPanes = [
  { title: 'Tab 1', content: 'Content of Tab 1', key: '1' },
  { title: 'Tab 2', content: 'Content of Tab 2', key: '2' },
  {
    title: 'Tab 3',
    content: 'Content of Tab 3',
    key: '3',
    closable: false,
  },
];

const TabList: React.FC = () => {

  const [activeKey, setActiveKey] = useState(initialPanes[0].key);
  const [panes, setPanes] = useState(initialPanes);

  const onChange = activeKey => {
    console.info(activeKey)
    setActiveKey(activeKey);
  };

  const onEdit = () => {

  }


  return(
    <div className={STYLES.wrap}>
     <Tabs
        type="editable-card"
        onChange={onChange}
        activeKey={activeKey}
        onEdit={onEdit}
        size="small"
      >
        {panes.map(pane => (
          <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
            {pane.content}
          </TabPane>
        ))}
      </Tabs>
    </div>
  )
};

export default TabList;