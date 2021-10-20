import React from 'react';
import { Redirect } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import './Project.css';

import { setCharacterId } from '../slices/characterSlice';
import { setChromId } from '../slices/chromSlice';
import { setLastProjectId, setProjectInfo, setProjectExtraInfo, setProjectInfoDisplay } from '../slices/projectSlice';
import { apiGetTaskList, apiGetProject, apiAddTask, apiDeleteTask, apiUpdateProject, apiUpdateTask } from '../util/api';

import MpHeader from '../components/MpHeader';
import ProjectInputBox from '../components/ProjectInputBox';
import InputWithButton from '../components/InputWithButton';
import ProjectTable from '../components/ProjectTable';
import CompoundInput from '../components/CompoundInput';
import CompoundSelect from '../components/CompoundSelect';
import { Button, Modal, Space, notification } from 'antd';


export default function Project(props) {
    const [redirect, setRedirect] = useState(null);
    const username = useSelector(state => state.global.username);
    const accessToken = useSelector(state => state.global.accessToken);
    const dispatch = useDispatch();

    const projectId = useSelector(state => state.project.projectId);
    const lastProjectId = useSelector(state => state.project.lastProjectId);
    const projectInfo = useSelector(state => state.project.projectInfo);
    const projectExtraInfo = useSelector(state => state.project.projectExtraInfo);
    const projectInfoDisplay = useSelector(state => state.project.projectInfoDisplay);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isEditInfoModalVisible, setIsEditInfoModalVisible] = useState(false);
    const [isEditRecordModalVisible, setIsEditRecordModalVisible] = useState(false);
    const [editReordInput, setEditReordInput] = useState("");
    const [editReord, setEditReord] = useState("");
    const [isAddTaskModalVisible, setIsAddTaskModalVisible] = useState(false);
    const [addTaskName, setAddTaskName] = useState("");
    const [addTaskType, setAddTaskType] = useState("性状");

    const updateTaskList = () => {
        apiGetTaskList(accessToken, projectId).then((res) => {
            let newData = [];
            res.data.forEach(item => {

                let date = new Date(item.creation_time);
                let dateStr = date.getFullYear() + "-" + `${date.getMonth()+1}`.padStart(2, '0') + "-" + `${date.getDate()}`.padStart(2, '0');

                newData.push({
                    key: item.id,
                    id: item.id,
                    taskName: item.name,
                    addingTime: dateStr,
                    taskType: item.type,
                })
            });
            setData(newData);
            setLoading(false);

        }).catch((err) => {
            console.log(err);
        });
    };



    useEffect(() => {

        // 使用缓存
        // if (projectId === lastProjectId) {

        // } else {
        //     dispatch(setProjectInfo({name: "", sampleId: "", standard: "", note: "", }));
        //     dispatch(setProjectExtraInfo([]));
        //     dispatch(setProjectInfoDisplay([true, true, true, true, ]));
            
        // }

        // 拉取项目数据
        apiGetProject(accessToken, projectId).then((res) => {
            // console.log(res.data);
            dispatch(setProjectInfo({name: res.data.name, sampleId: res.data.number, standard: res.data.standard, note: res.data.note, }));
            

            let newProjectExtraInfo = [];
            let newProjectInfoDisplay = [true, true, true, true, ];
            res.data.additional_fields.forEach(item => {
                newProjectExtraInfo.push({
                    fieldName: item.field_name,
                    fieldValue: item.field_value,
                })
                newProjectInfoDisplay.push(true);
            });
            dispatch(setProjectExtraInfo(newProjectExtraInfo));
            dispatch(setProjectInfoDisplay(newProjectInfoDisplay));

        }).catch((err) => {
            console.log(err);
        });

        updateTaskList();

        // 拉取表格数据
        // apiGetTasksOverview(username, projectId).then((result) => {
        //     if (result.code == 200) {
        //         setData(result.data);
        //         setLoading(false);
        //     }
        // }).catch((err) => {
            
        // });

    }, []);

    useEffect(() => {
        return () => {
            dispatch(setLastProjectId(projectId));
        }
    });

    // -- BEGIN -- ProjectHeader相关

    const onQuitClick = (e) => {
        setRedirect("/");
    }

    const onBreadClick = (e, tag) => {
        switch (tag) {
            case "home":
                setRedirect("/home");
                break;
            default:
                break;
        }
    }

    // -- END -- ProjectHeader相关

    // -- BEGIN -- ProjectInputBox相关

    const onSwitchClick = (checked, e, idx) => {
        let newones = [...projectInfoDisplay];
        newones[idx] = checked;
        dispatch(setProjectInfoDisplay(newones));
    }

    const onSaveInfoClick = (e) => {
        let isCompleted = true;

        if (projectInfo.name === "" || projectInfo.sampleId === "" || projectInfo.standard === "") {
            notification.open({
                message: "保存失败",
                description: "请输入所有必选项目。",
            });
            isCompleted = false;
            return;
        }
        
        projectExtraInfo.forEach(item => {
            if (item.fieldName === "" || item.fieldValue === "") {
                notification.open({
                    message: "保存失败",
                    description: "请输入所有必选项目。",
                });
                isCompleted = false;
                return;
            }
        }); 

        if (isCompleted) {
            apiUpdateProject(accessToken, projectInfo.name, projectInfo.sampleId, projectInfo.standard, projectInfo.note, projectExtraInfo, projectId).then((res) => {
                // console.log(res);
                notification.open({
                    message: "保存成功",
                });
                
            }).catch((err) => {
                console.log(err);
            });
        }
    }

    const onEditInfoClick = (e) => {
        setIsEditInfoModalVisible(true);
    }

    const onInputChange = (e, idx) => {
        // console.log(e.target.value + " " + idx);
        if (idx === 0) {
            dispatch(setProjectInfo({
                ...projectInfo,
                name: e.target.value
            }));
        } else if (idx === 1) {
            dispatch(setProjectInfo({
                ...projectInfo,
                sampleId: e.target.value
            }));
        } else if (idx === 2) {
            dispatch(setProjectInfo({
                ...projectInfo,
                standard: e.target.value
            }));
        } else if (idx === 3) {
            dispatch(setProjectInfo({
                ...projectInfo,
                note: e.target.value
            }));
        } else {
            let newones = [...projectExtraInfo];
            newones[idx-4] = {
                ...newones[idx-4],
                fieldValue: e.target.value,
            }
            dispatch(setProjectExtraInfo(newones));
        }
    }

    // -- END -- ProjectInputBox相关

    // -- BEGIN -- EditInfoModal相关

    const onEditInfoOk = () => {
        setIsEditInfoModalVisible(false);
    }

    const onEditInfoCancel = () => {
        setIsEditInfoModalVisible(false);
    }

    const onDeleteFieldClick = (e, idx) => {
        let newones = [...projectExtraInfo];
        newones.splice(idx, 1);
        dispatch(setProjectExtraInfo(newones));
    }

    const onAddFieldClick = (e) => {
        let newones = [...projectExtraInfo];
        newones.push({
            fieldName: "",
            fieldValue: "",
        });
        dispatch(setProjectExtraInfo(newones));
    }

    const onAddTaskClick = (e) => {
        setAddTaskName("");
        setIsAddTaskModalVisible(true);
    }

    const onFieldInputChange = (e, idx) => {
        let newones = [...projectExtraInfo];
        newones[idx] = {
            ...newones[idx],
            fieldName: e.target.value,
        }

        dispatch(setProjectExtraInfo(newones));
    }

    var editFieldInput = [];
    const renderEditFieldInput = () => {
        for (let i = 0; i < projectExtraInfo.length; i++) {
            editFieldInput.push(
                // key 设置为 i 只是为了消除警告
                // 这样设置没有问题, 因为数据源的相对顺序是正确的
                <InputWithButton 
                    text={projectExtraInfo[i].fieldName}
                    buttonText="删除"
                    isDanger={true}
                    key={i}

                    onButtonClick={(e) => onDeleteFieldClick(e, i)}
                    onInputChange={(e) => onFieldInputChange(e, i)}
                />
            );
        }
    }

    // -- END -- EditInfoModal相关

    // -- BEGIN -- ProjectTable相关

    const onEditRecordClick = (record) => {
        setEditReordInput(record.taskName);
        setEditReord(record);
        setIsEditRecordModalVisible(true);
    }

    const onExamineRecordClick = (record) => {
        if (record.taskType === "性状") {
            dispatch(setCharacterId(record.id));
            setRedirect("/character");
        } else if (record.taskType === "薄层") {
            dispatch(setChromId(record.id));
            setRedirect("/chrom");
        }
    }

    const onDeleteRecordClick = (record) => {
        apiDeleteTask(accessToken, record.id).then((res) => {
            // console.log(res);
            updateTaskList();
        }).catch((err) => {
            console.log(err);
        });
    }

    // -- END -- ProjectTable相关

    // -- BEGIN -- EditRecordModal相关

    const onEditRecordOk = () => {
        for (let i = 0; i < data.length; i++) {
            if (data[i].taskName === editReordInput && data[i].id !== editReord.id) {
                notification.open({
                    message: "字段重复",
                    description: "任务名称与已存在的名称重复，请调整为不重复的名称",
                });
                return;
            }
        }
        if (editReordInput === "") {
            notification.open({
                message: "保存失败",
                description: "请输入所有必选项目。",
            });
        } else {
            apiUpdateTask(accessToken, editReordInput, editReord.taskType, editReord.id).then((res) => {
                // console.log(res);
                updateTaskList();
            }).catch((err) => {
                console.log(err);
            });
    
            setIsEditRecordModalVisible(false);
        }
        
    }

    const onEditRecordCancel = () => {
        setIsEditRecordModalVisible(false);
    }

    const onEditRecordInputChange = (e) => {
        setEditReordInput(e.target.value);
    } 


    // -- END -- EditRecordModal相关

    // -- BEGIN -- AddTaskModal相关

    const onAddTaskOk = () => {
        if (addTaskName === "") {
            notification.open({
                message: "信息不完整",
                description: "请补充完整所有必填信息",
            });
            return;
        }
        for (let i = 0; i < data.length; i++) {
            if (data[i].taskName === addTaskName) {
                notification.open({
                    message: "字段重复",
                    description: "任务名称与已存在的名称重复，请调整为不重复的名称",
                });
                return;
            }
        }
        
        apiAddTask(accessToken, addTaskName, addTaskType, projectId).then((res) => {
            // console.log(res);
            updateTaskList();
        }).catch((err) => {
            console.log(err);
        });
        
        setIsAddTaskModalVisible(false);
        
    }

    const onAddTaskCancel = () => {
        setIsAddTaskModalVisible(false);
    }

    const onAddTaskInputChange = (e) => {
        setAddTaskName(e.target.value);
    } 

    const onAddTaskSelectChange = (value) => {
        setAddTaskType(value);
    }


    // -- END -- AddTaskModal相关相关


    // const onExamineCharacterClick = (e) => {
    //     dispatch(setCharacterId(1));
    //     setRedirect("/character");
    // }

    

    if (redirect !== null) {
        return (
            <Redirect push to={redirect} />
        );
    }

    renderEditFieldInput();
    return (
        <div className="mp-project">
            <MpHeader
                onQuitClick={onQuitClick}
                onBreadClick={onBreadClick}
                username={username}
                breadItems = {[
                    {
                        text: "首页",
                        isActive: true,
                        funcTag: "home",
                    },
                    {
                        text: "项目",
                        isActive: false,
                    },
                ]}
            />

        

            <ProjectInputBox
                projectInfoDisplay={projectInfoDisplay}
                projectInfo={projectInfo}
                projectExtraInfo={projectExtraInfo}

                onSaveInfoClick={onSaveInfoClick}
                onSwitchClick={onSwitchClick}
                onInputChange={onInputChange}
                onEditInfoClick={onEditInfoClick}
                onAddTaskClick={onAddTaskClick}
            />


            <ProjectTable
                data={data}
                loading={loading}

                onEditClick={onEditRecordClick}
                onExamineClick={onExamineRecordClick}
                onDeleteClick={onDeleteRecordClick}
            />

            <Modal
                title="编辑附加信息"
                visible={isEditInfoModalVisible}
                onOk={onEditInfoOk}
                onCancel={onEditInfoCancel}
                okText="确认"
                cancelText="取消"
            >
                <Space className="mp-vlist" direction="vertical" size={'small'}>
                    {editFieldInput}

                    <Button type="primary" size={'large'} onClick={onAddFieldClick}>
                        添加字段
                    </Button>
                </Space>
                
            </Modal>

            <Modal
                title="编辑任务"
                visible={isEditRecordModalVisible}
                onOk={onEditRecordOk}
                onCancel={onEditRecordCancel}
                okText="确认"
                cancelText="取消"
            >
                <Space className="mp-vlist" direction="vertical" size={'small'}>
                    <CompoundInput
                        isSwitchHidden={true}
                        fieldName="任务名称"
                        text={editReordInput}
                        isRequired={true}
                        textWidth={200}
                        maxLength={10}

                        onInputChange={onEditRecordInputChange}
                    />
                </Space>
                
            </Modal>

            <Modal
                title="添加任务"
                visible={isAddTaskModalVisible}
                onOk={onAddTaskOk}
                onCancel={onAddTaskCancel}
                okText="确认"
                cancelText="取消"
            >
                <Space className="mp-vlist" direction="vertical" size={'small'}>
                    <CompoundInput
                        isSwitchHidden={true}
                        fieldName="任务名称"
                        text={addTaskName}
                        isRequired={true}
                        textWidth={200}
                        maxLength={10}
                        

                        onInputChange={onAddTaskInputChange}
                    />
                    <CompoundSelect
                        fieldName="任务类型"
                        textWidth={200}
                        isRequired={true}
                        defaultValue="性状"
                        options={[
                            {
                                value: "性状",
                                text: "性状",
                            },
                            {
                                value: "薄层",
                                text: "薄层",
                            }
                        ]}

                        onSelectChange={onAddTaskSelectChange}
                    />
                </Space>
                
            </Modal>


        </div>
    );
}