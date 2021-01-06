export default class LastMayday {
  constructor(data){
      this.data=data
  }
  palette() {
    return ({
      "width": "750px",
      "height": "1326px",
      "background": "#f8f8f8",
      "views": [{
          "type": "image",
          "url": `${this.data.bg}`,
          "css": {
            "width": "750px",
            "height": "1326px",
            "top": "0px",
            "left": "0px",
            "rotate": "0",
            "borderRadius": "",
            "borderWidth": "",
            "borderColor": "#000000",
            "shadow": "",
            "mode": "scaleToFill"
          }
        },
        {
          "type": "image",
          "url": `${this.data.pic}`,
          "css": {
            "width": "185px",
            "height": "185px",
            "top": "338px",
            "left": "283px",
            "rotate": "0",
            "borderRadius": "92.5px",
            "borderWidth": "",
            "borderColor": "#000000",
            "shadow": "",
            "mode": "scaleToFill"
          }
        },
        {
          "type": "text",
          "text": `${this.data.date}`,
          "css": {
            "color": "#000000",
            "background": "rgba(0,0,0,0)",
            "width": "500px",
            "height": "34.32px",
            "top": "977px",
            "left": "125px",
            "rotate": "0",
            "borderRadius": "",
            "borderWidth": "",
            "borderColor": "#000000",
            "shadow": "",
            "padding": "0px",
            "fontSize": "24px",
            "fontWeight": "normal",
            "maxLines": "1",
            "lineHeight": "34.632000000000005px",
            "textStyle": "fill",
            "textDecoration": "none",
            "fontFamily": "",
            "textAlign": "left"
          }
        },
        {
          "type": "text",
          "text": `${this.data.number}`,
          "css": {
            "color": "#000000",
            "background": "rgba(0,0,0,0)",
            "width": "500px",
            "height": "34.32px",
            "top": "1004px",
            "left": "125px",
            "rotate": "0",
            "borderRadius": "",
            "borderWidth": "",
            "borderColor": "#000000",
            "shadow": "",
            "padding": "0px",
            "fontSize": "24px",
            "fontWeight": "normal",
            "maxLines": "1",
            "lineHeight": "34.632000000000005px",
            "textStyle": "fill",
            "textDecoration": "none",
            "fontFamily": "",
            "textAlign": "left"
          }
        },
        {
          "type": "text",
          "text": "哈哈哈",
          "css": {
            "color": "#000000",
            "background": "rgba(0,0,0,0)",
            "width": "351px",
            "height": "45.76px",
            "top": "563px",
            "left": "200px",
            "rotate": "0",
            "borderRadius": "",
            "borderWidth": "",
            "borderColor": "#000000",
            "shadow": "",
            "padding": "0px",
            "fontSize": "32px",
            "fontWeight": "bold",
            "maxLines": "1",
            "lineHeight": "46.17600000000001px",
            "textStyle": "fill",
            "textDecoration": "none",
            "fontFamily": "",
            "textAlign": "center"
          }
        }
      ]
    });
  }
}