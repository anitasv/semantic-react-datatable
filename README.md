# semantic-react-datatable
Datatable that can be used with Semantic React UI libraries. 

```jsx
import React from 'react'
import DataTable, { registerType } from 'semantic-react-datatable'

registerType("romanNumeral", {
  compare: (valA, valB) => romanToInt(valA) - romanToInt(valB),
  alignment: "center",
  format: (val) => <b>val</b>
});

const columns = [
  {
    name: 'ID',
    selector: row => row.id,
    type: 'string',
  },
  {
    name: 'Name',
    selector: row => row.name,
    type: 'string',
  },
  {
    name: 'Age',
    selector: row => row.age,
    type: 'number',
  },
  {
    name: 'Grade',
    selector: row => row.grade,
    type: 'romanNumeral',
  },
]

const students = [
    {
        id: 1,
        name: 'Tom',
        age: 11,
        grade: 'IX'        
    }, 
    {
        id: 2,
        name: 'Dick',
        age: 12,
        grade: 'VIII'        
    },
    {
        id: 3,
        name: 'Harry',
        age: 13,
        grade: 'VII'        
    }
]
function StudentList() {
  return (
    <DataTable
      columns={columns}
      data={c}
      rows={10}
    />
  )
}

export default StudentList;

const romanToInt = (roman) => {
    function char_to_int(c){
        switch (c){
            case 'I': return 1;
            case 'V': return 5;
            case 'X': return 10;
            case 'L': return 50;
            case 'C': return 100;
            case 'D': return 500;
            case 'M': return 1000;
            default: return -1;
        }
    }

    var num = char_to_int(roman.charAt(0));
    var pre, curr;

    for(var i = 1; i < roman.length; i++){
        curr = char_to_int(roman.charAt(i));
        pre = char_to_int(roman.charAt(i-1));
        if(curr <= pre){
            num += curr;
        } else {
            num = num - pre*2 + curr;
        }
    }

    return num;
}
```

