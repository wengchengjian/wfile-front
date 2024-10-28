import { RawAxiosRequestConfig } from 'axios';
import { defineStore } from 'pinia';
import { Ref } from 'vue';
import { DefaultApi } from '~/api'

const api = new DefaultApi();

const useFileStore = defineStore('fileStore', () =>{

  const pageNo = ref(1);
  const pageSize = ref(10);
  const searchMd5 = ref("");
  const searchFileName = ref("");
  const tableData = ref([]);
  const dirId = ref();
  const searchFileTypes = ref([]);
  const searching = ref(false);
  const total = ref(0);
  const fileUploadDialogVisible: Ref<boolean> = ref(false);

  const download = async (ids: number[])=> {

    for(const id of ids) {
      api.getPreDownloadUrl(id).then((uid)=>{
        const url = `http://localhost:9878/api/cloud/file/download/${uid}`;
        window.open(url);
      })
    }

  }

  const deleteBatchByIds = async (ids: number[]) => {
    api._delete({
      fileIds: ids
    }).then((res)=>{
      ElMessage({type:"success", message: "删除成功"});
      getTableData();
    })
  }

  const getTableData = () => {
    fileUploadDialogVisible.value = false
    searching.value = true;
    const args = {
      pageNo: pageNo.value,
      pageSize: pageSize.value,
      fileName: searchFileName.value,
      md5: searchMd5.value,
      fileTypes: searchFileTypes.value,
    };
    if (dirId.value) {
      args.dirId = dirId.value;
    }

    api.page(args).then((res) => {
      searching.value = false;
      tableData.value = res.records;
      total.value = res.total;
      pageNo.value = res.current;
      pageSize.value = res.size;
    });

    return {
      searching,
      total,
      tableData
    };
  }

  return {
    fileUploadDialogVisible,
    dirId,
    api,
    tableData,
    searching,
    searchMd5,
    searchFileName,
    searchFileTypes,
    pageNo,pageSize,total,
    deleteBatchByIds,
    download,
    getTableData
  }
});


export default useFileStore;
