function getLeafNodes(master) {
    var nodes = Array.prototype.slice.call(master.getElementsByTagName("*"), 0);
    var leafNodes = nodes.filter(function(elem) {
        if (elem.hasChildNodes()) {
            // see if any of the child nodes are elements
            for (var i = 0; i < elem.childNodes.length; i++) {
                if (elem.childNodes[i].nodeType == 1) {
                    // there is a child element, so return false to not include
                    // this parent element
                    return false;
                }
            }
        }
        return true;
    });
    return leafNodes;
}
// Get the leaf nodes of the document. Leaf nodes are a technical term, not to be confused with our own personal-technical term "leaf".
const myLeafNodes = getLeafNodes(document.body)
console.log(myLeafNodes)
// Each "word" is a leaf that flutters
myLeafNodes.forEach(node => {
    node.innerHTML = node.innerHTML.replaceAll(/\s+/g, '</span> <span class="leaf">')
    // node.innerHTML = '<span class="winded">'+node.innerHTML+'</span>'
});
const leaves = document.querySelectorAll('.leaf')
leaves.forEach(leaf => {
    // leaf.style['animation-name'] = 'leaf-X, leaf-Y, leaf-Rotate'
    // leaf.style['animation-duration'] = `${4+Math.random()*4}s, ${4+Math.random()*4}s, ${4+Math.random()*4}s`
    // leaf.style['animation-delay'] = `${-8+Math.random()*8}s, ${-8+Math.random()*8}s, ${-8+Math.random()*8}s`

    leaf.style['animation-name'] = 'leaf-Y'
    leaf.style['animation-duration'] = `${2+Math.random()*2}s`
    leaf.style['animation-delay'] = `${-4+Math.random()*4}s`
});
