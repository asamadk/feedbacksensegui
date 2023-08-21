import { Box, Button, Fab } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import 'reactflow/dist/style.css';
import * as ButtonStyle from '../Styles/ButtonStyle'
import { addEdge, applyEdgeChanges, Node, applyNodeChanges, Background, Controls, ReactFlow, NodeToolbar, useReactFlow, MiniMap, StraightEdge, StepEdge, SmoothStepEdge } from 'reactflow'
import CustomNode from './CustomNode';
import SaveIcon from '@mui/icons-material/Save';
import Notification from '../Utils/Notification';
import { useDispatch } from 'react-redux';
import { updateWorkflowDirty } from '../Redux/Actions/workflowDirtyActions';
import { useSelector } from 'react-redux';

let id = 0;
const getId = () => `dndnode_${id++}${new Date().getMilliseconds()}`;

const nodeTypes = {
    selectorNode: CustomNode,
};

function FeedbackCanvas(props: any) {
    const snackbarRef: any = useRef(null);
    const [surveyFlow, setSurveyFlow] = React.useState<any>(props.flow);
    const dispatch = useDispatch<any>();
    const currentWorkflowId = useSelector((state: any) => state.currentWorkflow);

    useEffect(() => {
        if (props?.surveyDetail?.workflows != null && props?.surveyDetail?.workflows.length > 0) {
            setSurveyFlow(props?.surveyDetail?.workflows[0]);
        }
    }, [props.surveyDetail]);

    useEffect(() => {
        restoreFlow();
    }, [surveyFlow]);


    const restoreFlow = async () => {
        if (props.surveyDetail == null || surveyFlow == null) {
            return;
        }
        const tempSurFlow = JSON.parse(surveyFlow?.json);
        const flow: any = tempSurFlow;
        if (flow) {
            let nodeList: any[] = flow.nodes;
            for (let i = 0; i < nodeList.length; i++) {
                nodeList[i].data.onDelete = deleteNode;
                nodeList[i].data.onEdit = props.onEdit;
            }
            setNodes(flow.nodes || []);
            setEdges(flow.edges || []);
        }
    };

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
    }, [reactFlowInstance, props.config,props.performSave]);

    const deleteNode = (id: string) => {
        if(props?.published === true){
            snackbarRef?.current?.show('Cannot delete publish surveys.', 'error');
            return;
        }
        if (id != null) {
            setNodes(nds => nds.filter(node => node.id !== id));
            setEdges(edgs => edgs.filter(edgs => (edgs.source !== id && edgs.target !== id)))
            props.dirty();
            makeGlobalWorkflowDirty();
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
            makeGlobalWorkflowDirty();
        },
        [reactFlowInstance]
    );

    const makeGlobalWorkflowDirty = () => {
        const tempWorkflowDirty :any = {};
        tempWorkflowDirty[currentWorkflowId] = true;
        dispatch(updateWorkflowDirty(tempWorkflowDirty));
    }

    const onNodesChange = useCallback(
        (changes: any) => setNodes((nds: any) => applyNodeChanges(changes, nds)),
        []
    );
    const onEdgesChange = useCallback(
        (changes: any) => setEdges((eds: any) => applyEdgeChanges(changes, eds)),
        []
    );

    const onConnect = useCallback((params: any) => setEdges((eds: any) => addEdge(params, eds)), []);

    const edgeTypes = {
        default: StraightEdge,
      };
      

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
                edgeTypes={edgeTypes}
                maxZoom={3}
                onDrop={onDrop}
                onDragOver={onDragOver}
                panOnScroll
                selectionOnDrag
            >
                <MiniMap nodeColor={'#1e1e1e'} color={'#1E1E1E'} style={{backgroundColor : '#454545'}}/>
                <Background />
                <Controls />
                <Box sx={{ position: 'absolute', top: '10px', left: '-5px' }} >
                    <Button
                        endIcon={<SaveIcon/>}
                        style={{ position: 'relative', zIndex: '100', }}
                        sx={ButtonStyle.containedButton}
                        onClick={handleSaveWorkflow}
                    >
                        Save
                    </Button>
                </Box>
            </ReactFlow>
            <Notification ref={snackbarRef} />
        </Box>
    )
}

export default FeedbackCanvas