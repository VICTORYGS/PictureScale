class PictureScale{
    constructor() {
        this.file=null
        this.imgBase64 =null
        this.webpBase64 =null
    }
    init(selector,scale=0.5){
        let {files}=document.querySelector(selector)
        let [file]=files
        this.file=file
        let that=this
        let reader=new FileReader()
        reader.readAsDataURL(file)
        reader.onload=function(e){
            let image=new Image()
            image.src=e.target.result
            image.onload=function() {
                let canvas = document.createElement('canvas');
                let context = canvas.getContext('2d');
                // 定义 canvas 大小，也就是压缩后下载的图片大小
                canvas.width = image.width*scale;
                canvas.height = image.height*scale;
                // document.body.appendChild(canvas)
                // 设置图片宽高与canvas相同
                context.drawImage(image,0,0,image.width,image.height,0,0,canvas.width,canvas.height);
                // 转化为base64
                that.imgBase64 = canvas.toDataURL();
                that.webpBase64 = canvas.toDataURL('image/webp');//默认值：image/png webp压缩后更小
            }
        }
    }
    download(){
        //转化blob才能开始下载
        let {imgBase64,file}=this
        let decodeStr=window.atob(imgBase64.match(/(?<=;base64,).*/)[0])
        let fileType=imgBase64.match(/(?<=data:).*(?=;base64,)/)[0]
        let len=decodeStr.length
        let blobArr=new Uint8Array(len)
        for(let i=0;i<len;i++){
            blobArr[i]=decodeStr.charCodeAt(i)
        }
        let blob=new Blob([blobArr],{type:fileType})// image/png
        let aNode=document.createElement('a')
        aNode.href=URL.createObjectURL(blob)
        aNode.setAttribute('download',file.name)
        aNode.click()
        aNode=null
    }
}