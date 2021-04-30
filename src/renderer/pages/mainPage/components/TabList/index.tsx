import React, { useState } from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Tooltip } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import CustomMenu from '@/components/menu';
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
  //console.info(store)
  const STORE = store.projectStore;
  //console.info(STORE)

  const { activeId=111 } = props;
  const [proNum, setProNum] = useState(1);
  const [menuVisible, setMenuVisible] = useState(false);

  const onTabClick = (tab) => {
    store.selection.setSelection("", tab.id);
  }

  const onCloseTab = (tab) => {
    STORE.delProject(tab.id);
  }

  const onCreateProject = () => {
    let id = STORE.addProject('项目' + proNum, 'Basic');
    store.selection.setSelection("", id);
    setProNum(proNum + 1);
  }

  const elemP: Array<any> = new Array<any>();
  store.projectStore.projects.forEach((project) => {
    elemP.push(<Tooltip title={project.name} key={project.id}>
      <li className={STYLES.tab}>
        <a
          className={classnames(STYLES.link, {
            [STYLES.active]: project.id === activeId,
            [STYLES.unSaved]: false,
          })}
          onClick={() => onTabClick(project)}
        >
          {project.name}
          <span
            className={STYLES.closeIcon}
            onClick={() => onCloseTab(project)}
          >
            <CloseOutlined style={{ fontSize: '12px', marginLeft: '4px' }} />
          </span>
          {false &&
            <span className={STYLES.unSavedIcon}></span>
          }
        </a>
      </li>
    </Tooltip>);
  })
  
  return(
    <div className={STYLES.wrap}>
        <i onClick={() => setMenuVisible(!menuVisible)}>
          <img src={require('./imgs/logo.svg')} />
        </i>
        <CustomMenu visible={menuVisible} />
      <ul>
        {elemP}
      </ul>
      <label onClick={onCreateProject}><PlusOutlined /></label>
    </div>
  )
});

export default TabList;