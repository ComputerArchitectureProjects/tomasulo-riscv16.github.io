import React from 'react';
import { Table } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

type Props = {
  header: string[];
  body: string[][];
};

const GenericTable = (props: Props) => {
  const { header, body } = props;
  return (
    <Table celled style={{ width: '100%' }}>
      <Table.Header>
        <Table.Row>
          {header.map((headerItem, index) => (
            <Table.HeaderCell key={index}>{headerItem}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {body.map((row, rowIndex) => (
          <Table.Row key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <Table.Cell key={cellIndex}>{cell}</Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default GenericTable;
// deploy website