import { defineStore } from "pinia";

const useProgressStore = defineStore('progress', ()=> {

  const createSSE = () => {
    const eventSource = new EventSource('http://localhost:9878/sse')

    eventSource.onmessage = (e)=> {
      const data = JSON.parse(e.data)
      const per = parseInt(parseFloat(data.progress) * 100);
      progressMap.set(data.fileName, per > 100 ? 100 : per)
    }
    return eventSource;
  }

  const progressMap = reactive<Map<string, number>>(new Map());

  const getProgress = (fileName: string) => {
    let per = progressMap.get(fileName);
    return per ?? 0;
  }

  return {
    createSSE,
    getProgress,
    progressMap
  }
})

export default useProgressStore;
