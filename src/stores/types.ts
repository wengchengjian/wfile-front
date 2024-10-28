const fileTypesArray = [
  ['dir', '目录'],
  ['file', '文件'],
  ["doc", "Word 文档"],
  ["docx", "Word 文档（新版）"],
  ["pdf", "可移植文档格式文件"],
  ["txt", "纯文本文件"],
  ["jpg", "JPEG 图像文件"],
  ["jpeg", "JPEG 图像文件"],
  ["png", "便携式网络图形文件"],
  ["gif", "图像互换格式文件"],
  ["mp4", "视频文件"],
  ["avi", "音频视频交错格式文件"],
  ["wmv", "Windows Media Video 文件"],
  ["mp3", "音频文件"],
  ["wav", "音频文件"],
  ["xls", "Excel 97-2003 工作簿文件"],
  ["xlsx", "Excel 工作簿文件（新版）"],
  ["ppt", "PowerPoint 97-2003 演示文稿文件"],
  ["pptx", "PowerPoint 演示文稿文件（新版）"],
  ["zip", "压缩文件"],
  ["rar", "压缩文件"],
  ["7z", "压缩文件"],
  ["psd", "Photoshop 图像文件"],
  ["ai", "Adobe Illustrator 文件"],
  ["html", "超文本标记语言文件"],
  ["css", "层叠样式表文件"],
  ["js", "JavaScript 文件"],
  ["java", "Java 语言源文件"],
  ["cpp", "C++语言源文件"],
  ["py", "Python 语言源文件"],
  ["sql", "结构化查询语言文件"],
  ["xml", "可扩展标记语言文件"],
  ["json", "JSON 数据格式文件"],
  ["bmp", "位图文件"],
  ["tiff", "标记图像文件格式"],
  ["svg", "可缩放矢量图形文件"],
  ["mov", "QuickTime 影片格式文件"],
  ["flv", "Flash 视频文件"],
  ["mkv", "多媒体封装格式文件"],
  ["ogg", "音频压缩格式文件"],
  ["aac", "高级音频编码文件"],
  ["wma", "Windows Media Audio 文件"],
  ["xps", "XML 纸张规范文件"],
  ["odt", "OpenDocument 文本文件"],
  ["ods", "OpenDocument 电子表格文件"],
  ["odp", "OpenDocument 演示文稿文件"],
  ["epub", "电子出版物格式文件"],
  ["mobi", "电子书格式文件"],
  ["azw", "亚马逊电子书格式文件"],
  ["dwg", "AutoCAD 图形文件"],
  ["dxf", "图形交换格式文件"],
  ["c", "C 语言源文件"],
  ["c#", "C#语言源文件"],
  ["vb", "Visual Basic 语言源文件"],
  ["go", "Go 语言源文件"],
  ["rust", "Rust 语言源文件"],
  ["swf", "Shockwave Flash 文件"],
  ["indd", "Adobe InDesign 文件"],
  ["rtf", "富文本格式文件"],
  ["log", "日志文件"],
  ["bat", "批处理文件"],
  ["sh", "Shell 脚本文件"],
  ["exe", "可执行文件"],
  ["msi", "Windows Installer 安装包文件"],
  ["iso", "光盘映像文件"],
  ["db", "数据库文件"],
  ["accdb", "Access 2007 及以上版本数据库文件"],
  ["mdb", "Access 早期版本数据库文件"]
];

export const fileTypeMap :Map<String,String> = new Map(fileTypesArray);
