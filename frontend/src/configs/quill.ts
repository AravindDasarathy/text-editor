const toolbarModules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }, {size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'},
     {'indent': '-1'}, {'indent': '+1'}],
    ['clean']
  ]
};


const toolbarFormats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent'
];

export { toolbarModules, toolbarFormats };