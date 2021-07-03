import React, { useState, useRef, useEffect } from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react-lite';
import { Popconfirm, Tooltip } from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Graph } from '@antv/x6';
import CustomMenu from '@/components/menu';
import { createProject, saveProject } from '@/cmd';
import store, { undoManager } from '@/stores';
import STYLES from './index.less';
import { isUndefined } from 'lodash';

interface IProps {
  flowChart: Graph;
}

const TabList: React.FC<IProps> = observer((props) => {
  const { flowChart } = props;
  const [menuVisible, setMenuVisible] = useState(false);
  
  const menuRef = useRef(null);

  useEffect(() => {
    const to: any = store.lastTab;
    if(store.currentTab! && store.selection!.tabid && !isUndefined(to)) {
      const id = store.currentTab!.rootid;
      if(undoManager.has(id) && undoManager.get(id).canUndo) {
        store.currentTab!.setSave(true);
      }else {
        store.currentTab!.setSave(false);
      }
    }else {
      store.selection.clear();
    }
  }, [JSON.stringify(store)])

  useEffect(() => {
    if (menuVisible) {
      document.addEventListener("click", onHideMenu, false);
      return () => {
        document.removeEventListener("click", onHideMenu, false);
      };
    }
    return;
  }, [menuVisible]);

  const onHideMenu = () => {
    setMenuVisible(false);
  }

  const onTabClick = (id: string) => {
    store.selection.changeTab(id);
    store.selector.reset();
  }

  const deleteTab = (tab) => {
    store.deleteTab(tab.id);
    const to: any = store.lastTab;
    if (!isUndefined(to)) {
      store.selection.changeTab(to.id);
      store.selection.selectRoot();
      store.selector.reset();
    }
    else{
      store.selection.clear();
    }
  }

  const onCloseTab = (e: any, tab) => {
    //tab对应，且未保存
    if(store.selection.tabid === tab.id) {
      if(tab.isSave) {
        e.stopPropagation();
        console.info('tab相同，未保存状态')
      }else {
        // e.stopPropagation();
        console.info('tab相同，已保存状态')
      }
    //tab对应，且已保存
    }else {
      if(tab.isSave) {
        console.info('tab不对应，且未保存')
      }else {
        console.info('tab不对应，且已保存')
      }
      // deleteTab(tab);
    }


    // if(!store.selection!.isSave) {
    //   store.deleteTab(id);
    // }else {
    //   store.deleteTab(id);
    //   const to: any = store.lastTab;
    //   if (!isUndefined(to)) {
    //     store.selection.changeTab(to.id);
    //     store.selection.selectRoot();
    //   }
    //   else{
    //     store.selection.clear();
    //   }
    //   e.stopPropagation();
    // }
  }


  const onSaveConfirm = (tab) => {
    saveProject();
  }

  const onSaveCancel = (tab) => {
    store.delProject(store.currentTab!.rootid);
    deleteTab(tab);
  }

  const elemP: Array<any> = new Array<any>();

  const onPopTitle = (tab) =>{
    return <>
      <p>want to save your changes to "{tab.name}"？</p>
      <span>Your changes will be lost if you don't save them.</span>
    </>
  }
  store.tabs.forEach((tab) => {
    return (
      elemP.push(<Tooltip title={tab.name} key={tab.id}>
        <li className={classnames(STYLES.tab, {
          [STYLES.active]: store.selection.tabid === tab.id ? true : false,
        })}>
          <a
            className={classnames(STYLES.link, {
              [STYLES.unSaved]: false,
            })}
            onClick={() => onTabClick(tab.id)}
          >
            <span className={STYLES.projectName}>{tab.name}</span>
              <span
                className={STYLES.closeIcon}
                onClick={(e) => onCloseTab(e, tab)}
              >
              <Popconfirm
                  title={() => onPopTitle(tab)}
                  onConfirm={() => onSaveConfirm(tab)}
                  onCancel={() => onSaveCancel(tab)}
                  okText="Save..."
                  cancelText="Don't save"
                >
                <CloseOutlined style={{ fontSize: '12px', marginLeft: '4px' }} />
            </Popconfirm>
              </span>
            {tab.isSave &&
              <span className={STYLES.unSavedIcon}></span>
            }
          </a>
        </li>
      </Tooltip>)
    )
  })

  return (
    <div className={STYLES.wrap}>
      <i onClick={() => setMenuVisible(!menuVisible)}>
        <img src={require('./imgs/logo.svg')} />
      </i>
      <div ref={menuRef} onMouseLeave={() => setMenuVisible(false)}>
        <CustomMenu visible={menuVisible} flowChart={flowChart} />
      </div>
      <ul>
        {elemP}
      </ul>
      <label onClick={createProject}><PlusOutlined /></label>
    </div>
  )
});

export default TabList;