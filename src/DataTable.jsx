import React, { useState, useEffect } from 'react';
import { Input, Menu, Icon, Table } from 'semantic-ui-react'

const types = {
    "string": {
        compare: (valA, valB) => valA.localeCompare(valB),
        alignment: "left",
        format: (val) => val,
        text: (val) => val
    },
    "number": {
        compare: (valA, valB) => valA === valB ? 0 : (valA < valB ? -1 : +1),
        alignment: "right",
        format: (val) => val.toLocaleString(),
        text: (val) => '' + val
    }
}

export const registerType = (type, spec) => {
    types[type] = spec;
}

const sortFunc = ({selector, type}) => {
    return (rowA, rowB) => 
        types[type].compare(selector(rowA), selector(rowB));
}

const Pagination = ({paginate, colSpan, numPages, setPage, page}) => {
    if (paginate) {
        return <Table.Footer>
            <Table.Row>
                <Table.HeaderCell colSpan={colSpan}>
                <Menu floated='right' pagination>
                    <Menu.Item as='a' icon>
                        <Icon name='chevron left' 
                            disabled={page === 0} 
                            onClick={() => setPage(page - 1)}
                        />
                    </Menu.Item>
                    {[...Array(numPages)].map((ignore, pageNum) => (
                        <Menu.Item 
                            as='a' 
                            key={pageNum}
                            disabled={pageNum === page}
                            onClick={() => setPage(pageNum)}>
                            {1 + pageNum}
                        </Menu.Item>
                    ))}
                    <Menu.Item as='a' icon>
                        <Icon name='chevron right' 
                            disabled={page === numPages - 1} 
                            onClick={() => setPage(page + 1)}
                        />
                    </Menu.Item>
                </Menu>
                </Table.HeaderCell>
            </Table.Row>
        </Table.Footer>
    } else {
        return <></>;
    }
}

const cellComponent = (row, {selector, type}) => 
    types[type].format(selector(row));

const cellText = (row, {selector, type}) => {
    const val = selector(row);
    const textFn = types[type].text;
    if (textFn) {
        return textFn(val);
    } else {
        return '' + val;
    }
}

const alignment = ({type}) => types[type].alignment;

function DataTable({ columns, data, rows, disablePagination, enableSearch }) {
    const [sortCol, setSortCol] = useState(-1);
    const [sortDir, setSortDir] = useState('asc');
    const [view, setView] = useState(data);
    const [page, setPage] = useState(0);
    const [searchKey, setSearchKey] = useState("");

    const numRows = rows ? rows : 10;

    const paginate = disablePagination ? false: true;

    const numPages = data.length === 0 ? 1 : Math.ceil(data.length / numRows);

    useEffect(() => {
        const sortView = (input) => {
            if (sortCol !== -1) {
                const newView = [...input];
                newView.sort(sortFunc(columns[sortCol]));
                if (sortDir !== 'asc') {
                    newView.reverse();
                }
                return newView;
            } else {
                return input;
            }
        }
        const searchView = (input) => {
            if (searchKey === '') {
                return input;
            } else {
                const searchLower = searchKey.toLowerCase();

                return input.filter((row) => {

                    for (const col of columns) {
                        const text = cellText(row, col);
                        const loc = text.toLowerCase().indexOf(searchLower);
                        if (loc !== -1) {
                            return true;
                        }
                    }
                    return false;
                });
            }
        }
        const pageView = (input) => {
            if (paginate) {
                return input.slice(page * numRows, (page + 1) * numRows);
            } else {
                return input;
            }
        }

        setView(pageView(searchView(sortView(data))));
    },[columns, data, numRows, sortCol, sortDir, page, paginate, searchKey])

    const columnClick = (col, index) => {
        if (sortCol === index) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortCol(index);
            setSortDir('asc');
        }
    };

    const direction = (col, index) => {
        if (sortCol === index) {
            if (sortDir === 'asc') {
                return <Icon name='triangle up'/>;
            } else {
                return <Icon name='triangle down'/>;
            }
        } else {
            return <Icon name='arrows alternate vertical'/>;
        }
    }

    const handleSearchChange = (event, target) => {
        setSearchKey(target.value);
    };

    return <Table celled>
        <Table.Header>
            {enableSearch && (<Table.Row >
                <Table.HeaderCell textAlign="right" colSpan={columns.length} >
                    <Input
                        icon={<Icon name='search' circular link />}
                        onChange={handleSearchChange}
                        style={{borderRadius: '100px'}} 
                    />
                </Table.HeaderCell>
            </Table.Row>)}
        <Table.Row>
                {columns.map((col, index) => (
                    <Table.HeaderCell key={index} 
                        onClick={() => columnClick(col, index)}>
                        {col.name}
                        {direction(col, index)}
                    </Table.HeaderCell>
                ))}
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {view.map((row)=> 
                <Table.Row key={row.id}>
                    {columns.map((col, index) => (
                        <Table.Cell key={index} textAlign={alignment(col)}>
                            {cellComponent(row, col)}
                        </Table.Cell>
                    ))}
                </Table.Row>
            )}
        </Table.Body>

        <Pagination colSpan={columns.length}
            paginate={paginate} 
            numPages={numPages}
            setPage={setPage}
            page={page}
         />
        
    </Table>

}

export default DataTable;
