import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { Tooltip } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import STYLES from './index.less';

interface InitData {
  id: number,
  title: string,
  body: string,
  createAt: number,
  isNew: boolean
}

const initData: Array<InitData> = [
  {
    "id": 111,
    "title": "项目一",
    "body": "请新建项目",
    "createAt": 1123123123123,
    "isNew": true
  },
  {
    "id": 222,
    "title": "项目二",
    "body": "请新建项目",
    "createAt": 1123123123123,
    "isNew": false
  }
];
console.info(initData)

const TabList: React.FC = (props: any) => {
  const { activeId=111 } = props;

  const onTabClick = () => {

  }

  const onCloseTab = () => {

  }

  return(
    <ul className={classnames(STYLES.wrap)}>
      {
        initData.map(tab => {
          return (
            <Tooltip title={tab.title}>
              <li className={STYLES.tab}>
                <a 
                  href=""
                  className={classnames(STYLES.link, {
                    [STYLES.active]: tab.id === activeId,
                    [STYLES.unSaved]: tab.isNew
                  })}
                  onClick={onTabClick}
                >
                  {tab.title}
                  <span 
                    className={STYLES.closeIcon}
                    onClick={onCloseTab}
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
  )
};

export default TabList;