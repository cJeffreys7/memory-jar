import memoryJarTypes from "./memoryJarTypes";

export const setCurrentMemoryJar = memoryJar => ({
    type: memoryJarTypes.SET_CURRENT_MEMORY_JAR,
    payload: memoryJar
})

export const clearCurrentMemoryJar = () => ({
    type: memoryJarTypes.CLEAR_CURRENT_MEMORY_JAR,
})