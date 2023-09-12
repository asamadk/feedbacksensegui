import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import NodeComponent from './NodeComponent';

export default memo(({ data, isConnectable, onNodeSelection,config }: any) => {

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: '#555', width: '10px', height: '10px' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div>
        <NodeComponent
          delete={data.onDelete}
          uniqueId={data.uId}
          label={data.label}
          description={data.description}
          compId={data.compId}
          edit={data.onEdit}
          onNodeSelection={onNodeSelection}
          config={config}
        />
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        style={{ background: '#555', width: '10px', height: '10px' }}
        isConnectable={isConnectable}
      />
    </>
  );
});