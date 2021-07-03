import React, { useState } from 'react';
import classnames from 'classnames';
import { history } from 'umi';
const Store = window.require('electron-store');
const fileStore = new Store({ 'name': 'Files Data' });
import { objToArr } from '@/utils/helper';
import { openProject } from '@/utils/file-utils';
import STYLES from './index.less';
import { PAGE_CHG_MAIN } from '@/../share/define/message';
import { createProject } from '@/cmd';
const { ipcRenderer } = window

const RightContent: React.FC = () => {
  // fileStore.clear();
  const [files] = useState<object>(fileStore.get('files') || {});
  const filesArr = objToArr(files);
  const onOpenProject = (url: string): void => {
    // history.push(`./main?id=${data.id}&name=${data.name}`)
    openProject(url);
  }

  return (
    <div className={STYLES.wrap}>
      <h3>Create New</h3>
      <div className={STYLES.recent}>
        <div className={STYLES.projects}>
          <div className={STYLES.project} onClick={() => {
            createProject();
            ipcRenderer.invoke(PAGE_CHG_MAIN).then(() => {
              history.push('/main');
            });
          }}>
            <div className={classnames(STYLES.block, STYLES.add)}>
              <img src={require('../../imgs/add.svg')} />
            </div>
            <p>New Project</p>
          </div>
          {
            filesArr.reverse().filter((item, index) => index <= 6).map(item => {
              return (
                <div className={STYLES.project} key={item.id} onClick={() => onOpenProject(item.url)} >
                  <div className={STYLES.block}></div>
                  <p>{item.name}</p>
                </div>
              )
            })
          }
        </div>
      </div>
      <div className={STYLES.allTemplate}>
        <h4>Pattern Library</h4>
        <div className={STYLES.projects}>
          {
            filesArr.filter((item, index) => index <= 3).map(item => {
              return (
                <div className={STYLES.project} key={item.id}>
                  <div className={STYLES.block}></div>
                  <p>{item.name}</p>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default RightContent;