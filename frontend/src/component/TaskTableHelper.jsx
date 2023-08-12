import React from 'react'
import { ApiServices } from '../service/api';
const uuid = require('uuid');
export const useFile = () => { // custom offline hook
    const [file, setFile] = React.useState(null);
    return { file, setFile }
}
export const useImagePreviewUrl = () => {
    const [imagePreviewUrl, setImagePreviewUrl] = React.useState('');
    return { imagePreviewUrl, setImagePreviewUrl };
};

export const useTableData = () => {
    const [tableData, setTableData] = React.useState([{
        id: 0,
        heading: '',
        description: '',
        dateTime: '',
        image: '',
        priority: '',
        createdAt: '',
    }]);
    return { tableData, setTableData }
}

export const usePriorityData = () => {
    const [priorities, setPriorities] = React.useState([{
        id: 0,
        name: ''
    }]);
    return { priorities, setPriorities }
}

export const useOldImagePreviewUrl = () => {
    const [oldImagePreviewUrl, setOldImagePreviewUrl] = React.useState('');

    return { oldImagePreviewUrl, setOldImagePreviewUrl };
};



export const useModelOpen = () => {
    const [modelShow, setModelShow] = React.useState(false);
    return { modelShow, setModelShow }
}

export const useModelHeading = () => {
    const [modelHead, setModelHead] = React.useState('');
    return { modelHead, setModelHead }
}

export const handleFilterClick = (priorityId = null, setTableData) => {
    if (priorityId !== null) {
        ApiServices.getAllTasksByPriorityId(priorityId).then((res) => {
            setTableData(res.data.tasks)
        })
    } else {
        ApiServices.getAllTasks().then((res) => {
            setTableData(res.data.tasks)
        })
    }
}

export const useUserDataOnDialog = () => {
    const [userData, setUserData] = React.useState({
        heading: '',
        description: '',
        dateTime: '',
        priorityId: '',
    });
    return { userData, setUserData }
}

export const useDataOnModelProp = () => {
    const [modelPropData, setModelPropData] = React.useState({
        id: 0,
        heading: '',
        description: '',
        dateTime: '',
        priority: '',
        image: '',
        createdAt: ''
    });
    return { modelPropData, setModelPropData }
}

export const useRowId = () => { // custom offline hook
    const [rowId, setRowId] = React.useState(null);
    return { rowId, setRowId }
}

export const handleImageChange = (e, setFile, setImagePreviewUrl) => {
    setFile(e.target.files?.[0] || null);
    // const image = e.target.files[0];
    // setImage(image);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreviewUrl(reader.result);
    reader.readAsDataURL(e.target.files[0]);
};

export const handelDeleteTask = (id, setTableDate) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
        ApiServices.deleteTask(id).then((res) => {
            if (res.data.data === true) {
                ApiServices.getAllTasks().then((res) => {
                    setTableDate(res.data.tasks)
                })
            }
        })
    }
}



export const handleUserDataChange = (event, userData, setUserData) => {
    if (userData) {
        setUserData({
            ...userData,
            [event.target.name]:
                event.target.type === 'number'
                    ? parseInt(event.target.value)
                    : event.target.value,
        });
    }
};

export const handleUserDateChange = (date, userData, setUserData) => {
    if (userData) {
        setUserData({
            ...userData,
            dateTime: date
        });
    }
};

export const handleAddTasks = async (event, file, userData, setModelShow, setTableData, setImagePreviewUrl, setUserData) => {
    event.preventDefault();
    if (!file || !userData) {
        window.alert('Image and content is required')
        return
    }
    try {
        const uuidValue = uuid.v4();
        let filename = 'task_' + uuidValue + '.jpeg';
        const data = JSON.stringify(userData)
        const formData = new FormData();
        formData.append('image', file, filename);
        formData.append('data', data);
        await ApiServices.createTask(formData).then(async (response) => {
            console.log(response);
            setModelShow(false);
            ApiServices.getAllTasks().then(async (res) => {
                setTableData(res.data.tasks);
                setImagePreviewUrl('');
                setUserData({
                    heading: '',
                    description: '',
                    dateTime: '',
                    priorityId: '',
                });
                setModelShow(false);
            });
        }).catch(() => {
            window.alert('user data upload error')
        });
    } catch (error) {
        window.alert(error)
    }
};

export const handleUpdateTask = async (event, image, id, userData, setModelShow, setTableData, setImagePreviewUrl, setUserData) => {
    event.preventDefault();
    if (id == null) {
        return;
    }
    try {
        if (window.confirm('Are you sure you want to Update this task?')) {
            const formData = new FormData();
            const data = JSON.stringify(userData);

            if (image && userData.image) {
                const parts = userData.image.split('/');
                const filename = parts[parts.length - 1];

                formData.append('image', image, filename);
            }

            formData.append('data', data);

            try {
                await ApiServices.updateTask(id, formData).then(async (response) => {
                    if (response.data === false) {
                        window.alert('user data upload error');
                    } else {
                        await ApiServices.getAllTasks().then((res)=>{
                            setTableData(res.data.tasks);
                            setImagePreviewUrl('');
                            setUserData({
                                heading: '',
                                description: '',
                                dateTime: '',
                                priorityId: '',
                            });
                            setModelShow(false);
                        })
                    }
                })
            } catch (error) {
                window.alert('user data upload error');
            }
        }
    } catch (error) {
        window.alert(error)
    }
};


export const handleRowEdit = async (data, setModelShow, setUserData, setOldImagePreviewUrl, setModelHead, setRowId) => {
    setRowId(data.id)
    setModelHead('Update Task')

    const formattedDate = new Date(data.dateTime)

    setUserData({
        heading: data.heading,
        description: data.description,
        dateTime: formattedDate,
        priorityId: data.priorityId,
        image: data.image
    })
    setModelShow(true);
    setOldImagePreviewUrl(data.image)
}

