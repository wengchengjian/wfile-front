import { UseWebSocketReturn } from "@vueuse/core"
import { defineStore } from "pinia"
import useFileStore from "./file"

const useSocketStore = defineStore('websocket', ()=> {
  const pingMsg = {
    type: "ping",
    content: 'ping'
  }

  const pongMsg = {
    type: "pong",
    content: 'pong'
  }

  const fileUploadMsg = {
    type: "fileUpload",
    content: 'fileUpload'
  }
  const websocket = ref<UseWebSocketReturn<any> | undefined>(undefined);
  const user = useUserStore();
  const fileStore = useFileStore();

  const sendFileUploadMsg = () => {
    websocket.value?.ws?.send(JSON.stringify(fileUploadMsg));
  }

  onMounted(()=>{
    if(user.isLogin) {
      const socket = useWebSocket(`ws://localhost:9878/ws/${encodeURIComponent(user.token)}`, {
        autoClose: true,
        autoReconnect: true,
        immediate: true,
      })

      const ws = socket.ws;
      ws.value.onclose = ()=> {
        console.log("websocket closed");
      }
      ws.value.onopen= () =>{
        console.log("websocket connected");
      }
      ws.value.onmessage = (e)=>{
        const msg = JSON.parse(e.data);
        if(msg.type === "ping") {
          ws.value?.send(JSON.stringify(pongMsg));
       } else if(msg.type === 'pong') {
         // 心跳回复
       }
       else if(msg.type == "fileUploadProgress") {
        const content = JSON.parse(msg.content);

         const per = parseInt(parseFloat(content.progress) * 100);
         const oldPer = progressMap.get(content.fileName) ?? 0;
         if(per > oldPer) {
          progressMap.set(content.fileName, per > 100? 100 : per)
         }
       } else if(msg.type == 'fileUploadDone') {
          ElMessage.success("文件上传成功");
          // 等待2s后刷新页面
          setTimeout(()=>{

            fileStore.getTableData();
          }, 2000)
       }

      }
      websocket.value = socket;
    }
  })





  const progressMap = reactive<Map<string, number>>(new Map());

  const getProgress = (fileName: string) => {
    let per = progressMap.get(fileName);
    return per ?? 0;
  }

  return {
    sendFileUploadMsg,
    websocket,
    getProgress,
    progressMap
  }
})

export default useSocketStore;
