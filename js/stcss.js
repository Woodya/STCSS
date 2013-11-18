/* 
 * Julien Roy
 * 11.14.13
 * STCSS preliminary code
 */

//TODO
//split the page half rendered html and rendered css
//hover the html to add a tag with no attributes
//create multiple options that can be controlled by the user
//Add warnings for duplicate id's

var tag = 'code',
    tab = '&#09',//This is a TAB, you can change it to spaces if you prefer using &nbsp;
    brackets = {
        o : ' {',
        c : '}'
    },
    ul = {
        o : '<ul>',
        c : '</ul>'
    },
    li = {
        o : '<li>',
        c : '</li>'
    }
    globalCss = '',
    globalCssComment =  '<br/><span class="comment">/******************** <br/> * GLOBALS <br/> ********************/ <br/></span>',
    css = '',
    cssComment ='<br/><span class="comment">/******************** <br/> * MAIN CSS <br/> ********************/ <br/></span>',
    warning = '',
    maxDepdth = 0,
    allTags = [],
    tagArray = [],
    attArray = [],
    globalTags = ['a','ul','li','div','article','aside','aside','audio'],
    ids = [],
    classes = [],
    recursive = function($node) {
        $node.children().each(function(){
            allTags.push(this);
            recursive($(this));
        });
    },
    append = function(content) {
        return $(tag).append(content);
    };

recursive($('body'));

globalCss+=ul.o;
css+=ul.o;
    for (i=0; i < allTags.length; i++) {
        liDepth = $(allTags[i]).parents().length;
        tagName = allTags[i].tagName.toLowerCase();
        
        if (tagName != 'script') {
            // ATTRIBUTES
            attr = allTags[i].attributes;
            if (attr.length) {
                for (k=0; k < attr.length; k++) {
                    attrName = attr[k].nodeName;
                    attrValue = attr[k].nodeValue;
                    
                    // Duplicate ID's
                    if (ids.indexOf(attrValue) > 0){
                        warning+='<br/><span class="warning">';
                        warning+='Duplicate Found: ';
                        warning+='#'+attrValue;
                        warning+='</span>';
                    } else if (attArray.indexOf(attrValue) < 0) {
                        attArray.push(attrValue);
                        
                        if (attrName == 'id' || attrName == 'class') {
                            css+=li.o;
                                for (j=2; j < liDepth; j++) css+=tab;
                                switch (attrName) {
                                    case 'id':
                                        ids.push(attrValue);
                                        css+='#'+attrValue;
                                        css+=brackets.o;
                                        css+=brackets.c;
                                        break;
                                    case 'class':
                                        classes.push(attrValue);
                                        var rpl = attrValue.replace(' ', '.');
                                        css+='.'+rpl;
                                        css+=brackets.o;
                                        css+=brackets.c;
                                        break;
                                }
                            css+=li.c;
                        }
                    }
                }
            } else if (tagName == 'header' || tagName == 'nav' || tagName == 'footer') {
                for (j=2; j < liDepth; j++) css+=tab;
                // Adds comments to major tags
                css+= '<span class="comment">';
                    css+= '/* '+tagName.toUpperCase()+' */';
                css+= '</span><br/>';
                for (j=2; j < liDepth; j++) css+=tab;
                css+=tagName;
                css+=brackets.o;
                css+=brackets.c;
            } else if (globalTags.indexOf(tagName) > 0) {
                if (tagArray.indexOf(tagName) < 0) {
                    tagArray.push(tagName);
                    globalCss+=li.o;
                        globalCss+=tagName;
                        globalCss+=brackets.o;
                        globalCss+=brackets.c;
                    globalCss+=li.c;
                }
            }
        }
    }
globalCss+=ul.c;
css+=ul.c;

if (warning.length) append(warning);

if (globalCss.length) globalCss = globalCssComment + globalCss;
append(globalCss);

if (css.length) css = cssComment + css;
append(css);