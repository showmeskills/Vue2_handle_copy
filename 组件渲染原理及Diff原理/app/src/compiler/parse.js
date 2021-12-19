const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 他匹配到的分组是一个 标签名  <xxx 匹配到的是开始 标签的名字
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);  // 匹配的是</xxxx>  最终匹配到的分组就是结束标签的名字
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;  // 匹配属性
// 第一个分组就是属性的key value 就是 分组3/分组4/分组五
const startTagClose = /^\s*(\/?)>/;  // <div> <br/>
//vue3 采用的不是使用正则
//对模版进行编译处理 类似于 htmlparser2 - npmjs
export function parseHTML(html) { // html 最开始肯定是一个 <
    /*
        {
            tag:div
            type:1,
            attrs:[{name,address,age}],
            parent:null,
            children:[]
        }
    搞一个栈结构 获取 父子关系;[div] ->入栈 [div, div] ->出栈 [div]; 栈中最后一个元素就是父元素
    */
    const ELEMENT_TYPE = 1;
    const TEXT_TYPE = 3;
    const stack = []; //用于存放元素
    let currentParent; //指向的是栈中的最后一个
    let root; //根节点
    // 最终转化成一个壳抽象语法树
    function createASTElement(tag, attrs) {
        return {
            tag,
            type: ELEMENT_TYPE,
            children: [],
            attrs,
            parent: null,
        }
    }
    //用栈型结构 构造一课树
    function start(tag, attrs) {
        //console.log(tag, attrs, "start")
        let node = createASTElement(tag, attrs);
        if (!root) { //没有更节点
            root = node; //那么当前节点就是树根
        }
        if (currentParent) {
            node.parent = currentParent; // 值赋予了parent 属性
            currentParent.children.push(node); // 还需要
        }
        stack.push(node);
        currentParent = node; //开始就是栈中的最后一个
    }

    function chars(text) { // 文本直接放到当前指向的节点中
        //console.log(text, "text")
        text = text.replace(/\s/g, '');
        text && currentParent.children.push({
            type: TEXT_TYPE,
            text,
            parent: currentParent
        })
    }

    function end(tag) {
        //console.log(tag, "end")
        let node = stack.pop(); //弹出最后一个,校验标签是否合法
        currentParent = stack[stack.length - 1];
    }

    function advance(n) {
        html = html.substring(n);
    }

    function parseStartTag() {
        const start = html.match(startTagOpen);
        if (start) {
            const match = {
                tagName: start[1], //标签名
                attrs: []
            }
            advance(start[0].length); //删除已经匹配过的 标签
            //如果不是开始标签的结束 就一直匹配下去
            let attr, end;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length)
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5] || true
                })
            }
            if (end) {
                advance(end[0].length);
            }
            return match;
        }
        return false; // 返回false不是开始标签
    }
    while (html) {
        //如果textEnd为0 说明是一个开始标签或者结束标签
        //如果 textEnd > 0 说明就是文本的结束位置
        let textEnd = html.indexOf("<"); // 如果indexOf中的索引是0 则说明是个标签
        if (textEnd == 0) {
            const startTargMatch = parseStartTag();
            if (startTargMatch) { // 解析到的开始标签
                start(startTargMatch.tagName, startTargMatch.attrs)
                continue;
            }
            let endTagMatch = html.match(endTag);
            if (endTagMatch) {
                advance(endTagMatch[0].length);
                end(endTagMatch[1])
                continue;
            }
        }
        if (textEnd > 0) { //解析到的文本
            let text = html.substring(0, textEnd);
            if (text) {
                chars(text)
                advance(text.length);
            }
        }
    }
    return root;
}
