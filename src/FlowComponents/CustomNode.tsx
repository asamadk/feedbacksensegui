import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import NodeComponent from './NodeComponent';

// export default memo(({ data, isConnectable, onNodeSelection, config,edges }: any) => {
function CustomNode({ data, isConnectable, onNodeSelection, config, edges, onDelete }: any) {

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
          delete={onDelete}
          uniqueId={data.uId}
          label={data.label}
          description={data.description}
          compId={data.compId}
          edit={data.onEdit}
          onNodeSelection={onNodeSelection}
          config={config}
          edges={edges}
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
};

export default CustomNode;