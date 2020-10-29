# semantic-react-datatable
Datatable that can be used with Semantic React UI libraries. 

Sample Usage - StudentTable.jsx:
```jsx
import React from 'react'
import DataTable, { registerType } from 'semantic-react-datatable'

export default function StudentTable() {
  return (
    <DataTable
      columns={columns}
      data={students}
      rows={4}
      disablePagination={true}
      enableSearch={true}
    />
  )
}

// By default DataTable supports only two types 'string' and 'number',
// but you can define your own custom types. 
registerType("romanNumeral", {
  
  compare: (valA, valB) => romanToInt(valA) - romanToInt(valB),
  // string - by default compared on locale settings, case sensitive sorting.
  // number - natural number sorting.
  // This Roman letter comparison is not production quality, so treat this only
  // as an example!

  alignment: "center",
  // string - by default left aligned.
  // number - by default right aligned.

  format: (val) => <b>{val}</b>,
  // format: defines formatting of contents of table cell, can be any react component or text.
  // string - by default displated as text component without any additional styling.
  // number - by default uses locale sensitive commas - 1,000,000 for example. 

  text: (val) => val
  // text field is purely to support Search functionality, search will match a row if 
  // at least one of the column's text matches the search token. 
  // string - kept as is.
  // number - using simple decimal notation without commas so that searching is more user friendly.
});

const columns = [
  {
    name: 'ID',
    selector: row => row.id,
    type: 'number',
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
    },
    {
      id: 4,
      name: 'Jerry',
      age: 11,
      grade: 'X'        
    }, 
    {
        id: 5,
        name: 'Rick',
        age: 12,
        grade: 'XI'        
    },
    {
        id: 6,
        name: 'Morty',
        age: 13,
        grade: 'VI'        
    },
]


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

