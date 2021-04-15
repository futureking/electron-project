import store from '@/stores';
import { Button } from 'antd';
import style from './template-panel.less';

interface TemplatePanelProps {
  pid: string;
}


function TemplatePanel(props: TemplatePanelProps) {
  const { pid } = props;
  const gid = store.projectStore.projects.get(props.pid)?.addGroup('Group 1')??''

  return (
    <div className={style.template}>
      <Button type="primary" onClick={()=>store.projectStore.projects.get(pid)?.addTransient(gid, 100,50,Math.floor(Math.random()*1200))}>Transient</Button>
      <Button type="primary" onClick={()=>store.projectStore.projects.get(pid)?.addContinuous(gid, 200, 100,50,Math.floor(Math.random()*1200))}>Continuous</Button>
    </div>
  );
}

export default TemplatePanel;
