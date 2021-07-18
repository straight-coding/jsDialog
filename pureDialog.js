/*
  pureDialog.js
  Author: Straight Coder<simpleisrobust@gmail.com>
  Date: July 05, 2021
*/

'use strict';

if (window.top === window.self)
{
    var zIndexStart = 10000;
    var zIndexNext = zIndexStart;

    var liveDialogs = {};
    var deadDialogs = {};

    setInterval(function(){
        dialogGC();
    }, 100);

    function dialogGC()
    {
        for(var dlgID in deadDialogs)
        {
            var dlg = top.document.getElementById(dlgID);
            if (dlg && dlg.parentNode)
                dlg.parentNode.removeChild(dlg);
            delete deadDialogs[dlgID];
        }
    }
}

// https://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid/2117523#2117523
function getUuid()
{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getNextZindex()
{
    var curIndex = top.zIndexNext;
    top.zIndexNext += 10;
    return curIndex;
}

function deferRemove(dlgID)
{
    top.deadDialogs[dlgID] = {
        t: new Date()
    }
}

function valid(val)
{
    return (val != undefined) && (val != null);
}

function elementFromHTML(htmlString) 
{
    var template  = document.createElement('template');
    template.innerHTML = htmlString;
    return template.firstElementChild || template.content.firstChild; 
}

function getSvgHtml(opt)
{ //{type:'',box:{top:0,left:0,width:100,height:100},padding:4,stroke:'',fill:'','fill-opacity':0.5,'stroke-opacity':0.8}
    var box = {
        top:0,
        left:0,
        width:20,
        height:20
    };

    var padding = 0;
    var fill = 'none';
    var fillOpacity = null;
    var stroke = '#000';
    var strokeOpacity = null;

    if (opt)
    {
        if (opt.box) 
        {
            if (valid(opt.box.top)) box.top = parseInt(opt.box.top, 10);
            if (valid(opt.box.left)) box.left = parseInt(opt.box.left, 10);
            if (valid(opt.box.width)) box.width = parseInt(opt.box.width, 10);
            if (valid(opt.box.height)) box.height = parseInt(opt.box.height, 10);
        }
        for(var attr in opt)
        {
            if (attr == 'padding')               padding = opt[attr];
            else if (attr == 'fill')             fill = opt[attr];
            else if (attr == 'stroke')           stroke = opt[attr];
            else if (attr == 'fill-opacity')     fillOpacity = opt[attr];
            else if (attr == 'stroke-opacity')   strokeOpacity = opt[attr];
        }
    }

    var htmlSvg = '';
    htmlSvg += '<svg';
    htmlSvg += ' viewBox="'+box.left+' '+box.top+' '+box.width+' '+box.height+'"';
    htmlSvg += ' width="'+box.width+'"';
    htmlSvg += ' height="'+box.height+'"';
    htmlSvg += ' xmlns="http://www.w3.org/2000/svg"';
    htmlSvg += '>';
    htmlSvg +=   '<path';
    htmlSvg += ' d="';
    if (opt.type == 'menu')
    {
        var size = 5;
        htmlSvg += 'M'+(box.left+padding)+','+(box.top+padding+1);              htmlSvg += 'h'+(size);
        htmlSvg += 'M'+(box.left+padding)+','+(box.top+(box.height/2));         htmlSvg += 'h'+(size);
        htmlSvg += 'M'+(box.left+padding)+','+(box.top+box.height-padding-1);   htmlSvg += 'h'+(size);

        htmlSvg += 'M'+(box.left+box.width-padding)+','+(box.top+padding+1);            htmlSvg += 'h-'+(size);
        htmlSvg += 'M'+(box.left+box.width-padding)+','+(box.top+(box.height/2));       htmlSvg += 'h-'+(size);
        htmlSvg += 'M'+(box.left+box.width-padding)+','+(box.top+box.height-padding-1); htmlSvg += 'h-'+(size);
    }
    else if (opt.type == 'minimize')
    {
        htmlSvg += 'M'+(box.left+padding)+','+(box.top+(box.height/2));
        htmlSvg += 'h'+(box.width-2*padding);
    }
    else if (opt.type == 'maximize')
    {
        htmlSvg += 'M'+(box.left+padding)+','+(box.top+padding);
        htmlSvg += 'h'+(box.width-2*padding);
        htmlSvg += 'v'+(box.height-2*padding);
        htmlSvg += 'h-'+(box.width-2*padding);
        htmlSvg += 'z';
    }
    else if (opt.type == 'fullscreen')
    {
        var size = 4;
        htmlSvg += 'M'+(box.left+padding)+','+(box.top+padding+size);
        htmlSvg += 'v-'+(size);
        htmlSvg += 'h'+(size);
        htmlSvg += 'M'+(box.left+box.width-padding-size)+','+(box.top+padding);
        htmlSvg += 'h'+(size);
        htmlSvg += 'v'+(size);
        htmlSvg += 'M'+(box.left+box.width-padding)+','+(box.top+box.height-padding-size);
        htmlSvg += 'v'+(size);
        htmlSvg += 'h-'+(size);
        htmlSvg += 'M'+(box.left+padding+size)+','+(box.top+box.height-padding);
        htmlSvg += 'h-'+(size);
        htmlSvg += 'v-'+(size);
    }
    else if (opt.type == 'restore')
    {
        var cascade = 3;
        htmlSvg += 'M'+(box.left+padding)+','+(box.top+padding+cascade);
        htmlSvg += 'h'+(box.width-2*padding-cascade);
        htmlSvg += 'v'+(box.height-2*padding-cascade);
        htmlSvg += 'h-'+(box.width-2*padding-cascade);
        htmlSvg += 'z';
        htmlSvg += 'M'+(box.left+padding+cascade+1)+','+(box.top+padding+cascade);
        htmlSvg += 'v-'+(cascade);
        htmlSvg += 'h'+(box.width-2*padding-cascade-1);
        htmlSvg += 'v'+(box.height-2*padding-cascade-1);
        htmlSvg += 'h-'+(cascade);
    }
    else if (opt.type == 'close')
    {
        htmlSvg += 'M'+(box.left+padding)+','+(box.top+padding);
        htmlSvg += 'L'+(box.left+box.width-padding)+','+(box.top+box.height-padding);
        htmlSvg += 'M'+(box.left+box.width-padding)+','+(box.top+padding);
        htmlSvg += 'L'+(box.left+padding)+','+(box.top+box.height-padding);
    }
    else
    {
    }
    htmlSvg += '"';

    if (stroke) 
        htmlSvg += ' stroke="'+stroke+'"'; //#ED1C24
    if (strokeOpacity) 
        htmlSvg += ' stroke-opacity="'+strokeOpacity+'"'; //#ED1C24
    if (fill) 
        htmlSvg += ' fill="'+fill+'"'; //#ED1C24
    if (fillOpacity) 
        htmlSvg += ' fill-opacity="'+fillOpacity+'"'; //#ED1C24

    htmlSvg +=   '/>';
    htmlSvg += '</svg>';

    return htmlSvg;
}

function measureText(text, cssClass)
{
    var div = top.document.createElement('div');
    if (cssClass)
        div.className = cssClass;
    top.document.body.appendChild(div);

    div.style.position = "absolute";
    div.style.left = -1000;
    div.style.top = -1000;
    div.innerHTML = text;

    var size = {
        width: div.clientWidth,
        height: div.clientHeight
    };

    top.document.body.removeChild(div);
    div = null;

    return size;
}

function pureDialog()
{
    var opt = undefined;
    var caption = undefined;
    var message = undefined;
    var optButtons = undefined;

    var argLen = arguments.length;
    if (argLen == 0)
        return null;

    if (typeof arguments[0] == 'object')
        opt = arguments[0];
    else
    {
        if (typeof arguments[0] == 'string')
            caption = arguments[0];

        if ((argLen > 1) && (typeof arguments[1] == 'string'))
            message = arguments[1];

        if ((argLen > 2) && (typeof arguments[2] == 'object'))
            optButtons = arguments[2];
    }

    var _default = {
        id: getUuid(),
        zIndex: getNextZindex(),
        theme: 'win10',
        dragging: true,
        resizing: false,
        width: 600,
        height: 400
    };

    var _settings = deepMerge(_default, opt);

    if (caption)
    {
        _settings.title = {
            middle: [
                {
                    type: 'html',
                    content: caption,
                    toolTip: '',
                }
            ],
            right: [
                {
                    type: 'close',
                    toolTip: 'Close'
                },
            ]
        };
    }

    if (message)
    {
        var captionSize = measureText(caption, _settings.theme + '-dlgTitle');
        var footerSize = measureText('Footer', _settings.theme + '-dlgFooter');

        var msgSize = measureText(message);
        _settings.height = Math.max(msgSize.height + captionSize.height + footerSize.height, 160);

        captionSize = measureText(caption);
        _settings.width = Math.max(Math.max(msgSize.width, captionSize.width), 320);

        _settings.content = {
            cssClass: 'dlgMessage',
            html: message
          };
    }

    if (optButtons)
    {
        _settings.footer = optButtons;
    }
    else if (!opt)
    {
        _settings.footer =  {
            middleAlign: 'center',
            middle: [
                {
                    type: 'button',
                    cssClass: '',
                    content: 'OK',
                    toolTip: 'OK',
                    onClicked: function() {}
                }
            ]
        }
    }

    validateSettings();

    var _dragging = null; //title, n, s, w, e, nw, ne, sw, se
    var _dlgStatus = 'normal';
    var _lastMovePos = {};
    var _lastSavePos = {};
    var _clickableParts = [];
    var _onClickButtons = [];

    var elemTopBody = top.document.body;
    var elemOverlay = top.document.createElement("div");
        elemOverlay.id = _settings.id;
        elemOverlay.className = _settings.theme + 'dlgOverlay';
        elemOverlay.style.display = 'flex';
        elemOverlay.style.zIndex = _settings.zIndex;

    if (elemTopBody.hasChildNodes())
        elemTopBody.insertBefore(elemOverlay, elemTopBody.childNodes[0]);
    else
        elemTopBody.appendChild(elemOverlay);

    var handleSize = 0;
    if (_settings.resizing && _settings.resizing.handleSize)
        handleSize = _settings.resizing.handleSize;

    var rectOverlay = elemOverlay.getBoundingClientRect();
    var dlgTop  = (parseInt(rectOverlay.height,10) - _settings.height - 2*handleSize)/2;
    var dlgLeft = (parseInt(rectOverlay.width,10) - _settings.width - 2*handleSize)/2;

    var elemFrame = top.document.createElement("div");
        elemFrame.className = _settings.theme + 'dlgFrame';
        elemFrame.style.width  = (_settings.width + 2 * handleSize) + 'px';
        elemFrame.style.height = (_settings.height + 2 * handleSize) + 'px';
        elemFrame.style.left = (dlgLeft>0 ? dlgLeft : 0) + 'px';
        elemFrame.style.top = (dlgTop>0 ? dlgTop: 0) + 'px';
        elemFrame.style.zIndex = _settings.zIndex + 1;
        elemOverlay.appendChild(elemFrame);

    var elemTitle = undefined;
    var elemTitleParts = {};
    if (_settings.title)
    {
        elemTitle = top.document.createElement("div");
        elemTitle.className = _settings.theme + 'dlgTitle';
        elemTitle.style.zIndex = _settings.zIndex + 2;
        elemFrame.appendChild(elemTitle);

        createBar(_settings.title, elemTitle, elemTitleParts);
    }

    var elemContent = undefined;
        elemContent = top.document.createElement("div");
        elemContent.className = _settings.theme + 'dlgContent';
        elemContent.style.zIndex = _settings.zIndex + 2;
        elemFrame.appendChild(elemContent);
    if (_settings.content)
    {
        if (_settings.content.iframe && _settings.content.url)
        {
            var iframe = document.createElement('iframe');
            iframe.src = _settings.content.url;
            iframe.style.border = '0';
            elemContent.appendChild(iframe);
        }
        else if (_settings.content.html)
        {
            var elemMessage = top.document.createElement("div");
            if (_settings.content.cssClass)
                elemMessage.className = _settings.theme + _settings.content.cssClass;
            elemMessage.innerHTML = _settings.content.html;
            elemContent.appendChild(elemMessage);
        }
    }

    var elemFooter = undefined;
    var elemFooterParts = {};
    if (_settings.footer)
    {
        elemFooter = top.document.createElement("div");
        elemFooter.className = _settings.theme + 'dlgFooter';
        elemFooter.style.zIndex = _settings.zIndex + 2;
        elemFrame.appendChild(elemFooter);

        createBar(_settings.footer, elemFooter, elemFooterParts);
    }

    function createBar(barConfig, elemBar, barParts)
    {
        if (barConfig.left)
        {        
            barParts['left'] = top.document.createElement("div");
            barParts['left'].className = 'Left';
            barParts['left'].style.zIndex = _settings.zIndex + 4;
            elemBar.appendChild(barParts['left']);

            createBarParts(barParts, 'left', barConfig.left);
        }

        if (barConfig.middle)
        {        
            var leftWidth = 10;
            if (barParts['left'])
            {
                var rectTitleLeft = barParts['left'].getBoundingClientRect();
                leftWidth = rectTitleLeft.width;
            }
            barParts['middle'] = top.document.createElement("div");
            barParts['middle'].className = 'Middle';
            barParts['middle'].style.zIndex = _settings.zIndex + 3;
            if (barConfig.middleAlign == 'center')
                barParts['middle'].style['justify-content'] = 'center';
            else //if (barConfig.middleAlign == 'left')
                barParts['middle'].style.marginLeft = parseInt(leftWidth,10) + 'px';

            elemBar.appendChild(barParts['middle']);

            createBarParts(barParts, 'middle', barConfig.middle);
        }

        if (barConfig.right)
        {
            barParts['right'] = top.document.createElement("div");
            barParts['right'].className = 'Right';
            barParts['right'].style.zIndex = _settings.zIndex + 4;
            elemBar.appendChild(barParts['right']);

            createBarParts(barParts, 'right', barConfig.right);
        }
    }

    function createBarParts(barParts, posInBar, section)
    {
        //keep resizing elements together and in their original order
        var elemResizing = [];
        for(var i = 0; i < section.length; i ++)
        {
            var type = section[i].type;
            if (!type)
                continue;

            if (type == 'minimize')
            {
                if (!barParts[type])
                {
                    barParts[type] = top.document.createElement("div");
                    if (section[i].toolTip)
                        barParts[type].title = section[i].toolTip;
                    barParts[type].className = _settings.theme + 'dlgIcon dlgMinimize';
                    barParts[type].innerHTML = getSvgHtml({type:type,box:{width:20,height:20},padding:4});
                    elemResizing.push(barParts[type]);
                    _clickableParts.push(barParts[type]);
                }
            }
            else if (type == 'maximize')
            {
                if (!barParts[type])
                {
                    barParts[type] = top.document.createElement("div");
                    if (section[i].toolTip)
                        barParts[type].title = section[i].toolTip;
                    barParts[type].className = _settings.theme + 'dlgIcon dlgMaximize';
                    barParts[type].innerHTML = getSvgHtml({type:type,box:{width:20,height:20},padding:5});
                    elemResizing.push(barParts[type]);
                    _clickableParts.push(barParts[type]);
                }
            }
            else if (type == 'fullscreen')
            {
                if (!barParts[type])
                {
                    barParts[type] = top.document.createElement("div");
                    if (section[i].toolTip)
                        barParts[type].title = section[i].toolTip;
                    barParts[type].className = _settings.theme + 'dlgIcon dlgFullScreen';
                    barParts[type].innerHTML = getSvgHtml({type:type,box:{width:20,height:20},padding:4});
                    elemResizing.push(barParts[type]);
                    _clickableParts.push(barParts[type]);
                }
            }
        }

        for(var i = 0; i < section.length; i ++)
        {
            var type = section[i].type;
            if (!type)
                continue;

            if ((type == 'minimize') || (type == 'maximize') || (type == 'fullscreen'))
            {
                if (elemResizing.length > 0)
                {
                    for(var j = 0; j < elemResizing.length; j ++)
                    {
                        barParts[posInBar].appendChild(elemResizing[j]);
                    }

                    barParts['restore'] = top.document.createElement("div");
                    barParts['restore'].title = 'Restore';
                    barParts['restore'].className = _settings.theme + 'dlgIcon dlgRestore';
                    barParts['restore'].innerHTML = getSvgHtml({type:'restore',box:{width:20,height:20},padding:4});
                    barParts['restore'].style.display = 'none';
                    barParts[posInBar].appendChild(barParts['restore']);
                    _clickableParts.push(barParts['restore']);
                }
                elemResizing = [];
            }            
            else if (type == 'caption')
            {
                barParts[type] = elementFromHTML(section[i].content);
                if (section[i].toolTip)
                    barParts[type].title = section[i].toolTip;
                barParts[type].className = _settings.theme + 'dlgHeadline';
                barParts[posInBar].appendChild(barParts[type]);
                if (typeof (section[i].onClicked) == 'function')
                    _clickableParts.push(barParts[type]);
            }
            else if (type == 'close')
            {
                if (!barParts[type])
                {
                    barParts[type] = top.document.createElement("div");
                    if (section[i].toolTip)
                        barParts[type].title = section[i].toolTip;
                    barParts[type].className = _settings.theme + 'dlgIcon dlgClose';
                    barParts[type].innerHTML = getSvgHtml({type:'close',box:{width:20,height:20},padding:5});
                    barParts[posInBar].appendChild(barParts[type]);
                    _clickableParts.push(barParts[type]);
                }
            }
            else if (type == 'button')
            {
                barParts[type] = top.document.createElement("button");
                if (section[i].toolTip)
                    barParts[type].title = section[i].toolTip;
                barParts[type].className = _settings.theme + 'dlgButton ' + section[i].cssClass;
                if (section[i].content)
                    barParts[type].innerHTML = section[i].content;
                barParts[posInBar].appendChild(barParts[type]);
                _clickableParts.push(barParts[type]);

                if (typeof section[i].onClicked == 'function')
                {
                    _onClickButtons.push({
                        elem: barParts[type],
                        attr: section[i]
                    });
                }
            }
            else if (type == 'html')
            {
                if (section[i].content)
                {
                    barParts[type] = elementFromHTML(section[i].content);
                    if (section[i].toolTip)
                        barParts[type].title = section[i].toolTip;
                    if (section[i].cssClass)
                        barParts[type].className = section[i].cssClass;
                    barParts[posInBar].appendChild(barParts[type]);
                    if (typeof (section[i].onClicked) == 'function')
                        _clickableParts.push(barParts[type]);
                }
            }
        }
    }

    function log()
    {
        if (arguments)
            console.log(arguments);
    }

    function validateSettings()
    {
        if (valid(_settings.width))   _settings.width = parseInt(_settings.width, 10);
        if (valid(_settings.height))  _settings.height = parseInt(_settings.height, 10);

        if (isResizable())
        {
            if (valid(_settings.resizing.minWidth))   _settings.resizing.minWidth  = parseInt(_settings.resizing.minWidth, 10);
            if (valid(_settings.resizing.maxWidth))   _settings.resizing.maxWidth  = parseInt(_settings.resizing.maxWidth, 10);
            if (valid(_settings.resizing.minHeight))  _settings.resizing.minHeight = parseInt(_settings.resizing.minHeight, 10);
            if (valid(_settings.resizing.maxHeight))  _settings.resizing.maxHeight = parseInt(_settings.resizing.maxHeight, 10);

            if (valid(_settings.resizing.minMidth) && (_settings.width < _settings.resizing.minWidth))
                _settings.width = _settings.resizing.minWidth;
            if (valid(_settings.resizing.maxWidth) && (_settings.width > _settings.resizing.maxWidth))
                _settings.width = _settings.resizing.maxWidth;

            if (valid(_settings.resizing.minHeight) && (_settings.height < _settings.resizing.minHeight))
                _settings.height = _settings.resizing.minHeight;
            if (valid(_settings.resizing.maxHeight) && (_settings.height > _settings.resizing.maxHeight))
                _settings.height = _settings.resizing.maxHeight;
        }

        if (!valid(_settings.theme))
            _settings.theme = '';
        if (_settings.theme && (_settings.theme.substr(-1) != '-'))
            _settings.theme += '-';
    }

    function inRect(event, rect, tol)
    {
        var tolerant = 0;
        if (tol)
            tolerant = tol;

        if ((event.clientX > rect.left + tolerant) &&
            (event.clientX < rect.left + rect.width - tolerant) &&
            (event.clientY > rect.top + tolerant) &&
            (event.clientY < rect.top + rect.height - tolerant))
        {
            return true;
        }

        return false;
    }

    function hoverClickable(event)
    {
        for(var i = 0; i < _clickableParts.length; i ++)
        {
            var rect = _clickableParts[i].getBoundingClientRect();
            if (inRect(event, rect, 0))
                return true;
        }
        return false;
    }

    function hoverFrame(event, tol)
    {
        var tolerant = 0;
        if (tol)
            tolerant = tol;

        if (elemTitle)
        {
            var rectTitle = elemTitle.getBoundingClientRect();
            if (inRect(event, rectTitle, tolerant))
                return 'title';
        }

        var rect = elemFrame.getBoundingClientRect();
        if (inRect(event, {left: (rect.left-tolerant), top: (rect.top-tolerant), width: (2*tolerant), height: (2*tolerant)}))
            return 'nw';
        if (inRect(event, {left: (rect.left-tolerant), top: (rect.top+rect.height-tolerant), width: (2*tolerant), height: (2*tolerant)}))
            return 'sw';
        if (inRect(event, {left: (rect.left+rect.width-tolerant), top: (rect.top-tolerant), width: (2*tolerant), height: (2*tolerant)}))
            return 'ne';
        if (inRect(event, {left: (rect.left+rect.width-tolerant), top: (rect.top+rect.height-tolerant), width: (2*tolerant), height: (2*tolerant)}))
            return 'se';
        if (inRect(event, {left: (rect.left+tolerant), top: (rect.top-tolerant), width: (rect.width-2*tolerant), height: (2*tolerant)}))
            return 'n';
        if (inRect(event, {left: (rect.left+tolerant), top: (rect.top+rect.height-tolerant), width: (rect.width-2*tolerant), height: (2*tolerant)}))
            return 's';
        if (inRect(event, {left: (rect.left-tolerant), top: (rect.top+tolerant), width: 2*tolerant, height: (rect.height-2*tolerant)}))
            return 'w';
        if (inRect(event, {left: (rect.left+rect.width-tolerant), top: (rect.top+tolerant), width: 2*tolerant, height: (rect.height-2*tolerant)}))
            return 'e';

        return '';
    }

    function isDraggable()
    {
        return (valid(_settings.dragging) && _settings.dragging);
    }

    function isResizable()
    {
        return (valid(_settings.resizing) && _settings.resizing);
    }

    function changeCursor(pos)
    {
        if ((_dlgStatus == 'maximized') || (_dlgStatus == 'fullscreen'))
        {
            elemOverlay.style.cursor = 'default';
            return;
        }

        if ((_dlgStatus == 'minimized') && (pos != 'title') && (pos != 'w') && (pos != 'e'))
        {
            elemOverlay.style.cursor = 'default';
            return;
        }

        if (pos == 'title')   elemOverlay.style.cursor = (isDraggable() ? 'move' : 'default');
        else if (pos == 'nw') elemOverlay.style.cursor = (isResizable() ? 'nw-resize' : 'default');
        else if (pos == 'n')  elemOverlay.style.cursor = (isResizable() ? 'n-resize' : 'default');
        else if (pos == 'ne') elemOverlay.style.cursor = (isResizable() ? 'ne-resize' : 'default');
        else if (pos == 'w')  elemOverlay.style.cursor = (isResizable() ? 'w-resize' : 'default');
        else if (pos == 'e')  elemOverlay.style.cursor = (isResizable() ? 'e-resize' : 'default');
        else if (pos == 'sw') elemOverlay.style.cursor = (isResizable() ? 'sw-resize' : 'default');
        else if (pos == 's')  elemOverlay.style.cursor = (isResizable() ? 's-resize' : 'default');
        else if (pos == 'se') elemOverlay.style.cursor = (isResizable() ? 'se-resize' : 'default');
        else elemOverlay.style.cursor = 'default';
    }

    function getMinDragWidth()
    {
        var rectTitleLeft = elemTitleParts['left'].getBoundingClientRect();
        var rectTitleText = elemTitleParts['caption'].getBoundingClientRect();
        var rectTitleRight = elemTitleParts['right'].getBoundingClientRect();
        return (parseInt(rectTitleLeft.width,10) + parseInt(rectTitleText.width,10) + parseInt(rectTitleRight.width,10) + 4);
    }

    function validatePosition(lastPos, nextPos)
    {
        var dlgSize = {
            top: nextPos.top,
            left: nextPos.left,
            width: nextPos.width,
            height: nextPos.height
        }

        if (_dragging === 'title')
            return dlgSize;

        if (!isResizable())
            return dlgSize;

        var clamped = false;
        //check minimum width
        if (_dlgStatus == 'minimized')
        {
            var dragWidth = getMinDragWidth();
            if (dlgSize.width < dragWidth)
            {
                dlgSize.width = dragWidth;
                clamped = true;
            }
        }
        else
        {
            if (valid(_settings.resizing.minWidth) && (dlgSize.width < _settings.resizing.minWidth))
            {
                dlgSize.width = _settings.resizing.minWidth;
                clamped = true;
            }
        }

        //check maximum width
        if (valid(_settings.resizing.maxWidth) && (dlgSize.width > _settings.resizing.maxWidth))
        {
            dlgSize.width = _settings.resizing.maxWidth;
            clamped = true;
        }

        //check minimum/maximum height
        if (_dlgStatus != 'minimized')
        {
            if (valid(_settings.resizing.minHeight) && (dlgSize.height < _settings.resizing.minHeight))
            {
                dlgSize.height = _settings.resizing.minHeight;
                clamped = true;
            }
            if (valid(_settings.resizing.maxHeight) && (dlgSize.height > _settings.resizing.maxHeight))
            {
                dlgSize.height = _settings.resizing.maxHeight;
                clamped = true;
            }
        }

        //check top-left corner when width or height is clamped
        if (clamped)
        {
            if ((_dragging === 'w') || (_dragging === 'nw') || (_dragging === 'sw'))
            {
                if (dlgSize.left + dlgSize.width != lastPos.left + lastPos.width)
                    dlgSize.left  = lastPos.left + lastPos.width - dlgSize.width;
            }
            if ((_dragging === 'n') || (_dragging === 'nw') || (_dragging === 'ne'))
            {
                if (dlgSize.top + dlgSize.height != lastPos.top + lastPos.height)
                    dlgSize.top  = lastPos.top + lastPos.height - dlgSize.height;
            }
        }

        if ((dlgSize.top == lastPos.top) && 
            (dlgSize.left == lastPos.left) && 
            (dlgSize.width == lastPos.width) && 
            (dlgSize.height == lastPos.height) && clamped)
        {
            return null;
        }

        return dlgSize;
    }

    function onMouseDown(event)
    {
        event = event || window.event;
        event.preventDefault();

        if (hoverClickable(event))
            return;

        var pos = hoverFrame(event, 4);
        if (pos)
        {
            if ((_dlgStatus == 'maximized') || (_dlgStatus == 'fullscreen'))
                return;
            if ((_dlgStatus == 'minimized') && (pos != 'title') && (pos != 'e') && (pos != 'w'))
                return;
            if (pos == 'title')
            {
                if (!isDraggable())
                    return;
            } 
            else
            {
                if (!isResizable())
                    return;
            }
            log(pos);
            _dragging = pos;
        }
        if (_dragging)
        {
            log('onMouseDown', event);

            _lastMovePos.x = event.clientX;
            _lastMovePos.y = event.clientY;
        }
    }

    function onMouseMove(event)
    {
        event = event || window.event;
        event.preventDefault();

        if (!_dragging)
        {
            if (hoverClickable(event))
            {
                elemOverlay.style.cursor = 'pointer';
                return;
            }

            var pos = hoverFrame(event, 4);
            changeCursor(pos);
            return;
        }

        var deltaX = parseInt(event.clientX - _lastMovePos.x, 10);
        var deltaY = parseInt(event.clientY - _lastMovePos.y, 10);
            _lastMovePos.x = event.clientX;
            _lastMovePos.y = event.clientY;

        if ((deltaX == 0) && (deltaY == 0))
            return;

        var lastPos = {
            top: parseInt(elemFrame.style.top),
            left: parseInt(elemFrame.style.left),
            width: parseInt(elemFrame.style.width),
            height: parseInt(elemFrame.style.height)
        };

        var nextPos = {
            top: lastPos.top,
            left: lastPos.left,
            width: lastPos.width,
            height: lastPos.height
        };

        //log('onMouseMove', event);

        if ((_dragging === 'title') || (_dragging === 'w') || (_dragging === 'nw') || (_dragging === 'sw'))
        { //title, n, s, w, e, nw, ne, sw, se        
            nextPos.left += deltaX;
            if (_dragging !== 'title')
                nextPos.width -= deltaX;
        }

        if ((_dragging === 'title') || (_dragging === 'n') || (_dragging === 'nw') || (_dragging === 'ne'))
        { //title, n, s, w, e, nw, ne, sw, se        
            nextPos.top += deltaY;
            if (_dragging !== 'title')
                nextPos.height -= deltaY;
        }

        if ((_dragging === 'e') || (_dragging === 'ne') || (_dragging === 'se'))
            nextPos.width += deltaX;

        if ((_dragging === 's') || (_dragging === 'sw') || (_dragging === 'se'))
            nextPos.height += deltaY;

        var newLocation = validatePosition(lastPos, nextPos);
        if (newLocation == null)
        {
            _dragging = null;
            _lastMovePos = {};
        }
        else
        {
            elemFrame.style.top = newLocation.top + 'px';
            elemFrame.style.left = newLocation.left + 'px';
            elemFrame.style.width = newLocation.width + 'px';
            elemFrame.style.height = newLocation.height + 'px';
        }
    }

    function onMouseUp(event)
    {
        event = event || window.event;
        event.preventDefault();

        log('onMouseUp', event);

        _dragging = null;
        _lastMovePos = {};
    }

    function isRealObject(obj)
    {
        if ((typeof (obj) === undefined) || (typeof (obj) === null))
            return false;

        if (Array.isArray(obj))
            return true;

        return (typeof (obj) === 'object');
    }

/*
    //NOTE: undefined key or function() will be ignored by JSON.stringify(...)
    const A = {
        a: [null, {a:undefined}, [null,new Date()], {a(){}}],
        b: [1,2],
        c: {a:1, b:2}
    }
    const B = {
        a: ["new", 9],
        b: [new Date()],
        c: {a:{}, c:[]}
    }
    log('A:', JSON.stringify(deepCopy(A)));
    log('B:', JSON.stringify(deepCopy(B)));
    log('Merged:', deepMerge(A, B));
*/
    function deepCopy(val)
    {
        if ((val == undefined) || (val == null))
            return val;
        
        if (Array.isArray(val))
        {
            var ret = [];
            for(var j = 0; j < val.length; j ++)
                ret.push(deepCopy(val[j]));
            return ret;
        }
        else if (typeof (val) === 'object')
        {
            var ret = {};
            for(var k in val)
                ret[k] = deepCopy(val[k]);
            return ret;
        }
        return val;
    }

    function deepMerge()
    {
        var objs = [];
        for(var i = 0; i < arguments.length; i ++)
        {
            if ((arguments[i] == undefined) || (arguments[i] == null))
                continue;
            if (typeof (arguments[i]) == 'object')
                objs.push(arguments[i]);
        }

        if (objs.length == 0)
            return null;

        //log(objs);

        var target = {};
        var isArray = false;
        if (Array.isArray(objs[0]))
        {
            isArray = true;
            target = [];
        }

        for(var i = 0; i < objs.length; i ++)
        {
            if (isArray)
            {
                if (!Array.isArray(objs[i]))
                    continue;
                for(var j = 0; j < objs[i].length; j ++)
                    target.push(c(objs[i][j]));
            }
            else
            {
                if (Array.isArray(objs[i]))
                    continue;
                for(var k in objs[i])
                    target[k] = deepCopy(objs[i][k]);
            }
        }
        return target;
    }

    bindEvents();

    function onButtonClose(event)
    {
        event.stopPropagation();
        event.preventDefault();

        if (typeof(_settings.onClosing) == 'function')
        {
            if (_settings.onClosing())
            {
                unbindEvents();
                deferRemove(_settings.id);
            }
        }
        else
        {
            unbindEvents();
            deferRemove(_settings.id);
        }
    }

    function saveLocation(state)
    {
        _dlgStatus = state;

        _lastSavePos = {
            top: parseInt(elemFrame.style.top, 10),
            left: parseInt(elemFrame.style.left, 10),
            width: parseInt(elemFrame.style.width, 10),
            height: parseInt(elemFrame.style.height, 10)
        }

        if (valid(elemTitleParts['restore']))
            elemTitleParts['restore'].style.display = 'flex';

        if (valid(elemTitleParts['minimize']))
            elemTitleParts['minimize'].style.display = 'none';

        if (valid(elemTitleParts['maximize']))
            elemTitleParts['maximize'].style.display = 'none';

        if (valid(elemTitleParts['fullscreen']))
            elemTitleParts['fullscreen'].style.display = 'none';
    }

    function restoreLocation()
    {
        if (_lastSavePos.top)
            elemFrame.style.top = _lastSavePos.top + 'px';
        if (_lastSavePos.left)
            elemFrame.style.left = _lastSavePos.left + 'px';
        if (_lastSavePos.width)
            elemFrame.style.width = _lastSavePos.width + 'px';
        if (_lastSavePos.height)
            elemFrame.style.height = _lastSavePos.height + 'px';

        _dlgStatus = 'normal';
        _lastSavePos = {};

        if (valid(elemTitleParts['restore']))
            elemTitleParts['restore'].style.display = 'none';

        if (valid(elemTitleParts['minimize']))
            elemTitleParts['minimize'].style.display = 'flex';

        if (valid(elemTitleParts['maximize']))
            elemTitleParts['maximize'].style.display = 'flex';

        if (valid(elemTitleParts['fullscreen']))
            elemTitleParts['fullscreen'].style.display = 'flex';

        //after all being visible
        reLocateTitleText();
    }

    //to start fullscreen operation
    function onToggleFullScreen(event)
    { //manually triggered
        if (top.document.fullscreenElement ||
            top.document.webkitFullscreenElement ||
            top.document.mozFullScreenElement ||
            top.document.msFullscreenElement) 
        {
            log('onToggleFullScreen', 'exiting from fullscreen');

            if (top.document.exitFullscreen) {
                top.document.exitFullscreen();
            } 
            else if (top.document.mozCancelFullScreen) {
                top.document.mozCancelFullScreen();
            } 
            else if (top.document.webkitExitFullscreen) {
                top.document.webkitExitFullscreen();
            } 
            else if (document.msExitFullscreen) {
                top.document.msExitFullscreen();
            }
        } 
        else 
        {
            log('onToggleFullScreen', 'switching to fullscreen');

            saveLocation('fullscreen');

            if (elemFrame.requestFullscreen) {
                elemFrame.requestFullscreen();
            } 
            else if (elemFrame.mozRequestFullScreen) {
                elemFrame.mozRequestFullScreen();
            } 
            else if (elemFrame.webkitRequestFullscreen) {
                elemFrame.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
            } 
            else if (elemFrame.msRequestFullscreen) {
                elemFrame.msRequestFullscreen();
            }
        }
    }

    //event when fullscreen operation ends
    function onFullScreenChanged()
    {
        if (top.document.fullscreenElement ||
            top.document.webkitFullscreenElement ||
            top.document.mozFullScreenElement ||
            top.document.msFullscreenElement) 
        {
            log('onFullScreenChanged','maximized');

            //maximizing, for IE11
            elemFrame.style.top = '0px';
            elemFrame.style.left = '0px';
            elemFrame.style.width = '100%';
            elemFrame.style.height = '100%';

            //after all being visible
            reLocateTitleText();
        }
        else
        {
            log('onFullScreenChanged', 'restored');

            restoreLocation();
        }
    }

    function onFullScreenError()
    {
        log('onFullScreenError');
    }

    function reLocateTitleText()
    {
        var leftWidth = 0;
        if (elemTitleParts['left'])
        {
            var rectTitleLeft = elemTitleParts['left'].getBoundingClientRect();
            leftWidth = rectTitleLeft.width;
        }
        elemTitleParts['middle'].style.marginLeft = parseInt(leftWidth,10) + 'px';
    }

    function onToggleMin(event)
    {
        event.stopPropagation();
        event.preventDefault();

        log('onToggleMin');

        saveLocation('minimized');

        var rectTitle = elemTitle.getBoundingClientRect();
        elemFrame.style.height = parseInt(rectTitle.height,10) + 'px';
        elemFrame.style.width = getMinDragWidth() + 'px';

        if (elemContent)
            elemContent.style.display = 'none';
        if (elemFooter)
            elemFooter.style.display = 'none';
        if (elemTitleParts['restore'])
            elemTitleParts['restore'].style.display = 'flex';

        //after all being visible
        reLocateTitleText();
    }

    function onToggleMax(event)
    {
        event.stopPropagation();
        event.preventDefault();

        log('onToggleMin');

        //save current location before changing
        saveLocation('maximized');

        //maximizing
        elemFrame.style.top = '0px';
        elemFrame.style.left = '0px';
        elemFrame.style.width = '100%';
        elemFrame.style.height = '100%';

        if (elemTitleParts['restore'])
            elemTitleParts['restore'].style.display = 'flex';

        //after all being visible
        reLocateTitleText();
    }

    function onToggleRestore(event)
    {
        event.stopPropagation();
        event.preventDefault();

        log('onToggleRestore');

        if (_dlgStatus == 'minimized')
        {
            if (elemContent)
                elemContent.style.display = 'flex';
            if (elemFooter)
                elemFooter.style.display = 'flex';
        }

        if (_dlgStatus == 'fullscreen')
            onToggleFullScreen();
        else    
            restoreLocation();
    }

    function bindEvents()
    {
        if (valid(elemTitleParts['minimize']))
            elemTitleParts['minimize'].addEventListener('click', onToggleMin, true);
        if (valid(elemTitleParts['maximize']))
            elemTitleParts['maximize'].addEventListener('click', onToggleMax, true);
        if (valid(elemTitleParts['fullscreen']))
            elemTitleParts['fullscreen'].addEventListener('click', onToggleFullScreen, true);
        if (valid(elemTitleParts['restore']))
            elemTitleParts['restore'].addEventListener('click', onToggleRestore, true);
        if (valid(elemTitleParts['close']))
            elemTitleParts['close'].addEventListener('click', onButtonClose, true);

        top.document.addEventListener('fullscreenchange', onFullScreenChanged);
        top.document.addEventListener('webkitfullscreenchange', onFullScreenChanged);
        top.document.addEventListener('mozfullscreenchange', onFullScreenChanged);
        top.document.addEventListener('MSFullscreenChange', onFullScreenChanged);

        top.document.addEventListener("fullscreenerror", onFullScreenError);
        top.document.addEventListener("webkitfullscreenerror", onFullScreenError);
        top.document.addEventListener("mozfullscreenerror", onFullScreenError);
        top.document.addEventListener("MSFullscreenError", onFullScreenError);

        elemOverlay.addEventListener('mousedown', onMouseDown);
        elemOverlay.addEventListener('mousemove', onMouseMove);
        elemOverlay.addEventListener('mouseup', onMouseUp);
        elemOverlay.addEventListener('mouseleave', onMouseUp);

        for(var i = 0; i < _onClickButtons.length; i ++)
        {
            _onClickButtons[i].elem.addEventListener('click', _onClickButtons[i].attr.onClicked);
        }
    }

    function unbindEvents()
    {
        if (valid(elemTitleParts['minimize']))
            elemTitleParts['minimize'].removeEventListener('click', onToggleMin);
        if (valid(elemTitleParts['maximize']))
            elemTitleParts['maximize'].removeEventListener('click', onToggleMax);
        if (valid(elemTitleParts['fullscreen']))
            elemTitleParts['fullscreen'].removeEventListener('click', onToggleFullScreen);
        if (valid(elemTitleParts['restore']))
            elemTitleParts['restore'].removeEventListener('click', onToggleRestore);
        if (valid(elemTitleParts['close']))
            elemTitleParts['close'].removeEventListener('click', onButtonClose);

        for(var i = 0; i < _onClickButtons.length; i ++)
        {
            _onClickButtons[i].elem.removeEventListener('click', _onClickButtons[i].attr.onClicked);
        }

        elemOverlay.removeEventListener('mousedown', onMouseDown);
        elemOverlay.removeEventListener('mousemove', onMouseMove);
        elemOverlay.removeEventListener('mouseup', onMouseUp);
        elemOverlay.removeEventListener('mouseleave', onMouseUp);

        top.document.removeEventListener('fullscreenchange', onFullScreenChanged);
        top.document.removeEventListener('webkitfullscreenchange', onFullScreenChanged);
        top.document.removeEventListener('mozfullscreenchange', onFullScreenChanged);
        top.document.removeEventListener('MSFullscreenChange', onFullScreenChanged);

        top.document.removeEventListener("fullscreenerror", onFullScreenError);
        top.document.removeEventListener("webkitfullscreenerror", onFullScreenError);
        top.document.removeEventListener("mozfullscreenerror", onFullScreenError);
        top.document.removeEventListener("MSFullscreenError", onFullScreenError);
    }

    return {
        show: function() {
            elemOverlay.style.display = 'flex';
        },
        hide: function() {
            elemOverlay.style.display = 'none';
        },
        close: function() {
            unbindEvents();
            deferRemove(_settings.id);
        }
    };
}
