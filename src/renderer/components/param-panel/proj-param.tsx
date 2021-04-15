import { Typography } from 'antd';
import gstyles from './param-panel.less';
import store from '@/stores';
import { observer } from 'mobx-react-lite';

const { Paragraph } = Typography;

interface ProjectProps {
  id: string;
}

const ProjectParam = observer((props: ProjectProps) => {
  const { id } = props;

  return (
    <>
      <p>PROJECT</p>
      <ul>
        <li>
          <p className={gstyles.name}>Name:</p>
          <Paragraph
            editable={{ onChange: store.projectStore.projects.get(id)?.setName }}
            style={{ fontSize: 12 }}
          >
            {store.projectStore.projects.get(id)?.name}
          </Paragraph>
        </li>
        <li>
          <p className={gstyles.name}>Type:</p>
          <p style={{ fontSize: 12 }}>{store.projectStore.projects.get(id)?.type}</p>
        </li>
      </ul>
    </>
  );
});

export default ProjectParam;
