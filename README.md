# pureDialog

pureDialog is written in pure HTML/CSS/JS. This module allows you to customize a dialog with features such as dragging, resizing, minimizing/maximizing window, full screen, etc. 

 [`See demo here `](https://straight-coding.github.io/pureDialog)

```
          var dlgDemo = new pureDialog({
              theme: theme,
              width: 600,
              height: 400,
              dragging: true,
              resizing: {
                handleSize: 4,
                minWidth: 320,
                maxWidth: 1024,
                minHeight: 200,
                maxHeight: 800
              },
              title: {
                left: [
                  {
                    type: 'close',
                    toolTip: 'Close'
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
                    cssClass: 'dlgMenu',
                    toolTip: 'Menu',
                    onClicked: function() {}
                  }
                ],
                middleAlign: 'center',
                middle: [
                  {
                    type: 'caption',
                    cssClass: '',
                    content: document.getElementById('title').value
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
                iframe: true,
                url: 'examples/login.html'
              },
              footer: {
                left: [
                  {
                    type: 'button',
                    cssClass: '',
                    content: 'Prev',
                    toolTip: 'Prev',
                    onClicked: function() {}
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
                    content: document.getElementById('footer_text').value
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
                      onClicked: function() {
                        dlgDemo.close();
                        confirm.close();
                      }
                    },
                    {
                      type: 'button',
                      cssClass: '',
                      content: 'No/否',
                      toolTip: 'No/否',
                      onClicked: function() {
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
