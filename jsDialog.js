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

    var dragging = false;
    var lastPosition = {};

    var elemOverlay = top.document.createElement("div");
    elemOverlay.id = dlgId;
    elemOverlay.className = 'dlgOverlay';
    //dlgElem.setAttribute('class', 'dlgOverlay');
    elemOverlay.style.display = 'none';
    elemOverlay.style.zIndex = zIndex;

    var elemFrame = top.document.createElement("div");
        elemFrame.className = 'dlgFrame';
        elemFrame.style.width = '800px';
        elemFrame.style.height = '600px';
        elemFrame.style.left = '0px';
        elemFrame.style.top = '0px';
        elemFrame.style.zIndex = zIndex+1;

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

        elemOverlay.appendChild(elemFrame);

    if (elemTopBody.hasChildNodes())
    {
        elemTopBody.children[0].prepend(elemOverlay);
    }
    else
    {
        elemTopBody.appendChild(elemOverlay);
    }

    function onMouseDown(event)
    {
        event = event || window.event;
        event.preventDefault();

        console.log('onMouseDown', event);

        lastPosition.x = event.clientX;
        lastPosition.y = event.clientY;

        dragging = true;
        elemOverlay.addEventListener('mousemove', onMouseMove);
        elemOverlay.addEventListener('mouseup', onMouseUp);
        elemOverlay.addEventListener('mouseleave', onMouseUp);
    }

    function onMouseMove(event)
    {
        event = event || window.event;
        event.preventDefault();

        if (!dragging)
            return;

        console.log('onMouseMove', event);

        var deltaX = event.clientX - lastPosition.x;
        var deltaY = event.clientY - lastPosition.y;

        lastPosition.x = event.clientX;
        lastPosition.y = event.clientY;

        var dlgX = parseInt(elemFrame.style.left);
        var dlgY = parseInt(elemFrame.style.top);

        dlgX += deltaX;
        dlgY += deltaY;

        elemFrame.style.left = dlgX + 'px';
        elemFrame.style.top = dlgY + 'px';
    }

    function onMouseUp(event)
    {
        event = event || window.event;
        event.preventDefault();

        if (!dragging)
            return;

        console.log('onMouseUp', event);

        dragging = false;
        lastPosition = {};

        elemOverlay.removeEventListener('mousemove', onMouseMove);
        elemOverlay.removeEventListener('mouseup', onMouseUp);
        elemTitle.removeEventListener('mouseleave', onMouseUp);
    }

    function isObject(obj)
    {
        if ((typeof (obj) === 'undefined') || (typeof (obj) === 'null'))
            return false;

        if (Array.isArray(obj))
            return true;

        return (typeof (obj) === 'object');
    }

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

    if (settings.draggable) {
        elemTitle.addEventListener('mousedown', onMouseDown);
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

    return {
        show: function() {
            elemOverlay.style.display = 'flex';
        },
        hide: function() {
            elemOverlay.style.display = 'none';
        },
        close: function() {
            if (settings.draggable) {
                elemTitle.removeEventListener('mousedown', onMouseDown);
            }
        }
    };
}
