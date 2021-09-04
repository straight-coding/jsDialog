# pureDialog

pureDialog is written in pure HTML/CSS/JS. This module allows you to customize a widget with features such as dragging, resizing, minimizing/maximizing window, full screen, etc. 

 [`See demo here `](https://straight-coding.github.io/pureDialog)

```
          var dlgDemo = new pureDialog({
              theme: 'win10',    //'win10', 'ios', 'jquery', 'ubuntu'
              width: 600,        //in pixels
              height: 400,       //in pixels
              dragging: true,    //the title is draggable
              resizing: {        //the border is draggable
                handleSize: 4,   //detection width of the draggable area
                minWidth: 320,   //minimum width of the widget
                maxWidth: 1024,  //maximum width of the widget
                minHeight: 200,  //minimum height of the widget
                maxHeight: 800   //maximum height of the widget
              },
              title: {
                left: [
                  {
                    type: 'close',      //'close', 'minimize', 'maximize', 'fullscreen', 'button', 'caption', 'icon' or 'html'
                    toolTip: 'Close'    //multilingual wording
                  },
                  {
                    type: 'minimize',
                    toolTip: 'Minimize'
                  },
                  {
                    type: 'maximize',
                    toolTip: 'Maximize'
                  },
                  {
                    type: 'fullscreen',
                    toolTip: 'Fullscreen'
                  },
                  {
                    type: 'icon',
                    cssClass: 'dlgMenu',      //customized css class
                    toolTip: 'Menu',
                    onClicked: function() {}  //additional operation when clicked
                  }
                ],
                middleAlign: 'center',        //'center' or 'left', alignment of the text content in 'middle' block
                middle: [
                  {
                    type: 'caption',
                    cssClass: '',
                    content: 'Text on Title'  //html content to show
                  }
                ],
                right: [
                  {
                    type: 'minimize',
                    toolTip: 'Minimize'
                  },
                  {
                    type: 'maximize',
                    toolTip: 'Maximize'
                  },
                  {
                    type: 'fullscreen',
                    toolTip: 'Fullscreen'
                  },
                  {
                    type: 'close',
                    toolTip: 'Close'
                  }
                ]
              },
              content: {
                iframe: true,                  //content will be wrapped by an iframe element
                url: 'examples/login.html'     //url of the content
              },
              footer: {
                left: [
                  {
                    type: 'button',
                    cssClass: '',             //customized css class
                    content: 'Prev',          //multilingual wording
                    toolTip: 'Prev',          //multilingual wording
                    onClicked: function() {}  //additional operation when clicked
                  },
                  {
                    type: 'button',
                    cssClass: '',
                    content: 'Next',
                    toolTip: 'Next',
                    onClicked: function() {}
                  }
                ],
                middleAlign: 'center',
                middle: [
                  {
                    type: 'html',
                    content: 'Text on Footer'
                  }
                ],
                right: [
                  {
                    type: 'button',
                    cssClass: '',
                    content: 'OK',
                    toolTip: 'OK',
                    onClicked: function() {}
                  },
                  {
                    type: 'button',
                    cssClass: '',
                    content: 'Cancel',
                    toolTip: 'Cancel',
                    onClicked: function() {}
                  }
                ]
              },
              onClosing: function() {
                var confirm = new pureDialog('Warning','<span>Quit?</span>', {
                  right: [
                    {
                      type: 'button',
                      cssClass: '',
                      content: 'Yes/是',
                      toolTip: 'Yes/是',
                      onClicked: function() 
                      {
                        dlgDemo.close();  //close the parent widget
                        confirm.close();  //close the current widget
                      }
                    },
                    {
                      type: 'button',
                      cssClass: '',
                      content: 'No/否',
                      toolTip: 'No/否',
                      onClicked: function() 
                      {
                        confirm.close();
                      }
                    }
                  ]
                });
                return false;
              },
              onClosed: function(context, result) {}
          });
```
