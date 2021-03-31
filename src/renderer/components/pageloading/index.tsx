import React from 'react';
import { Spin } from 'antd';

const PageLoading: React.FC<{
  tip?: string;
}> = ({ tip }) => (
  <div style={{ paddingTop: 100, textAlign: 'center', height:'100%' }}>
    <Spin size='large' tip={tip} />
  </div>
);

export default PageLoading;
