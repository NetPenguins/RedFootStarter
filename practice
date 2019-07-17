function sortItems(strng){
    var array = strng.split(" ");
    var sortable = new Array();
    var out = '';
    array.forEach(element => {
        ob = {};
        sortable.push(sumation(element));
    });
    document.writeln(JSON.stringify(sortable));
    sortable.sort((a , b) => (a.weight < b.weight) ? 1 : -1);
    document.writeln('Sorting....' + /\n/);
    sortable.forEach(element =>{
        out += element.amount + ", ";
    });
    document.writeln(out);
    return out;
}
function sumation(w){
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
