if (window.top === window.self)
{
    var zIndexStart = 10000;
    var zIndexNext = zIndexStart;

    var liveDialogs = {};
    var deadDialogs = {};

    setTimeout(function() {
        dialogGC();
    }, 100);

    function dialogGC()
    {
        for(var dlgID in deadDialogs)
        {

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
        var curIndex = zIndexNext;
        zIndexNext += 10;
        return curIndex;
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
    var settings = opt;
    var dlgId = getUuid();
    var zIndex = getNextZindex();
    var elemTopBody = top.document.body;

    var dragging = null; //title, n, s, w, e, nw, ne, sw, se

    var lastPosition = {};

    var elemOverlay = top.document.createElement("div");
    elemOverlay.id = dlgId;
    elemOverlay.className = 'dlgOverlay';
    //dlgElem.setAttribute('class', 'dlgOverlay');
    elemOverlay.style.display = 'none';
    elemOverlay.style.zIndex = zIndex;

    var dlgWidth = 600;
    var dlgHeight = 400;

    var dlgMinWidth = 320;
    var dlgMinHeight = 200;

    var dlgMaxWidth = 1024;
    var dlgMaxHeight = 800;

    var handleSize = 4;

    if (valid(dlgMinWidth) && (dlgWidth < dlgMinWidth))
        dlgWidth = dlgMinWidth;
    if (valid(dlgMaxWidth) && (dlgWidth > dlgMaxWidth))
        dlgWidth = dlgMaxWidth;

    if (valid(dlgMinHeight) && (dlgHeight < dlgMinHeight))
        dlgHeight = dlgMinHeight;
    if (valid(dlgMaxHeight) && (dlgHeight > dlgMaxHeight))
        dlgHeight = dlgMaxHeight;

    var dragBox = top.document.createElement("div");
    dragBox.className = 'dragBox';
    dragBox.style.width = (dlgWidth + 2 * handleSize) + 'px';
    dragBox.style.height = (dlgHeight + 2 * handleSize) + 'px';
    dragBox.style.left = '0px';
    dragBox.style.top = '0px';
    dragBox.style.zIndex = zIndex+2;
    elemOverlay.appendChild(dragBox);

    var rowTop = top.document.createElement("div");
    rowTop.className = 'rowTop';
    rowTop.style.height = handleSize + 'px';
    dragBox.appendChild(rowTop);

    var rowMiddle = top.document.createElement("div");
    rowMiddle.className = 'rowMiddle';
    dragBox.appendChild(rowMiddle);

    var rowBottom = top.document.createElement("div");
    rowBottom.className = 'rowBottom';
    rowBottom.style.height = handleSize + 'px';
    dragBox.appendChild(rowBottom);

    var dragTL = top.document.createElement("div");
    dragTL.className = 'dragTL';
    dragTL.style.width = handleSize + 'px';
    rowTop.appendChild(dragTL);

    var dragT = top.document.createElement("div");
    dragT.className = 'dragT';
    rowTop.appendChild(dragT);
    
    var dragTR = top.document.createElement("div");
    dragTR.className = 'dragTR';
    dragTR.style.width = handleSize + 'px';
    rowTop.appendChild(dragTR);

    var dragL = top.document.createElement("div");
    dragL.className = 'dragL';
    dragL.style.width = handleSize + 'px';
    rowMiddle.appendChild(dragL);

    var dragCenter = top.document.createElement("div");
    dragCenter.className = 'dragCenter';
    rowMiddle.appendChild(dragCenter);

    var dragR = top.document.createElement("div");
    dragR.className = 'dragR';
    dragR.style.width = handleSize + 'px';
    rowMiddle.appendChild(dragR);

    var dragBL = top.document.createElement("div");
    dragBL.className = 'dragBL';
    dragBL.style.width = handleSize + 'px';
    rowBottom.appendChild(dragBL);

    var dragB = top.document.createElement("div");
    dragB.className = 'dragB';
    rowBottom.appendChild(dragB);

    var dragBR = top.document.createElement("div");
    dragBR.className = 'dragBR';
    dragBR.style.width = handleSize + 'px';
    rowBottom.appendChild(dragBR);

    var elemFrame = top.document.createElement("div");
    elemFrame.className = 'dlgFrame';
    elemFrame.style.zIndex = zIndex+2;
    dragCenter.appendChild(elemFrame);

    var elemTitle = top.document.createElement("div");
        elemTitle.className = 'dlgTitle';

    var elemTitleLeft = top.document.createElement("div");
        elemTitleLeft.className = 'dlgTitleLeft';
    var elemTitleLeftIcon = top.document.createElement("div");
        elemTitleLeftIcon.className = 'dlgTitleIcon';
        elemTitleLeftIcon.innerHTML = '<span></span>';
        //elemTitleLeft.appendChild(elemTitleLeftIcon);
        elemTitle.appendChild(elemTitleLeft);

    var elemTitleMiddle = top.document.createElement("div");
        elemTitleMiddle.className = 'dlgTitleMiddle';
    var elemTitleText = top.document.createElement("div");
        elemTitleText.className = 'dlgTitleText';
        elemTitleText.innerHTML = '<span>Dialog Examples</span>';
        elemTitleMiddle.appendChild(elemTitleText);
        elemTitle.appendChild(elemTitleMiddle);

    var elemTitleRight = top.document.createElement("div");
        elemTitleRight.className = 'dlgTitleRight';
    var elemTitleMin = top.document.createElement("div");
        elemTitleMin.className = 'dlgTitleIcon';
        elemTitleMin.innerHTML = '<span>&#9866;</span>';
        elemTitleRight.appendChild(elemTitleMin);
    var elemTitleMax = top.document.createElement("div");
        elemTitleMax.className = 'dlgTitleIcon';
        elemTitleMax.innerHTML = '<span>&#9744;</span>';
        elemTitleRight.appendChild(elemTitleMax);
    var elemTitleRestore = top.document.createElement("div");
        elemTitleRestore.className = 'dlgTitleIcon';
        elemTitleRestore.innerHTML = '<span>&#10064;</span>';
        elemTitleRight.appendChild(elemTitleRestore);
    var elemTitleClose = top.document.createElement("div");
        elemTitleClose.className = 'dlgTitleIcon dlgClose';
        elemTitleClose.innerHTML = '<span>&#10005;</span>';
        elemTitleRight.appendChild(elemTitleClose);

        elemTitle.appendChild(elemTitleRight);

        elemFrame.appendChild(elemTitle);

    var elemContent = top.document.createElement("div");
        elemContent.className = 'dlgContent';
        elemFrame.appendChild(elemContent);

    var elemFooter = top.document.createElement("div");
        elemFooter.className = 'dlgFooter';
        //elemFrame.appendChild(elemFooter);

    if (elemTopBody.hasChildNodes())
    {
        elemTopBody.children[0].prepend(elemOverlay);
    }
    else
    {
        elemTopBody.appendChild(elemOverlay);
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

        //document.body.style.cursor = 'wait';
    }

    function changeCursor(pos)
    {
        if (pos == 'title') document.body.style.cursor = 'move';
        else if (pos == 'nw') document.body.style.cursor = 'nw-resize';
        else if (pos == 'n') document.body.style.cursor = 'n-resize';
        else if (pos == 'ne') document.body.style.cursor = 'ne-resize';
        else if (pos == 'w') document.body.style.cursor = 'w-resize';
        else if (pos == 'e') document.body.style.cursor = 'e-resize';
        else if (pos == 'sw') document.body.style.cursor = 'sw-resize';
        else if (pos == 's') document.body.style.cursor = 's-resize';
        else if (pos == 'se') document.body.style.cursor = 'se-resize';
        else document.body.style.cursor = 'default';
    }

    function onMouseDown(event)
    {
        event = event || window.event;
        event.preventDefault();

        var pos = hoverTest(event, 4);
        if (pos)
        {
            console.log(pos);
            dragging = pos;
        }
/*
        var element = (event.target || event.srcElement);

        if (element.closest(".dlgTitle"))
            dragging = 'title';
        else if (element.closest(".dragTL"))
            dragging = 'nw';
        else if (element.closest(".dragT"))
            dragging = 'n';
        else if (element.closest(".dragTR"))
            dragging = 'ne';
        else if (element.closest(".dragL"))
            dragging = 'w';
        else if (element.closest(".dragR"))
            dragging = 'e';
        else if (element.closest(".dragBL"))
            dragging = 'sw';
        else if (element.closest(".dragB"))
            dragging = 's';
        else if (element.closest(".dragBR"))
            dragging = 'se';
*/            
        if (dragging)
        {
            console.log('onMouseDown', event);

            lastPosition.x = event.clientX;
            lastPosition.y = event.clientY;
        }
    }

    function onMouseMove(event)
    {
        event = event || window.event;
        event.preventDefault();

        if (!dragging)
        {
            var pos = hoverTest(event, 4);
            changeCursor(pos);
            return;
        }

        var deltaX = event.clientX - lastPosition.x;
        var deltaY = event.clientY - lastPosition.y;

        lastPosition.x = event.clientX;
        lastPosition.y = event.clientY;

        //console.log('onMouseMove', event);

        var lastPos = {
            top: parseInt(dragBox.style.top),
            left: parseInt(dragBox.style.left),
            width: parseInt(dragBox.style.width),
            height: parseInt(dragBox.style.height)
        };

        var dlgSize = {
            top: lastPos.top,
            left: lastPos.left,
            width: lastPos.width,
            height: lastPos.height
        };

        if ((dragging === 'title') || (dragging === 'w') || (dragging === 'nw') || (dragging === 'sw'))
        { //title, n, s, w, e, nw, ne, sw, se        
            dlgSize.left += deltaX;
            if (dragging !== 'title')
                dlgSize.width -= deltaX;
        }
        if ((dragging === 'title') || (dragging === 'n') || (dragging === 'nw') || (dragging === 'ne'))
        { //title, n, s, w, e, nw, ne, sw, se        
            dlgSize.top += deltaY;
            if (dragging !== 'title')
                dlgSize.height -= deltaY;
        }
        if ((dragging === 'e') || (dragging === 'ne') || (dragging === 'se'))
            dlgSize.width += deltaX;
        if ((dragging === 's') || (dragging === 'sw') || (dragging === 'se'))
            dlgSize.height += deltaY;

        if (valid(dlgMinWidth) && (dlgSize.width < dlgMinWidth))
            dlgSize.width = dlgMinWidth;
        if (valid(dlgMaxWidth) && (dlgSize.width > dlgMaxWidth))
            dlgSize.width = dlgMaxWidth;
        if (valid(dlgMinHeight) && (dlgSize.height < dlgMinHeight))
            dlgSize.height = dlgMinHeight;
        if (valid(dlgMaxHeight) && (dlgSize.height > dlgMaxHeight))
            dlgSize.height = dlgMaxHeight;
    
        dragBox.style.top = dlgSize.top + 'px';
        dragBox.style.left = dlgSize.left + 'px';
        dragBox.style.width = dlgSize.width + 'px';
        dragBox.style.height = dlgSize.height + 'px';

        if ((dlgSize.top == lastPos.top) && 
            (dlgSize.left == lastPos.left) && 
            (dlgSize.width == lastPos.width) && 
            (dlgSize.height == lastPos.height))
        {
            dragging = null;
            lastPosition = {};
        }
    }

    function onMouseUp(event)
    {
        event = event || window.event;
        event.preventDefault();

        console.log('onMouseUp', event);

        dragging = null;
        lastPosition = {};
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
    function deepMerge(obj, override)
    {
        if ((typeof (obj) === 'undefined') || (typeof (obj) === 'null'))
        {
            if ((typeof (override) === 'undefined') || (typeof (override) === 'null'))
                return null;
            return JSON.parse(JSON.stringify(override));
        }
        else if ((typeof (override) === 'undefined') || (typeof (override) === 'null'))
        {
            return JSON.parse(JSON.stringify(obj));
        }

        var objCopy = JSON.parse(JSON.stringify(obj));
        var overCopy = JSON.parse(JSON.stringify(override));
        if (Array.isArray(obj))
        {
            if (Array.isArray(override))
                return objCopy.concat(overCopy);

            objCopy.push(overCopy);
            return objCopy;
        }
        else if ((typeof (obj) !== 'object') || Array.isArray(override))
        {
            return null;
        }

        for(var key in objCopy)
        {
            if (key in overCopy)
            {
                if (isObject(objCopy[key]))
                    objCopy[key] = deepMerge(objCopy[key], JSON.parse(JSON.stringify(overCopy[key])));
                else
                    objCopy[key] = JSON.parse(JSON.stringify(overCopy[key]));
                delete overCopy[key];
            }
        }

        for (key in overCopy)
        {
            objCopy[key] = JSON.parse(JSON.stringify(overCopy[key]));
            delete overCopy[key];
        }
        return objCopy;
    }

    bindEvents();

    function bindEvents()
    {
        elemOverlay.addEventListener('mousedown', onMouseDown);
        elemOverlay.addEventListener('mousemove', onMouseMove);
        elemOverlay.addEventListener('mouseup', onMouseUp);
        elemOverlay.addEventListener('mouseleave', onMouseUp);
    }

    return {
        show: function() {
            elemOverlay.style.display = 'flex';
        },
        hide: function() {
            elemOverlay.style.display = 'none';
        },
        close: function() {
            elemOverlay.removeEventListener('mousedown', onMouseDown);
            elemOverlay.removeEventListener('mousemove', onMouseMove);
            elemOverlay.removeEventListener('mouseup', onMouseUp);
            elemOverlay.removeEventListener('mouseleave', onMouseUp);
        }
    };
}
