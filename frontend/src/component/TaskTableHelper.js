import React from 'react'
import { ApiServices } from '../service/api';

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
    ApiServices.deleteTask(id).then((res) => {
        if (res.data.data === true) {
            ApiServices.getAllTasks().then((res) => {
                setTableDate(res.data.tasks)
            })
        }
    })
}

export const handleUserDataChange = (event, userData, setUserData) => {
    console.log(userData);
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
    console.log(date);
    if (userData) {
        setUserData({
            ...userData,
            dateTime: date
        });
    }
};

export const handleAddTasks = async (event, file, userData, setModelShow, setTableData, setImagePreviewUrl, setUserData) => {
    event.preventDefault();
    if (!file || !userData) return;
    let insertedId = '';
    try {
        console.log(userData);
        await ApiServices.createTask(userData).then(async (response) => {
            insertedId = response.data.insertedId;
            const formData = new FormData();
            let filename = 'task_' + insertedId + '.jpeg';
            formData.append('image', file, filename);
            await ApiServices.addTaskImage(formData).then((response) => {
                setModelShow(false);
                ApiServices.getAllTasks().then(async (res) => {
                    setTableData(res.data.tasks);
                    console.log('tets');
                    console.log(res);
                    console.log('tets');
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
                console.log('image upload error');
            });
        }).catch(() => {
            console.log('user data upload error');
        });
    } catch (error) {
        console.error(error);
    }
};

export const handleUpdateTask = async (event, image, id, userData, setModelShow, setTableData, setImagePreviewUrl, setUserData) => {
    event.preventDefault();
    try {
        if (id == null) {
            return;
        }
        await ApiServices.updateTask(id, userData).then(async (response) => {
            if (image) {
                const formData = new FormData();
                let filename = 'doctor' + id + '.jpeg';
                formData.append('image', image, filename);
                await ApiServices.addTaskImage(formData).then((response) => {
                    console.log('image upload success');
                }).catch(() => {
                    console.error('image upload error');
                });
            }
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
            console.log('user data upload error');
        });
    } catch (error) {
        console.error(error);
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
