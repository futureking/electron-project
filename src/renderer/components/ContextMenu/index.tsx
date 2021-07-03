import React, { useState, useEffect } from 'react';
import { Menu, Dropdown } from 'antd';
import STYLES from './index.less';

interface ItemType {
  name: string,
  method: Function
}
interface Iprops {
  menuList: object;
}

const ContextMenu: React.FC<Iprops> = (props) => {
  const { children, menuList} = props;
  const [data, steData] = useState<Array<ItemType>>([]);

  useEffect(() => {
    let newData: Array<ItemType> = Object.values(menuList);
    steData(newData)

  }, [menuList]);

  const menuInit = () => {
    return <Menu>
      {data && data.map((item, index) => {
        return <Menu.Item key={index} onClick={() =>item.method()} >{item.name}</Menu.Item>
      })}
    </Menu>
  }

  return(
    <Dropdown 
      overlay={() => menuInit()} 
      trigger={['contextMenu']}
    >
      <div className={STYLES.wrap}>
        {children}
      </div>
    </Dropdown>
  )
}

export default ContextMenu;