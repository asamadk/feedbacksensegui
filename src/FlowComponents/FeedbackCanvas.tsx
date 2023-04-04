import { Box, Button, Fab } from '@mui/material'
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import 'reactflow/dist/style.css';
import * as ButtonStyle from '../Styles/ButtonStyle'
import { addEdge, applyEdgeChanges, Node, applyNodeChanges, Background, Controls, ReactFlow, NodeToolbar, useReactFlow, MiniMap } from 'reactflow'
import CustomNode from './CustomNode';


let id = 0;
const getId = () => `dndnode_${id++}${new Date().getMilliseconds()}`;

const nodeTypes = {
    selectorNode: CustomNode,
};

function FeedbackCanvas(props: any) {

    const [surveyFlow , setSurveyFlow] = React.useState<any>(props.surveyDetail);

    useEffect(() => {
        onRestore();
        if(props?.surveyDetail?.workflows != null && props?.surveyDetail?.workflows.length > 0){
            setSurveyFlow(props?.surveyDetail?.workflows[0]);
        }
    }, [props.surveyDetail]);

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
            borderRadius: '5px',
            padding: '10px'
        }
    }

    const createNodeFromComponentData = (componentData: any, position: any) => {
        if (componentData == null || componentData.id == null) {
            return;
        }

        let uniqueId = getId();
        let tempComp: Node = {
            id: uniqueId,
            type: 'selectorNode',
            data: {
                uId: uniqueId,
                compId: componentData.id,
                label: componentData.header,
                description: componentData.description,
                onDelete: deleteNode,
                onEdit: props.onEdit
            },
            style: getComponentStyle(componentData.bgColor),
            position: position,
        }

        setNodes((nds) => nds.concat(tempComp));
    }

    const handleSaveWorkflow = useCallback(() => {
        if (reactFlowInstance) {
            const flow = reactFlowInstance.toObject();
            props.performSave(flow);
        }
    }, [reactFlowInstance]);


    const onRestore = useCallback(() => {
        // console.log('onRestore',surveyFlow?.json);
        const restoreFlow = async () => {
            if(props.surveyDetail == null || surveyFlow == null){
                return;
            }
            const tempSurFlow = JSON.parse(surveyFlow?.json);
            const flow: any = tempSurFlow;
            if (flow) {
                let nodeList : any[] = flow.nodes;
                for(let i =0;i<nodeList.length;i++){
                    nodeList[i].data.onDelete = deleteNode;
                    nodeList[i].data.onEdit = props.onEdit;

                }
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
            }
        };

        restoreFlow();
    }, [setNodes,props.surveyDetail]);

    const deleteNode = (id: string) => {
        if (id != null) {
            setNodes(nds => nds.filter(node => node.id !== id));
        }
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
                panOnScroll
                selectionOnDrag
            >
                {/* <MiniMap nodeColor={'#454545'} color={'#1E1E1E'} /> */}
                <Background />
                <Controls />
                <Box sx={{position: 'absolute',top: '10px',left: '-5px'}} >
                    <Button style={{position: 'relative', zIndex: '100',color : '#f1f1f1'}} sx={ButtonStyle.containedButton} onClick={handleSaveWorkflow} >Save</Button>
                </Box>
            </ReactFlow>
        </Box>
    )
}

export default FeedbackCanvas