import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { message } from 'antd';
import { Menu } from '@antv/x6-react-components';
import { Graph } from '@antv/x6';
import '@antv/x6-react-components/es/menu/style/index.css';
import STYLES from './index.less';

import { history } from 'umi';
import { HeV1, HeV2 } from '@/../share/data/IRichTap';
import { IMPORT_HE, MAXIMIZE, MINIMIZE, PAGE_CHG_LOGIN, WEB } from '@/../share/define/message';
import { addHeAsGroup, transientDuration } from '@/utils/he-utils';
import store, { undoManager } from '@/stores';

import { objToArr } from '@/utils/helper';
import { openProject } from '@/utils/file-utils';
import { addContinuous, addTransient, addGroup, setCurve, setRepeat, importAudio, getTime, exportHe, canAddEvent, canAddPkg, execDelete, saveProject, createProject, Copy, Cut, Paste } from '@/cmd';
import { observer } from 'mobx-react-lite';
import { isUndefined } from 'lodash';
import Mousetrap from 'mousetrap';
import { values } from 'mobx';

const { ipcRenderer } = window;

const Store = window.require('electron-store');
const fileStore = new Store({ 'name': 'Files Data' });

const MenuItem = Menu.Item
const SubMenu = Menu.SubMenu
const Divider = Menu.Divider

interface IProps {
  visible: boolean,
  flowChart: Graph | undefined
}

const CustomMenu = observer((props: IProps) => {
  const { visible, flowChart } = props;
  const [maximum, setMaximum] = useState(true);

  const [files] = useState<object>(fileStore.get('files') || {});
  const filesArr = objToArr(files);

  const tab = store.currentTab;
  const canImportHe = tab && tab.type === 'Root';


  useEffect(() => {
    function registerHotKey() {
      Mousetrap.bind(['command+c', 'ctrl+c'], () => {
        console.log('command c or control c');
        Copy();
        return false;
      });
      Mousetrap.bind(['command+v', 'ctrl+v'], () => {
        console.log('command v or control v');
        Paste();
        return false;
      });
      Mousetrap.bind(['command+x', 'ctrl+x'], () => {
        console.log('command x or control x');
        Cut();
        return false;
      });
      Mousetrap.bind('del', () => {
        console.log('delete');
        execDelete();
        return false;
      });
      Mousetrap.bind(['command+z', 'ctrl+z'], () => {
        console.log('command z or control z');
        undo();
        return false;
      });
      Mousetrap.bind(['command+shift+z', 'ctrl+shift+z'], () => {
        console.log('command shift z or control shift z');
        redo();
        return false;
      });
      Mousetrap.bind(['command+s', 'ctrl+s'], () => {
        console.log('command s or control s');
        saveProject(store.current!.url);
        return false;
      });
      Mousetrap.bind(['command+o', 'ctrl+o'], () => {
        console.log('command o or control o');
        openProject();
        return false;
      });
      Mousetrap.bind(['command+shift+e', 'ctrl+shift+e'], () => {
        console.log('command shift e or control shift e');
        exportHe();
        return false;
      });
      Mousetrap.bind('v', () => {
        console.log('pointer mode');
        store.selection.setInd('Pointer');
        return false;
      });
      Mousetrap.bind('t', () => {
        console.log('locate mode');
        store.selection.setInd('Time');
        return false;
      });
    }
    registerHotKey();
    return function cleanup() {
      Mousetrap.unbind(['command+c', 'ctrl+c']);
      Mousetrap.unbind(['command+v', 'ctrl+v']);
      Mousetrap.unbind(['command+x', 'ctrl+x']);
      Mousetrap.unbind('d');
      Mousetrap.unbind(['command+z', 'ctrl+z']);
      Mousetrap.unbind(['command+shift+z', 'ctrl+shift+z']);
      Mousetrap.unbind(['command+o', 'ctrl+o']);
      Mousetrap.unbind(['command+shift+e', 'ctrl+shift+e']);
    };
  });

  const importHe = () => {
    if (tab && canImportHe) {
      ipcRenderer.invoke(IMPORT_HE).then(r => {
        if (typeof r === 'undefined')
          return;
        console.log('version', r.version);
        let obj: HeV1 | HeV2;
        if (r.version === 1) {
          obj = JSON.parse(r.data) as HeV1;
        }
        else if (r.version === 2) {
          obj = JSON.parse(r.data) as HeV2;
        }
        else
          return
        const id = tab.rootid;
        if (!!obj) {
          const end = getTime();
          if (canAddPkg(end, 0)) {
            undoManager.get(id).startGroup(() => addHeAsGroup(end, r.name, obj));
            undoManager.get(id).stopGroup();
          }
          else
            message.error(`Current time ${end} has deployed assets`);
        };
      });
    }
  };

  const undo = () => {
    if (!isUndefined(tab))
      undoManager.get(tab.rootid).canUndo && undoManager.get(tab.rootid).undo();
  }
  const redo = () => {
    if (!isUndefined(tab))
      undoManager.get(tab.rootid).canRedo && undoManager.get(tab.rootid).redo();
  }
  const canUndo = (): boolean => {
    if (!isUndefined(tab)) {
      const id = tab.rootid;
      return undoManager.has(id) && undoManager.get(id).canUndo && (tab.type === 'Root' ? true : tab.step < undoManager.get(id).undoLevels);
    }
    else
      return false;
  }
  const canRedo = (): boolean => {
    return !isUndefined(tab) && undoManager.has(tab.rootid) && undoManager.get(tab.rootid).canRedo;
  }
  return (
    <div className={classnames(STYLES.wrap, {
      [STYLES.visible]: visible
    })}>
      <Menu hasIcon={true} className={STYLES.menu}>
        <SubMenu name="File" text="File">
          <MenuItem name="New" text="New" onClick={createProject} />
          <Divider />
          <MenuItem name="Open" text="Open" onClick={openProject} />
          <SubMenu text="Open Recent" name="Open Recent">
            {
              filesArr.filter((it, ix) => ix < 20).map(item => {
                return (
                  <MenuItem key={item.id} name={item.name} text={item.name} onClick={() => openProject(item.url)} />
                )
              })
            }
          </SubMenu>
          <Divider />
          <SubMenu text="Import" name="Import">
            <MenuItem name="Import he" text="Import He" onClick={importHe} />
            <MenuItem name="Import audio" text="Import audio" onClick={() => importAudio('')} />
          </SubMenu>
          <SubMenu text="Export" name="Export">
            <MenuItem name="Export .he" text="Export .he" onClick={exportHe} />
          </SubMenu>
          <Divider />
          <MenuItem name="Save" text="Save" onClick={() => saveProject(store.current!.url)} />
          <MenuItem name="Save as..." text="Save as..." onClick={() => saveProject()} />
          <Divider />
        </SubMenu>
        <SubMenu name="Edit" text="Edit">
          <MenuItem name="Undo" text="Undo" disabled={!canUndo()} onClick={undo} />
          <MenuItem name="Redo" text="Redo" disabled={!canRedo()} onClick={redo} />
          <Divider />
          <MenuItem name="Cut" text="Cut" onClick={Cut} />
          <MenuItem name="Copy" text="Copy" onClick={Copy} />
          <MenuItem name="Paste" text="Paste" onClick={Paste} />
          <MenuItem name="Delete" text="Delete" onClick={execDelete} />
        </SubMenu>
        <SubMenu name="Add" text="Add">
          <MenuItem name="Transient" text="Transient" onClick={() => {
            const end = getTime();
            if (canAddEvent(end, transientDuration(50))) {
              undoManager.get(tab.rootid).startGroup(() => addTransient(end));
              undoManager.get(tab.rootid).stopGroup();
            }
            else
              message.error(`Current time ${end} can't insert transient`);
          }} />
          <MenuItem name="Continues" text="Continues" onClick={() => {
            const end = getTime();
            if (canAddEvent(end, 200)) {
              undoManager.get(tab.rootid).startGroup(() => addContinuous(end));
              undoManager.get(tab.rootid).stopGroup();
            }
            else
              message.error(`Current time ${end} can't insert continuous`);
          }} />
          <MenuItem name="Group" text="Group" onClick={() => {
            const end = getTime();
            if (canAddPkg(end, 100)) {
              undoManager.get(tab.rootid).startGroup(() => addGroup(end));
              undoManager.get(tab.rootid).stopGroup();
            }
            else
              message.error(`Current time ${end} can't insert group`);
          }} />
          <MenuItem name="S to V" text="S to V"
            onClick={() => {
              const end = getTime();
              if (canAddPkg(end, 0))
                flowChart && flowChart.trigger("graph:showAtoVModal");
              else
                message.error(`Current time ${end} can't insert audio to viberation`);
            }}
          />
          <MenuItem name="Background Music" text="Background Music"
            onClick={() => {
              const end = getTime();
              if (canAddPkg(end, 0))
                flowChart && flowChart.trigger("graph:showAddMusicModal");
              else
                message.error(`Current time ${end} can't insert background music`);
            }}
          />
        </SubMenu>
        <SubMenu name="Function" text="Function">
          <MenuItem name="Curve" text="Curve" /*disabled={true}*/ onClick={setCurve} />
          <MenuItem name="Repeat" text="Repeat" onClick={setRepeat} />
        </SubMenu>
        <SubMenu name="View" text="View">
          <MenuItem name="Jump to haptic start" text="Jump to haptic start" onClick={() => {
            store.selector.reset();
          }} />
          <MenuItem name="Jump to haptic end" text="Jump to haptic end" onClick={() => {
            const t = getTime();
            store.selector.setStart(t);
            store.selector.setEnd(t);
          }} />
        </SubMenu>
        <SubMenu name="Window" text="Window">
          <MenuItem name="Minimize" text="Minimize" onClick={() => ipcRenderer.send(MINIMIZE)} />
          <MenuItem name="Maximize" text={maximum ? "Restore" : "Maximize"} onClick={() => {
            ipcRenderer.send(MAXIMIZE);
            setMaximum(!maximum);
          }} />
          <Divider />
          {
            values(store.tabs).map(tab => {
              return (
                <MenuItem key={tab.id} name={`$(tab.name)`} text={`${tab.name}`} onClick={() => {
                  store.selection.changeTab(tab.id);
                  store.selector.reset();
                }
                } />
              )
            })
          }
          {/* <MenuItem name="Project 1(Basic)" text="Project 1(Basic)" /> */}
        </SubMenu>
        <Divider />
        <SubMenu name="Help and account" text="Help and account">
          <MenuItem name="Help page" text="Help page" onClick={() => ipcRenderer.send(WEB)} />
          <Divider />
          <MenuItem name="Login Out" text="Login Out" onClick={() => {
            history.push('/login');
            ipcRenderer.send(PAGE_CHG_LOGIN);
          }} />
        </SubMenu>
      </Menu>
    </div>
  )
});

export default CustomMenu;