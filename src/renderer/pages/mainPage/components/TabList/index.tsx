import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { values } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Tooltip } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { randomUuid } from '@/utils/utils';
import store from '@/stores';
import STYLES from './index.less';

interface InitData {
  id: number,
  title: string,
  body: string,
  createAt: number,
  isNew: boolean
}

const initData: Array<InitData> = [
  // {
  //   "id": 111,
  //   "title": "项目一",
  //   "body": "请新建项目",
  //   "createAt": 1123123123123,
  //   "isNew": true
  // },
  // {
  //   "id": 222,
  //   "title": "项目二",
  //   "body": "请新建项目",
  //   "createAt": 1123123123123,
  //   "isNew": false
  // }
];
console.info(initData);


const TabList: React.FC = observer((props: any) => {
  console.info(store)
  const STORE = store.projectStore;
  console.info(STORE)

  const { activeId=111 } = props;
  const [tabList, setTabList] = useState(initData);
  const [proNum, setProNum] = useState(1);

  const onTabClick = (tab) => {
    store.selection.setSelection("", tab.id);
  }

  const onCloseTab = (tab) => {
    STORE.delProject(tab.id);
  }

  const onCreateProject = () => {
   let id =  STORE.addProject('项目'+proNum, 'Basic');
  store.selection.setSelection("", id);
  setProNum(proNum+1);
  }

  return(
    <div className={STYLES.wrap}>
      <i><img src={require('./imgs/logo.svg')} /></i>
      <ul>
        { 
          values(STORE.projects).map(tab => {
            return (
              <Tooltip title={tab.name} key={tab.id}>
                <li className={STYLES.tab}>
                  <a 
                    // href="#"
                    className={classnames(STYLES.link, {
                      [STYLES.active]: tab.id === activeId,
                      [STYLES.unSaved]: tab.isNew
                    })}
                    onClick={() => onTabClick(tab)}
                  >
                    {tab.name}
                    <span 
                      className={STYLES.closeIcon}
                      onClick={() =>onCloseTab(tab)}
                    >
                      <CloseOutlined style={{fontSize: '12px', marginLeft: '4px'}} />
                    </span>
                    { tab.isNew && 
                      <span className={STYLES.unSavedIcon}></span>
                    }
                  </a>
                </li>
              </Tooltip>
            )
              })
            }
      </ul>
      <label onClick={onCreateProject}><PlusOutlined /></label>
    </div>
  )
});

export default TabList;