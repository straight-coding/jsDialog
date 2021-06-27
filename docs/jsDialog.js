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

/**
<div id="" class="dlgOverlay" style="display:none;">
    <div class="dlgFrame">
        <div class="dlgTitle">
        </div>
        <div class="dlgContent">
        </div>
        <div class="dlgFooter">
        </div>
    </div>
</div> 

 */
function jsDialog(opt)
{
    var _default = {
        id: getUuid(),
        zIndex: getNextZindex(),
        dragging: {
            enabled: true,
        },
        resizing: {
            enabled: true,
            handleSize: 4
        },
        width: 600,
        height: 400,
        minWidth: 320,
        maxWidth: 1024,
        minHeight: 200,
        maxHeight: 800
    };

    var _settings = deepMerge(_default, opt);
    if (!valid(_settings.theme))
        _settings.theme = '';
    if (_settings.theme && (_settings.theme.substring(0, 1) != '-'))
        _settings.theme = '-' + _settings.theme;

    var _dragging = null; //title, n, s, w, e, nw, ne, sw, se

    var _lastPosition = {};

    var elemTopBody = top.document.body;
    var elemOverlay = top.document.createElement("div");
        elemOverlay.id = _settings.id;
        elemOverlay.className = 'dlgOverlay' + _settings.theme;
        elemOverlay.style.display = 'flex';
        elemOverlay.style.zIndex = _settings.zIndex;

    if (elemTopBody.hasChildNodes())
        elemTopBody.children[0].prepend(elemOverlay);
    else
        elemTopBody.appendChild(elemOverlay);

    if (valid(_settings.minMidth) && (_settings.width < _settings.minWidth))
        _settings.width = _settings.minWidth;
    if (valid(_settings.maxWidth) && (_settings.width > _settings.maxWidth))
        _settings.width = _settings.maxWidth;

    if (valid(_settings.minHeight) && (_settings.height < _settings.minHeight))
        _settings.height = _settings.minHeight;
    if (valid(_settings.maxHeight) && (_settings.height > _settings.maxHeight))
        _settings.height = _settings.maxHeight;

    var rectOverlay = elemOverlay.getBoundingClientRect();
    var dlgTop  = (rectOverlay.height - _settings.height - 2 * _settings.resizing.handleSize)/2;
    var dlgLeft = (rectOverlay.width - _settings.width - 2 * _settings.resizing.handleSize)/2;

    var elemFrame = top.document.createElement("div");
        elemFrame.className = 'dlgFrame' + _settings.theme;
        elemFrame.style.width  = (_settings.width + 2 * _settings.resizing.handleSize) + 'px';
        elemFrame.style.height = (_settings.height + 2 * _settings.resizing.handleSize) + 'px';
        elemFrame.style.left = (dlgLeft>0 ? dlgLeft : 0) + 'px';
        elemFrame.style.top = (dlgTop>0 ? dlgTop: 0) + 'px';
        elemFrame.style.zIndex = _settings.zIndex + 1;
        elemOverlay.appendChild(elemFrame);

    var elemTitle = top.document.createElement("div");
        elemTitle.className = 'dlgTitle' + _settings.theme;
        elemFrame.appendChild(elemTitle);

    var elemTitleLeft = top.document.createElement("div");
        elemTitleLeft.className = 'dlgTitleLeft' + _settings.theme;
        elemTitle.appendChild(elemTitleLeft);

    var hasTitleLeft = false;
    if (_settings.title && _settings.title.left && _settings.title.left.html)
    {
        hasTitleLeft = true;
        elemTitleLeft.innerHTML = _settings.title.left.html;
    }

    var rectTitleLeft = elemTitleLeft.getBoundingClientRect();
    var elemTitleMiddle = top.document.createElement("div");
        elemTitleMiddle.className = 'dlgTitleMiddle' + _settings.theme;
        if (hasTitleLeft && _settings.title.middle)
        {
            if (_settings.title.middle.align == 'left')
                elemTitleMiddle.style.left = rectTitleLeft.width + 'px';
        }
        elemTitle.appendChild(elemTitleMiddle);

    var elemTitleText = top.document.createElement("div");
        elemTitleText.className = 'dlgTitleText' + _settings.theme;
        elemTitleText.innerHTML = '<span>Dialog Examples</span>';
        elemTitleMiddle.appendChild(elemTitleText);

    var elemTitleRight = top.document.createElement("div");
        elemTitleRight.className = 'dlgTitleRight' + _settings.theme;
        elemTitle.appendChild(elemTitleRight);

    var elemTitleMin = top.document.createElement("div");
        elemTitleMin.className = 'dlgTitleIcon' + _settings.theme;
        elemTitleMin.innerHTML = '<span>&#9866;</span>';
        elemTitleRight.appendChild(elemTitleMin);

    var elemTitleMax = top.document.createElement("div");
        elemTitleMax.className = 'dlgTitleIcon' + _settings.theme;
        elemTitleMax.innerHTML = '<span>&#9744;</span>';
        elemTitleRight.appendChild(elemTitleMax);

    var elemTitleRestore = top.document.createElement("div");
        elemTitleRestore.className = 'dlgTitleIcon' + _settings.theme;
        elemTitleRestore.innerHTML = '<span>&#10064;</span>';
        elemTitleRight.appendChild(elemTitleRestore);

    var elemTitleClose = top.document.createElement("div");
        elemTitleClose.className = 'dlgTitleIcon' + _settings.theme + ' dlgClose' + _settings.theme;
        elemTitleClose.innerHTML = '<span>&#10005;</span>';
        elemTitleRight.appendChild(elemTitleClose);

    var elemContent = top.document.createElement("div");
        elemContent.className = 'dlgContent' + _settings.theme;
        elemFrame.appendChild(elemContent);

    var elemFooter = top.document.createElement("div");
        elemFooter.className = 'dlgFooter' + _settings.theme;
        //elemFrame.appendChild(elemFooter);

    function valid(val)
    {
        return (val != undefined) && (val != null);
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

    function hoverTest(event, tol)
    {
        var tolerant = 0;
        if (tol)
            tolerant = tol;

        var rectTitle = elemTitle.getBoundingClientRect();
        if (inRect(event, rectTitle, tolerant))
            return 'title';

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

    function changeCursor(pos)
    {
        if (pos == 'title') elemOverlay.style.cursor = 'move';
        else if (pos == 'nw') elemOverlay.style.cursor = 'nw-resize';
        else if (pos == 'n') elemOverlay.style.cursor = 'n-resize';
        else if (pos == 'ne') elemOverlay.style.cursor = 'ne-resize';
        else if (pos == 'w') elemOverlay.style.cursor = 'w-resize';
        else if (pos == 'e') elemOverlay.style.cursor = 'e-resize';
        else if (pos == 'sw') elemOverlay.style.cursor = 'sw-resize';
        else if (pos == 's') elemOverlay.style.cursor = 's-resize';
        else if (pos == 'se') elemOverlay.style.cursor = 'se-resize';
        else elemOverlay.style.cursor = 'default';
    }

    function onMouseDown(event)
    {
        event = event || window.event;
        event.preventDefault();

        var pos = hoverTest(event, 4);
        if (pos)
        {
            console.log(pos);
            _dragging = pos;
        }
/*
        var element = (event.target || event.srcElement);
*/            
        if (_dragging)
        {
            console.log('onMouseDown', event);

            _lastPosition.x = event.clientX;
            _lastPosition.y = event.clientY;
        }
    }

    function onMouseMove(event)
    {
        event = event || window.event;
        event.preventDefault();

        if (!_dragging)
        {
            var pos = hoverTest(event, 4);
            changeCursor(pos);
            return;
        }

        var deltaX = event.clientX - _lastPosition.x;
        var deltaY = event.clientY - _lastPosition.y;

        _lastPosition.x = event.clientX;
        _lastPosition.y = event.clientY;

        //console.log('onMouseMove', event);

        var lastPos = {
            top: parseInt(elemFrame.style.top),
            left: parseInt(elemFrame.style.left),
            width: parseInt(elemFrame.style.width),
            height: parseInt(elemFrame.style.height)
        };

        var dlgSize = {
            top: lastPos.top,
            left: lastPos.left,
            width: lastPos.width,
            height: lastPos.height
        };

        if ((_dragging === 'title') || (_dragging === 'w') || (_dragging === 'nw') || (_dragging === 'sw'))
        { //title, n, s, w, e, nw, ne, sw, se        
            dlgSize.left += deltaX;
            if (_dragging !== 'title')
                dlgSize.width -= deltaX;
        }
        if ((_dragging === 'title') || (_dragging === 'n') || (_dragging === 'nw') || (_dragging === 'ne'))
        { //title, n, s, w, e, nw, ne, sw, se        
            dlgSize.top += deltaY;
            if (_dragging !== 'title')
                dlgSize.height -= deltaY;
        }
        if ((_dragging === 'e') || (_dragging === 'ne') || (_dragging === 'se'))
            dlgSize.width += deltaX;
        if ((_dragging === 's') || (_dragging === 'sw') || (_dragging === 'se'))
            dlgSize.height += deltaY;

        if (valid(_settings.minWidth) && (dlgSize.width < _settings.minWidth))
            dlgSize.width = _settings.minWidth;
        if (valid(_settings.maxWidth) && (dlgSize.width > _settings.maxWidth))
            dlgSize.width = _settings.maxWidth;
    
        if (valid(_settings.minHeight) && (dlgSize.height < _settings.minHeight))
            dlgSize.height = _settings.minHeight;
        if (valid(_settings.maxHeight) && (dlgSize.height > _settings.maxHeight))
            dlgSize.height = _settings.maxHeight;
    
        elemFrame.style.top = dlgSize.top + 'px';
        elemFrame.style.left = dlgSize.left + 'px';
        elemFrame.style.width = dlgSize.width + 'px';
        elemFrame.style.height = dlgSize.height + 'px';

        if ((dlgSize.top == lastPos.top) && 
            (dlgSize.left == lastPos.left) && 
            (dlgSize.width == lastPos.width) && 
            (dlgSize.height == lastPos.height))
        {
            _dragging = null;
            _lastPosition = {};
        }
    }

    function onMouseUp(event)
    {
        event = event || window.event;
        event.preventDefault();

        console.log('onMouseUp', event);

        _dragging = null;
        _lastPosition = {};
    }

    function isObject(obj)
    {
        if ((typeof (obj) === 'undefined') || (typeof (obj) === 'null'))
            return false;

        if (Array.isArray(obj))
            return true;

        return (typeof (obj) === 'object');
    }

/*
    NOTE: undefined key or function() will be ignored by JSON.stringify(...)
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
    console.log(JSON.stringify(A.a));
    console.log(JSON.parse(JSON.stringify(A.a)));
    console.log(deepMerge(A, B));
*/
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
                {
                    if (Array.isArray(objs[i][j]))
                        target.push(deepMerge([], objs[i][j]));
                    else if (typeof (objs[i][j]) == 'object')
                        target.push(deepMerge({}, objs[i][j]));
                    else
                        target.push(objs[i][j]);
                }
            }
            else
            {
                if (Array.isArray(objs[i]))
                    continue;
                for(var k in objs[i])
                {
                    if (Array.isArray(objs[i][k]))
                        target[k] = deepMerge([], objs[i][k]);
                    else if (typeof (objs[i][k]) == 'object')
                        target[k] = deepMerge({}, objs[i][k]);
                    else
                        target[k] = objs[i][k];
                }
            }
        }
        return target;
    }

    bindEvents();

    function onButtonClose()
    {
        if (typeof(_settings.onClosing) == 'function')
        {
            if (_settings.onClosing())
            {
                unbindEvents();

                deferRemove(_settings.id);
            }
        }
    }

    function bindEvents()
    {
        if (valid(elemTitleClose))
            elemTitleClose.addEventListener('click', onButtonClose);

        elemOverlay.addEventListener('mousedown', onMouseDown);
        elemOverlay.addEventListener('mousemove', onMouseMove);
        elemOverlay.addEventListener('mouseup', onMouseUp);
        elemOverlay.addEventListener('mouseleave', onMouseUp);
    }

    function unbindEvents()
    {
        elemOverlay.removeEventListener('mousedown', onMouseDown);
        elemOverlay.removeEventListener('mousemove', onMouseMove);
        elemOverlay.removeEventListener('mouseup', onMouseUp);
        elemOverlay.removeEventListener('mouseleave', onMouseUp);
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
        }
    };
}
