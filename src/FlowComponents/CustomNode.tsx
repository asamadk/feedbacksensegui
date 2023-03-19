import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import NodeComponent from './NodeComponent';

export default memo(({ data, isConnectable } : any) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div>
        <NodeComponent label={data.label} description={data.description} compId={data.compId} />
      </div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={{ background: '#555' }}
        isConnectable={isConnectable}
      />
    </>
  );
});