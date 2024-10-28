import { acceptHMRUpdate, defineStore } from 'pinia'
import { DefaultApi, SysUser } from '~/api'

const api = new DefaultApi();
export const useUserStore = defineStore('user', () => {
  /**
   * Current name of the user.
   */
  const userInfo = ref<SysUser>();

  const localUserInfo = localStorage.getItem("WFILE_USER_INFO");
  const token = localStorage.getItem("WFILE_ACCESS_TOKEN");
  const isLogin = computed(()=> userInfo.value!=undefined && userInfo.value!=null);



  const refresh = (userInfoObj: any)=> {
    console.log(userInfoObj)
    if(!userInfoObj) {
      return;
    }
    if(userInfoObj.sysUser) {
      userInfo.value = userInfoObj.sysUser;
      localStorage.setItem("WFILE_USER_INFO", JSON.stringify(userInfo.value));
    }
    if(userInfoObj.token) {
      localStorage.setItem("WFILE_ACCESS_TOKEN", userInfoObj.token);
    }
  }

  const logout = async ()=>{
    await api.logout();
    clear();
  }

  const clear = ()=> {
    userInfo.value = undefined;
    localStorage.removeItem("WFILE_USER_INFO");
    localStorage.removeItem("WFILE_ACCESS_TOKEN");
  }

  if(!userInfo.value && localUserInfo) {
    const userInfoObj = JSON.parse(localUserInfo);
    userInfo.value = userInfoObj;
  }

  return {
    clear,
    userInfo,
    logout,
    refresh,
    isLogin,
    token
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot))
