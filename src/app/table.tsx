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
    <Table celled>
      <Table.Header>
        <Table.Row>
          {header.map((headerItem) => (
            <Table.HeaderCell>{headerItem}</Table.HeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {body.map((row) => (
          <Table.Row>
            {row.map((cell) => (
              <Table.Cell>{cell}</Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default GenericTable;  