import axios from "axios"

const baseUrl = 'https://memoryjar-springboot.herokuapp.com'

const getJar = async (jarId) => {
    try {
        const result = await axios.get(`${baseUrl}/jars/${jarId}`);
        return result;
    } catch (err) {
        console.log('Failed to get Memory Jar: ', err);
        return null;
    }
}

const getJarsByViewer = async (userId) => {
    try {
        const result = axios.get(
            `${baseUrl}/jars/index/${userId}`,
            {
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
            }
        );
        return result;
    } catch (err) {
        console.log('Failed to get Jars by Owner: ', err);
    }
}

const getMemory = async (jarId, filename, alt) => {
    return <img src={`${baseUrl}/jars/${jarId}/memories/${filename}`} alt={alt} />
}

const saveJar = async (memoryJarData) => {
    try {
        axios.post(`${baseUrl}/jars/new`, memoryJarData);
        return true;
    } catch (err) {
        console.log('Failed to create Memory Jar: ', err);
        return false;
    }
}

const saveMemory = async (jarId, memoryData, file) => {
    let filename = '';
    const fileData = new FormData();
    fileData.append("file", file);
    await axios.post(
        `${baseUrl}/jars/${jarId}/memories/new`,
        fileData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    ).then((result) => {
        filename = result.data;
    })
    .catch((err) => {
        console.log(err);
    });
    if (!filename || filename.includes("ERROR")) {
        console.log('Unable to upload file, aborting updating Jar with new memory ', filename);
        return false;
    };
    memoryData = {
        ...memoryData,
        type: file.type,
        filename: filename
    };
    const currentJar = await getJar(jarId);
    const memories = currentJar.data.memories ? currentJar.data.memories : [];
    memories.push(memoryData);
    currentJar.data.memories = memories;
    const result = await updateJar(jarId, currentJar.data);
    return result;
}

const favoriteMemory = async (memoryJar, filename, isFavorited) => {
    memoryJar.memories.map(memory => {
        if (memory.filename === filename) {
            memory.isFavorited = isFavorited;
        };
        return memory;
    });
    const result = await updateJar(memoryJar.jarId, memoryJar);
    return result;
};

const updateJar = async (jarId, memoryJarData) => {
    try {
        const result = await axios.put(
            `${baseUrl}/jars/${jarId}`,
            memoryJarData
        );
        return result;
    } catch (err) {
        console.log('Failed to update Memory Jar: ', err);
        return null;
    }
}

const updateMemory = async (jarId, memoryData) => {
    const currentJar = await getJar(jarId);
    let memories = [...currentJar.data.memories];
    const memoryIndex = memories.findIndex(
        memory => memory.filename === memoryData.filename
    );
    let updatedMemory = {...memories[memoryIndex]};
    updatedMemory = memoryData;
    memories[memoryIndex] = updatedMemory;
    currentJar.data.memories = memories;
    const result = await updateJar(jarId, currentJar.data);
    return result;
}

const deleteJar = async (jarId) => {
    try {
        const result = await axios.delete(
            `${baseUrl}/jars/${jarId}`
        );
        console.log(result.data);
        return result;
    } catch (err) {
        console.log('Failed to update Memory Jar: ', err);
        return null;
    };
}

const deleteMemory = async (jarId, memoryFile) => {
    try {
        const result = await axios.delete(
            `${baseUrl}/jars/${jarId}/memories/${memoryFile}`
        );
        console.log(result.data);
        return result;
    } catch (err) {
        console.log('Failed to update Memory Jar: ', err);
        return null;
    };
};

const mapMemories = (jarId, memories) => {
    const mappedMemories = memories.map(memory => 
        ({
            image: {
                src: `${baseUrl}/jars/${jarId}/memories/${memory.filename}`,
                alt: memory.title,
                key: memory.filename
            },
            isFavorited: memory.isFavorited,
            timestamp: memory.timestamp
        })
    );
    return mappedMemories;
};

export {
    getJar,
    getJarsByViewer,
    getMemory,
    saveJar,
    saveMemory,
    favoriteMemory,
    updateJar,
    updateMemory,
    deleteJar,
    deleteMemory,
    mapMemories
};