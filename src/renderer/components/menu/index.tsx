import React from 'react';
import classnames from 'classnames';
// import { Menu } from 'antd';
import { Menu } from '@antv/x6-react-components';
import '@antv/x6-react-components/es/menu/style/index.css';
import STYLES from './index.less';

import { HeV1, HeV2 } from '@/../share/data/IRichTap';
import { EXPORT_HE, IMPORT_HE, OPEN_PROJ, SAVE_PROJ } from '@/../share/define/message';
import { addHeToGroup, formatHe } from '@/utils/he-utils';
import { X6DataFormart } from '@/utils/x6-data-util';
import store from '@/stores';
import {
  getSnapshot, applySnapshot
} from 'mobx-state-tree';
import FlowGraph from '@/components/Graph';
const { ipcRenderer } = window;

const MenuItem = Menu.Item
const SubMenu = Menu.SubMenu
const Divider = Menu.Divider

interface IProps {
  visible: boolean
}

const CustomMenu = (props: IProps) => {
  const { visible } = props;
  console.info(visible);

  const onMenuClick = () => {

  }
  const importHe = () => {
    ipcRenderer.invoke(IMPORT_HE).then(r => {
      if (typeof r === 'undefined')
        return;
      let obj: HeV1 | HeV2;
      if (r.version === 1) {
        obj = JSON.parse(r.data) as HeV1;
      }
      else if (r.version === 2) {
        obj = JSON.parse(r.data) as HeV2;
      }
      else
        return
      if (!!obj) {
        console.log(r.name, obj);
        addHeToGroup(r.name, obj, 0); 
        const graph = FlowGraph.init()
        const graphData = X6DataFormart();
        graph.fromJSON(graphData);
      };
    });
  };
  const exportHe = () => {
    let stream = formatHe();
    ipcRenderer.send(EXPORT_HE, stream);
  };
  const openProject = () => {
    ipcRenderer.invoke(OPEN_PROJ).then(r => {
      if (typeof r === 'undefined')
        return;
      let url = r.url
      let project = JSON.parse(r.data);
      try {
        store.projectStore.addEmptyProject(project!.id);
        applySnapshot(store.projectStore.projects.get(project!.id)!, project);
        store.projectStore.projects.get(project!.id)!.setName(r.name);
        store.projectStore.projects.get(project!.id)!.setUrl(url);
        store.selection.setSelection('Project', project!.id);
      } catch (error) {
        console.error(error);
      }
    });
  };
  const saveProject = () => {
    const project = store.projectStore.projects.get(store.selection.pid);
    let snapshot = getSnapshot(project!);
    let stream = JSON.stringify(snapshot);
    ipcRenderer.invoke(SAVE_PROJ, project!.name, project!.url, stream).then(r => {
      if (typeof r === 'undefined')
        return;
      project!.setName(r.name);
      project!.setUrl(r.url);
    });
  };
  const saveProjectAs = () => {
    const project = store.projectStore.projects.get(store.selection.pid);
    let snapshot = getSnapshot(project!);
    let stream = JSON.stringify(snapshot);
    ipcRenderer.invoke(SAVE_PROJ, project!.name, '', stream).then(r => {
      if (typeof r === 'undefined')
        return;
      project!.setName(r.name);
      project!.setUrl(r.url);
    });
  };
  return (
    <div className={classnames(STYLES.wrap, {
      [STYLES.visible]: visible
    })}>
      {/* <Menu mode="vertical" onClick={onMenuClick} className={STYLES.menu}>
        <SubMenu key="File" title="File">
          <MenuItem key="New">New</MenuItem>
          <Divider />
          <MenuItem key="Open">oPEN</MenuItem>
          <SubMenu title="Open Recent" key="Open Recent"></SubMenu>
          <Divider />
          <SubMenu title="Export Project..." key="Export Project..."></SubMenu>
          <Divider />
          <MenuItem key="Save">Save</MenuItem>
          <MenuItem key="Save as...">Save as ...</MenuItem>
          <Divider />
        </SubMenu>
        <SubMenu key="Edit" title="Edit">
          <MenuItem key="Undo">Undo</MenuItem>
          <MenuItem key="Redo" disabled={true}>Redo</MenuItem>
          <Divider />
          <MenuItem key="Cut">Cut</MenuItem>
          <MenuItem key="Copy">Copy</MenuItem>
          <MenuItem key="Paste">Paste</MenuItem>
        </SubMenu>
        <SubMenu key="Add" title="Add">
          <MenuItem key="Transient">Transient</MenuItem>
          <MenuItem key="Continues">Continues</MenuItem>
          <MenuItem key="Group">Group</MenuItem>
          <MenuItem key="A to V">A to V</MenuItem>
          <MenuItem key="Background Music">Background Music</MenuItem>
          <Divider />
          <SubMenu key="From Library" title="From Library">
            <MenuItem key="Basic UI">Basic UI</MenuItem>
            <MenuItem key="Game Effect">Game Effect</MenuItem>
            <MenuItem key="Ads Effect">Ads Effect</MenuItem>
          </SubMenu>
        </SubMenu>
        <SubMenu key="Function" title="Function">
          <MenuItem key="Curve" disabled={true} >Curve</MenuItem>
          <MenuItem key="Repeat">Repeat</MenuItem>
        </SubMenu>
        <SubMenu key="View" title="View">
          <MenuItem key="Enter full screen">Enter full screen</MenuItem>
          <MenuItem key="Zoom In">Zoom In</MenuItem>
          <MenuItem key="Zoom Out">Zoom Out</MenuItem>
          <MenuItem key="Zoom to fit">Zoom to fit</MenuItem>
          <Divider />
          <MenuItem key="Jump to haptic start">Jump to haptic start</MenuItem>
          <MenuItem key="Jump to haptic end">Jump to haptic end</MenuItem>
        </SubMenu>
        <SubMenu key="Window" title="Window">
          <MenuItem key="Minimize">Minimize</MenuItem>
          <MenuItem key="Zoom">Zoom</MenuItem>
          <Divider />
          <MenuItem key="Project 1(Basic)">Project 1(Basic)</MenuItem>
        </SubMenu>
        <Divider />
        <SubMenu key="Help and account" title="Help and account">
          <MenuItem key="Help page">Help page</MenuItem>
          <Divider />
          <MenuItem key="Login Out">Login Out</MenuItem>
        </SubMenu>
      </Menu> */}

      <Menu hasIcon={true} onClick={onMenuClick} className={STYLES.menu}>
        <SubMenu name="File" text="File">
          <MenuItem name="New" text="New" />
          <Divider />
          <MenuItem name="Open" text="Open" onClick={openProject} />
          <SubMenu text="Open Recent" name="Open Recent"></SubMenu>
          <Divider />
          <SubMenu text="Import" name="Import">
            <MenuItem name="Import .he" text="Import .he" onClick={importHe} />
            <MenuItem name="Import .wav" text="Import .wav" />
          </SubMenu>
          <SubMenu text="Export" name="Export">
            <MenuItem name="Export .he" text="Export .he" onClick={exportHe} />
          </SubMenu>
          <Divider />
          <MenuItem name="Save" text="Save" onClick={saveProject} />
          <MenuItem name="Save as..." text="Save as..." onClick={saveProjectAs} />
          <Divider />
        </SubMenu>
        <SubMenu name="Edit" text="Edit">
          <MenuItem name="Undo" text="Undo" />
          <MenuItem name="Redo" text="Redo" disabled={true} />
          <Divider />
          <MenuItem name="Cut" text="Cut" />
          <MenuItem name="Copy" text="Copy" />
          <MenuItem name="Paste" text="Paste" />
        </SubMenu>
        <SubMenu name="Add" text="Add">
          <MenuItem name="Transient" text="Transient" />
          <MenuItem name="Continues" text="Continues" />
          <MenuItem name="Group" text="Group" />
          <MenuItem name="A to V" text="A to V" />
          <MenuItem name="Background Music" text="Background Music" />
          <Divider />
          <SubMenu name="From Library" text="From Library">
            <MenuItem name="Basic UI" text="Basic UI" />
            <MenuItem name="Game Effect" text="Game Effect" />
            <MenuItem name="Ads Effect" text="Ads Effect" />
          </SubMenu>
        </SubMenu>
        <SubMenu name="Function" text="Function">
          <MenuItem name="Curve" text="Curve" disabled={true} />
          <MenuItem name="Repeat" text="Repeat" />
        </SubMenu>
        <SubMenu name="View" text="View">
          <MenuItem name="Enter full screen" text="Enter full screen" />
          <MenuItem name="Zoom In" text="Zoom In" />
          <MenuItem name="Zoom Out" text="Zoom Out" />
          <MenuItem name="Zoom to fit" text="Zoom to fit" />
          <Divider />
          <MenuItem name="Jump to haptic start" text="Jump to haptic start" />
          <MenuItem name="Jump to haptic end" text="Jump to haptic end" />
        </SubMenu>
        <SubMenu name="Window" text="Window">
          <MenuItem name="Minimize" text="Minimize" />
          <MenuItem name="Zoom" text="Zoom" />
          <Divider />
          <MenuItem name="Project 1(Basic)" text="Project 1(Basic)" />
        </SubMenu>
        <Divider />
        <SubMenu name="Help and account" text="Help and account">
          <MenuItem name="Help page" text="Help page" />
          <Divider />
          <MenuItem name="Login Out" text="Login Out" />
        </SubMenu>
      </Menu>
    </div>
  )
}

export default CustomMenu;