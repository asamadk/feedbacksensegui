import { Box } from '@mui/material'
import React, { useCallback, useRef, useState } from 'react'
import 'reactflow/dist/style.css';
import { addEdge, ReactFlowProvider, applyEdgeChanges, Node, applyNodeChanges, Background, Controls, ReactFlow, NodeToolbar } from 'reactflow'
import CustomNode from './CustomNode';

let id = 0;
const getId = () => `dndnode_${id++}`;

const nodeTypes = {
    selectorNode: CustomNode,
};

function FeedbackCanvas() {

    const reactFlowWrapper: any = useRef(null);
    const [nodes, setNodes] = useState<any[]>([]);
    const [edges, setEdges] = useState<any[]>([]);
    const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

    const getComponentStyle = (color: string): React.CSSProperties => {
        return {
            color: color,
            border: `1px ${color} solid`,
            width: '300px',
            height: '82px',
            backgroundColor: '#1E1E1E',
            borderRadius : '5px',
            padding : '10px'
        }
    }

    const createNodeFromComponentData = (componentData: any, position: any) => {
        if (componentData == null || componentData.id == null) {
            return;
        }
        console.log('Component : ', componentData);
        let tempComp: Node = {
            id: getId(),
            type: 'selectorNode',
            data: {
                compId : componentData.id,
                label: componentData.header,
                description : componentData.description
            },
            style: getComponentStyle(componentData.bgColor),
            position: position,
        }

        console.log('tempComp : ', tempComp);
        setNodes((nds) => nds.concat(tempComp));
    }

    const onDragOver = useCallback((event: any) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: any) => {
            event.preventDefault();

            const reactFlowBounds: any = reactFlowWrapper?.current?.getBoundingClientRect();
            const compData = event.dataTransfer.getData('text/plain');

            // check if the dropped element is valid
            if (typeof compData === 'undefined' || !compData) {
                return;
            }

            const position = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds.left,
                y: event.clientY - reactFlowBounds.top,
            });

            createNodeFromComponentData(JSON.parse(compData), position);
        
        },
        [reactFlowInstance]
    );

    const onNodesChange = useCallback(
        (changes: any) => setNodes((nds: any) => applyNodeChanges(changes, nds)),
        []
    );
    const onEdgesChange = useCallback(
        (changes: any) => setEdges((eds: any) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback((params: any) => setEdges((eds: any) => addEdge(params, eds)), []);

    return (
        <Box sx={{ backgroundColor: '#1E1E1E' }} height={'calc(100vh - 128px)'} ref={reactFlowWrapper} >
            <ReactFlow
                nodes={nodes}
                onNodesChange={onNodesChange}
                edges={edges}
                nodeTypes={nodeTypes}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                minZoom={0.5}
                maxZoom={3}
                onDrop={onDrop}
                onDragOver={onDragOver}
            >
                <Background />
                <Controls />
                <NodeToolbar isVisible={true} >
                    <button>delete</button>
                </NodeToolbar>
            </ReactFlow>
        </Box>
    )
}

export default FeedbackCanvas