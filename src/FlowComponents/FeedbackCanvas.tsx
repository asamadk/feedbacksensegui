import { Box, Button, Fab } from '@mui/material'
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import 'reactflow/dist/style.css';
import { v4 as uuidv4, v4 } from "uuid";
import * as ButtonStyle from '../Styles/ButtonStyle'
import { addEdge, applyEdgeChanges, Node, applyNodeChanges, Background, Controls, ReactFlow, NodeToolbar, useReactFlow, MiniMap, StraightEdge, StepEdge, SmoothStepEdge, Edge, updateEdge, ReactFlowProvider } from 'reactflow'
import CustomNode from './CustomNode';
import SaveIcon from '@mui/icons-material/Save';
import Notification from '../Utils/Notification';
import { useDispatch } from 'react-redux';
import { updateWorkflowDirty } from '../Redux/Actions/workflowDirtyActions';
import { useSelector } from 'react-redux';
import { defaultEdgeOptions, getConnectionMap, getEdgeKey, getEdgePathMap, getEdgesFromJson, getEdgesLabelMap } from '../Utils/WorkflowHelper';
import { logicType, userRoleType } from '../Utils/types';
import { componentList, componentName } from '../Utils/Constants';
import CustomConnectionLine from './CustomConnectionLine';
import { updateWorkflowCheck } from '../Redux/Actions/workflowCheckActions';
import { CoreUtils } from '../SurveyEngine/CoreUtils/CoreUtils';

const elevateEdgesOnSelect = true;
const proOptions = { hideAttribution: true };

const FeedbackCanvas = forwardRef((props: any, ref: any) => {

    const [surveyFlow, setSurveyFlow] = React.useState<any>(props.flow);

    const snackbarRef: any = useRef(null);
    const edgeUpdateSuccessful = useRef(true);
    const dispatch = useDispatch<any>();
    const userRole: userRoleType = useSelector((state: any) => state.userRole);
    const currentWorkflowId = useSelector((state: any) => state.currentWorkflow);
    const [isWorkflowPublished, setIsWorkflowPublished] = useState<boolean>(props.published);
    const defaultColor = useSelector((state: any) => state.colorReducer);

    useEffect(() => {
        setIsWorkflowPublished(props.published);
    }, [props.published]);

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

    const nodeTypes = useMemo(() => ({
        selectorNode: (params: any) => <CustomNode edges={edges} onDelete={deleteNode} config={props.config} onNodeSelection={handleNodeSelection} {...params} />,
    }), [props.config, edges, isWorkflowPublished]);

    const getComponentStyle = (color: string): React.CSSProperties => {
        return {
            color: color,
            border: `1px ${color} solid`,
            width: '300px',
            height: '82px',
            borderRadius: '5px',
            padding: '10px'
        }
    }

    const handleNodeSelection = useCallback((selectedCompId: number, uId: string) => {
        let comp: any = {};
        componentList.forEach(component => {
            if (component.id === selectedCompId) {
                comp = component;
            }
        });
        setNodes((currentNodes) => {
            const nodeIndex = currentNodes.findIndex((node: { data: { uId: string; }; }) => node.data.uId === uId);
            if (nodeIndex < 0) { return currentNodes; }
            const newNodes = [...currentNodes];
            newNodes[nodeIndex] = {
                ...newNodes[nodeIndex],
                data: {
                    ...newNodes[nodeIndex].data,
                    compId: selectedCompId,
                    label: comp.header,
                    description: comp.description,
                    onEdit: props.onEdit
                },
                style: { ...getComponentStyle(comp.bgColor), backgroundColor: defaultColor?.backgroundColor },
            };
            return newNodes;
        });
        makeWorkflowDirty();
    }, [nodes]);

    const createNodeFromComponentData = (componentData: any, position: any) => {
        if (componentData == null || componentData.id == null) {
            return;
        }
        let uniqueId = `p-${v4()}`;
        let tempComp: Node = {
            id: uniqueId,
            type: 'selectorNode',
            data: {
                uId: uniqueId,
                compId: componentData.id,
                label: componentData.header,
                description: componentData.description,
                onEdit: props.onEdit
            },
            style: { ...getComponentStyle(componentData.bgColor), backgroundColor: defaultColor?.backgroundColor },
            position: position,
        }

        setNodes((nds) => nds.concat(tempComp));
        return tempComp;
    }

    useImperativeHandle(ref, () => ({
        createEdge: updateEdges
    }));

    const updateEdges = (data: any, componentId: string, nodeIds: any[]) => {
        handleEdgesUpdate(data, componentId, nodeIds);
    };

    const handleEdgesUpdate = useCallback(
        (data: any, componentId: string, nodeIds: any[]) => {
            const componentsData: logicType[] = data?.logic;
            if (reactFlowInstance === undefined) {
                return;
            }
            const component: any = reactFlowInstance?.getNode(componentId);
            const currentNodes: Node<any>[] = reactFlowInstance.getNodes();
            const currentEdges: Edge<any>[] = reactFlowInstance.getEdges();
            if (
                componentsData !== undefined &&
                componentsData !== null &&
                componentsData.length > 0 &&
                componentId?.length > 0 &&
                component !== null &&
                component !== undefined
            ) {
                let { elementLeft, elementTop } = getNextPosition();
                if (componentsData) {
                    const edgesLabelMap = getEdgesLabelMap(currentEdges);
                    let connectionsMap = getConnectionMap(currentEdges);
                    let edgePathMap = getEdgePathMap(currentEdges);
                    let newNodesData: any[] = [];

                    // deleteEdges(connectionsMap, edgesLabelMap);

                    createUpdateNodesEdges(
                        elementLeft,
                        elementTop,
                        newNodesData,
                        edgePathMap,
                    );

                    handleDefaultEdge(
                        connectionsMap,
                        edgesLabelMap,
                        elementLeft,
                        newNodesData,
                        elementTop,
                    );

                    deleteUnusedEdges();
                    saveData();
                }
            } else {
                //remove edges
                for (let i = currentEdges.length - 1; i >= 0; i--) {
                    const edge = currentEdges[i];
                    if (edge.source === componentId) { // Check if the edge is from the source component
                        if (edge.label === "default") {
                            edge.label = "";
                        } else if (edge.label != null && edge.label.toString().length > 0) {
                            currentEdges.splice(i, 1);
                        }
                    }
                }
                saveData();
            }

            function createUpdateNodesEdges(
                elementLeft: any,
                elementTop: any,
                newNodesData: any[],
                edgePathMap: any
            ) {
                componentsData?.forEach((componentData: logicType, index: number) => {
                    const checkPathKey = `${componentId}-${componentData.path}`;
                    if (edgePathMap[checkPathKey] == null) {
                        //If logic does not have a path do not create edge and node
                        if (componentData.path == null || componentData?.path?.length < 1) {
                            return;
                        }
                        const newNode: any = createNewNode(
                            elementLeft,
                            index,
                            elementTop,
                            componentData,
                            newNodesData
                        );
                        createNewEdge(newNode, componentData);
                        edgePathMap[`${componentId}-${componentData.path}`] = true;
                    }
                });
            }

            function handleDefaultEdge(
                connectionsMap: any,
                edgesLabelMap: any,
                elementLeft: any,
                newNodesData: any[],
                elementTop: any,
            ) {
                let defaultEdgeExists = IsDefaultEdgeCreated(
                    connectionsMap,
                    edgesLabelMap
                );
                if (!defaultEdgeExists) {
                    let componentData: any = { path: "default" };
                    const newNode = createNewNode(
                        elementLeft,
                        newNodesData.length,
                        elementTop,
                        componentData,
                        newNodesData
                    );
                    createNewEdge(newNode, componentData);
                }
            }

            function deleteUnusedEdges() {
                //only runs for nodes that have logic in them
                const logicPaths = new Set<string>();
                componentsData.forEach(logic => {
                    logicPaths.add(`${componentId}-${logic.path}`);
                });
                //add default path
                logicPaths.add(`${componentId}-default`);

                for (let i = currentEdges.length - 1; i >= 0; i--) {
                    const edge = currentEdges[i];
                    const checkPathKey = `${componentId}-${edge.label}`;
                    if (
                        edge.source === componentId &&
                        logicPaths.has(checkPathKey) === false
                    ) { //check if the edge is not in the logic any more
                        currentEdges.splice(i, 1);
                    }
                }
            }

            function saveData() {
                setNodes([...currentNodes]);
                const newEdges = getEdgesFromJson({ edges: currentEdges });
                setEdges([...newEdges]);
            }

            function createNewEdge(newNode: any, componentData: any) {
                let source = componentId;
                let target = newNode.id;
                let label: string = componentData.path;
                const edge: any = {
                    source: source,
                    target: target,
                    label: label,
                };
                currentEdges.push(edge);
                return edge;
            }

            function IsDefaultEdgeCreated(
                connectionsMap: any,
                edgesLabelMap: any
            ) {
                let defaultEdgeExists = false;
                if (componentId in connectionsMap) {
                    let targets: any[] = connectionsMap[componentId];
                    targets?.forEach((target) => {
                        let key = getEdgeKey(componentId, target);
                        let label = edgesLabelMap[key];
                        if (label == null) {

                        }
                        if (label === "default") {
                            defaultEdgeExists = true;
                        }
                    });
                }
                return defaultEdgeExists;
            }

            function createNewNode(
                elementLeft: any,
                li: number,
                elementTop: any,
                componentData: logicType,
                newNodesData: any[]
            ) {
                let newElementLeft = getNextLeftPosition(elementLeft, li);
                let newNode = getNewNode(
                    {
                        clientX: newElementLeft,
                        clientY: elementTop,
                    },
                    "0"
                );
                currentNodes.push(newNode);
                newNodesData.push(componentData);
                return newNode;
            }

            function getNextLeftPosition(elementLeft: any, li: number) {
                return elementLeft + li * 300;
            }

            function getNextPosition() {
                let elementLeft = component.position.x;
                elementLeft = elementLeft - (componentsData.length - 1) * 135;
                if (elementLeft < 0) {
                    elementLeft = 15;
                }
                let elementTop = component.position.y;
                elementTop = elementTop + 250;
                return { elementLeft, elementTop };
            }
        },
        [reactFlowInstance]
    );

    const getNewNode = (
        event: {
            clientX: number;
            clientY: number;
        },
        nodeType: any
    ): any => {
        const reactFlowBounds =
            reactFlowWrapper.current.getBoundingClientRect();

        const position = reactFlowInstance?.project({
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
        });

        const newNode = createNodeFromComponentData({
            id: 14,
            header: 'Selector',
            description: 'Click here to add any component of your choice',
            bgColor: '#808080',
        }, position);

        return newNode;
    };

    const handleSaveWorkflow = useCallback(() => {
        if (reactFlowInstance) {
            const flow = reactFlowInstance.toObject();
            props.performSave(flow);
        }
    }, [reactFlowInstance, props.config, props.performSave]);

    const deleteNode = (id: string) => {
        if (isWorkflowPublished === true) {
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
        const tempWorkflowDirty: any = {};
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

    const onEdgeUpdateStart = useCallback(() => {
        edgeUpdateSuccessful.current = false;
    }, []);

    const onEdgeUpdateEnd = useCallback(
        (_: any, edge: any) => {
            if (!edgeUpdateSuccessful.current) {
                setEdges((eds) => eds.filter((e) => e.id !== edge.id));
            }
            edgeUpdateSuccessful.current = true;
            makeWorkflowDirty();
        },
        [reactFlowInstance]
    );

    const onEdgeUpdate = useCallback((oldEdge: any, newConnection: any) => {
        edgeUpdateSuccessful.current = true;
        setEdges((els) => updateEdge(oldEdge, newConnection, els));
    }, [reactFlowInstance]);


    const onConnect = useCallback(
        (x: any) => setEdges((eds) => addEdge({ ...x, animated: false }, eds)),
        []
    );

    const makeWorkflowDirty = () => {
        const tempWorkflowDirty: any = {};
        tempWorkflowDirty[currentWorkflowId] = true;
        dispatch(updateWorkflowDirty(tempWorkflowDirty));
        dispatch(updateWorkflowCheck(tempWorkflowDirty));
    }


    return (
        <>
            <ReactFlowProvider>
                <Box sx={{ backgroundColor: defaultColor?.backgroundColor }} height={'calc(100vh - 128px)'} ref={reactFlowWrapper} >
                    <ReactFlow
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        // nodes
                        nodes={nodes}
                        onNodesChange={onNodesChange}
                        nodeTypes={nodeTypes}

                        //edges
                        edges={edges}
                        onEdgesChange={onEdgesChange}
                        defaultEdgeOptions={defaultEdgeOptions}
                        edgesFocusable={elevateEdgesOnSelect}
                        edgesUpdatable={elevateEdgesOnSelect}
                        onEdgeUpdateStart={onEdgeUpdateStart}
                        onEdgeUpdateEnd={onEdgeUpdateEnd}
                        onEdgeUpdate={onEdgeUpdate}
                        elevateEdgesOnSelect={elevateEdgesOnSelect}
                        connectionLineComponent={CustomConnectionLine}

                        //utils
                        proOptions={proOptions}
                        minZoom={0.5}
                        maxZoom={3}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        panOnScroll
                        selectionOnDrag
                    >
                        <MiniMap
                            nodeColor={defaultColor?.backgroundColor}
                            color={defaultColor?.backgroundColor}
                            style={{ backgroundColor: '#454545' }}
                        />
                        <Background />
                        <Controls />
                        {
                            CoreUtils.isComponentVisible(userRole,componentName.SAVE_SURVEY_BUTTON) &&
                            <Box sx={{ position: 'absolute', top: '10px', left: '-5px' }} >
                                <Button
                                    endIcon={<SaveIcon />}
                                    style={{ position: 'relative', zIndex: '100', }}
                                    sx={ButtonStyle.containedButton}
                                    onClick={handleSaveWorkflow}
                                >
                                    Save
                                </Button>
                            </Box>
                        }
                    </ReactFlow>
                </Box>
            </ReactFlowProvider>
            <Notification ref={snackbarRef} />
        </>
    )
});

export default FeedbackCanvas