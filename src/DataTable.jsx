import React, { useState, useEffect } from 'react';
import { Menu, Icon, Table } from 'semantic-ui-react'

const types = {
    "string": {
        compare: (valA, valB) => valA.localeCompare(valB),
        alignment: "left",
        format: (val) => val
    },
    "number": {
        compare: (valA, valB) => valA - valB,
        alignment: "right",
        format: (val) => val.toLocaleString()
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

function DataTable({ columns, data, rows, disablePagination }) {
    const [sortCol, setSortCol] = useState(-1);
    const [sortDir, setSortDir] = useState('asc');
    const [view, setView] = useState(data);
    const [page, setPage] = useState(0);

    const numRows = rows ? rows : 10;

    const paginate = disablePagination ? false: true;

    const numPages = data.length === 0 ? 1 : Math.ceil(data.length / numRows);

    useEffect(() => {
        const newView = [...data];
        if (sortCol !== -1) {
            newView.sort(sortFunc(columns[sortCol]));
            if (sortDir !== 'asc') {
                newView.reverse();
            }
        }
        if (paginate) {
            const pageView = newView.slice(page * numRows, (page + 1) * numRows);
            setView(pageView);
        } else {
            setView(newView);
        }
    },[columns, data, numRows, sortCol, sortDir, page, paginate] )

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

    const cellValue = (row, {selector, type}) => 
        types[type].format(selector(row));

    const alignment = ({type}) => 
        types[type].alignment;

    return <Table celled>
        <Table.Header>
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
                            {cellValue(row, col)}
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
