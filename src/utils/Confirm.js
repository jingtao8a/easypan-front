import { ElMessageBox } from "element-plus"

const Confirm = (message, okfun) => {
    ElMessageBox.confirm(message, '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
    }).then(()=>{
        okfun()
    }).catch((error)=>{console.log(error)})
}

export default Confirm