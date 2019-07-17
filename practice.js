function sortItems(strng){
    var array = strng.split(" ");
    var sortable = new Array();
    var out = '';
    array.forEach(element => {
        ob = {};
        sortable.push(sum(element));
    });
    document.write(JSON.stringify(sortable) +"<br>");
    sortable.sort((a , b) => (a.weight < b.weight) ? 1 : -1);
    document.writeln('Sorting....'  +"<br>");
    sortable.forEach(element =>{
        sortable[sortable.indexOf(element) + 1] === undefined ? (out += element.amount) : (out += element.amount + ", ");
    });
    document.writeln(out  +"<br>");
    return out;
}
function sum(w){
    var arr = w.split('');
    var sum = 0;
    arr.forEach(element => {
        var n = element;
        sum += parseInt(n);
    });
    ob.amount = w;
    ob.weight = sum;
    return ob;
}
