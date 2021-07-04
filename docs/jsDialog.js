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
    validateSettings();

    var _dragging = null; //title, n, s, w, e, nw, ne, sw, se
    var _dlgStatus = 'normal';
    var _lastMovePos = {};
    var _lastSavePos = {};

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

    var rectOverlay = elemOverlay.getBoundingClientRect();
    var dlgTop  = (parseInt(rectOverlay.height,10) - _settings.height - 2 * _settings.resizing.handleSize)/2;
    var dlgLeft = (parseInt(rectOverlay.width,10) - _settings.width - 2 * _settings.resizing.handleSize)/2;

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
                elemTitleMiddle.style.left = parseInt(rectTitleLeft.width,10) + 'px';
        }
        elemTitle.appendChild(elemTitleMiddle);

    var elemTitleText = top.document.createElement("div");
        elemTitleText.className = 'dlgTitleText' + _settings.theme;
        if (_settings.title.middle && _settings.title.middle.html)
            elemTitleText.innerHTML = _settings.title.middle.html;
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

    var elemTitleFull = top.document.createElement("div");
        elemTitleFull.className = 'dlgTitleIcon' + _settings.theme + ' dlgFullScreen' + _settings.theme;
        elemTitleFull.innerHTML = '<span>&#8690;</span>';
        elemTitleRight.appendChild(elemTitleFull);

    var elemTitleRestore = top.document.createElement("div");
        elemTitleRestore.className = 'dlgTitleIcon' + _settings.theme;
        elemTitleRestore.innerHTML = '<span>&#10064;</span>';
        elemTitleRestore.style.display = 'none';
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

    function validateSettings()
    {
        if (valid(_settings.width))  _settings.width = parseInt(_settings.width, 10);
        if (valid(_settings.height))  _settings.height = parseInt(_settings.height, 10);
        if (valid(_settings.minWidth))  _settings.minWidth = parseInt(_settings.minWidth, 10);
        if (valid(_settings.maxWidth))  _settings.maxWidth = parseInt(_settings.maxWidth, 10);
        if (valid(_settings.minHeight))  _settings.minHeight = parseInt(_settings.minHeight, 10);
        if (valid(_settings.maxHeight))  _settings.maxHeight = parseInt(_settings.maxHeight, 10);

        if (valid(_settings.minMidth) && (_settings.width < _settings.minWidth))
            _settings.width = _settings.minWidth;
        if (valid(_settings.maxWidth) && (_settings.width > _settings.maxWidth))
            _settings.width = _settings.maxWidth;

        if (valid(_settings.minHeight) && (_settings.height < _settings.minHeight))
            _settings.height = _settings.minHeight;
        if (valid(_settings.maxHeight) && (_settings.height > _settings.maxHeight))
            _settings.height = _settings.maxHeight;

        if (!valid(_settings.theme))
            _settings.theme = '';
        if (_settings.theme && (_settings.theme.substring(0, 1) != '-'))
            _settings.theme = '-' + _settings.theme;
    }

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
            if ((_dlgStatus == 'maximized') || (_dlgStatus == 'fullscreen'))
                return;
            if ((_dlgStatus == 'minimized') && (pos != 'title') && (pos != 'e') && (pos != 'w'))
                return;

            console.log(pos);
            _dragging = pos;
        }
/*
        var element = (event.target || event.srcElement);
*/            
        if (_dragging)
        {
            console.log('onMouseDown', event);

            _lastMovePos.x = event.clientX;
            _lastMovePos.y = event.clientY;
        }
    }

    function getMinDragWidth()
    {
        var rectTitleText = elemTitleText.getBoundingClientRect();
        var rectTitleRight = elemTitleRight.getBoundingClientRect();
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

        var clamped = false;
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
            if (valid(_settings.minWidth) && (dlgSize.width < _settings.minWidth))
            {
                dlgSize.width = _settings.minWidth;
                clamped = true;
            }
        }

        if (valid(_settings.maxWidth) && (dlgSize.width > _settings.maxWidth))
        {
            dlgSize.width = _settings.maxWidth;
            clamped = true;
        }

        if (_dlgStatus != 'minimized')
        {
            if (valid(_settings.minHeight) && (dlgSize.height < _settings.minHeight))
            {
                dlgSize.height = _settings.minHeight;
                clamped = true;
            }
            if (valid(_settings.maxHeight) && (dlgSize.height > _settings.maxHeight))
            {
                dlgSize.height = _settings.maxHeight;
                clamped = true;
            }
        }

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

        if ((dlgSize.top == lastPos.top) && 
            (dlgSize.left == lastPos.left) && 
            (dlgSize.width == lastPos.width) && 
            (dlgSize.height == lastPos.height) && clamped)
        {
            return null;
        }

        return dlgSize;
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

        var deltaX = event.clientX - _lastMovePos.x;
        var deltaY = event.clientY - _lastMovePos.y;
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

        //console.log('onMouseMove', event);

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

        console.log('onMouseUp', event);

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
    console.log('A:', JSON.stringify(deepCopy(A)));
    console.log('B:', JSON.stringify(deepCopy(B)));
    console.log('Merged:', deepMerge(A, B));
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

        //console.log(objs);

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

    function saveLocation(state)
    {
        _dlgStatus = state;
        if (_dlgStatus != 'fullscreen')
        {
            _lastSavePos = {
                top: parseInt(elemFrame.style.top, 10),
                left: parseInt(elemFrame.style.left, 10),
                width: parseInt(elemFrame.style.width, 10),
                height: parseInt(elemFrame.style.height, 10)
            }
        }

        if (valid(elemTitleRestore))
            elemTitleRestore.style.display = 'flex';

        if (valid(elemTitleMin))
            elemTitleMin.style.display = 'none';

        if (valid(elemTitleMax))
            elemTitleMax.style.display = 'none';

        if (valid(elemTitleFull))
            elemTitleFull.style.display = 'none';
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

        if (valid(elemTitleRestore))
            elemTitleRestore.style.display = 'none';

        if (valid(elemTitleMin))
            elemTitleMin.style.display = 'flex';

        if (valid(elemTitleMax))
            elemTitleMax.style.display = 'flex';

        if (valid(elemTitleFull))
            elemTitleFull.style.display = 'flex';
    }

    function onToggleFullScreen()
    {
        if (document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement) 
        {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } 
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } 
            else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } 
            else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        } 
        else 
        {
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

    function onFullScreenChanged()
    {
        console.log('onFullScreenChanged');

        if (document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement) 
        {
            saveLocation('fullscreen');
        }
        else
        {
            restoreLocation();
        }
    }

    function onToggleMin()
    {
        saveLocation('minimized');

        var rectTitle = elemTitle.getBoundingClientRect();
        elemFrame.style.height = parseInt(rectTitle.height,10) + 'px';
        elemFrame.style.width = getMinDragWidth() + 'px';

        elemTitleRestore.style.display = 'flex';
    }

    function onToggleMax()
    {
        saveLocation('maximized');

        elemFrame.style.top = '0px';
        elemFrame.style.left = '0px';
        elemFrame.style.width = '100%';
        elemFrame.style.height = '100%';

        elemTitleRestore.style.display = 'flex';
    }

    function onToggleRestore()
    {
        if (_dlgStatus == 'fullscreen')
            onToggleFullScreen();
        else
            restoreLocation();
    }

    function bindEvents()
    {
        if (valid(elemTitleClose))
            elemTitleClose.addEventListener('click', onButtonClose);

        if (valid(elemTitleFull))
            elemTitleFull.addEventListener('click', onToggleFullScreen);
        if (valid(elemTitleRestore))
            elemTitleRestore.addEventListener('click', onToggleRestore);

        if (valid(elemTitleMin))
            elemTitleMin.addEventListener('click', onToggleMin);
        if (valid(elemTitleMax))
            elemTitleMax.addEventListener('click', onToggleMax);

        elemFrame.addEventListener('fullscreenchange', onFullScreenChanged);
        elemFrame.addEventListener('mozfullscreenchange', onFullScreenChanged);
        elemFrame.addEventListener('webkitfullscreenchange', onFullScreenChanged);
        elemFrame.addEventListener('msfullscreenchange', onFullScreenChanged);

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
