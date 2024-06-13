import React, { memo, useEffect, useState } from 'react'
import styles from './myTask.module.scss'
import DataTable from 'react-data-table-component';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import { getMyTaskList } from './store';
import { useDispatch } from 'react-redux';

const columns = [
    {
      name: 'Title',
      selector: row => row.title,
      sortable: true,
    },
    {
      name: 'Customer Name',
      selector: row => row.customerName,
      sortable: true,
    },
    {
      name: 'Assigned By',
      selector: row => row.assignedBy,
      sortable: true,
    },
    {
      name: 'Assigned Date',
      selector: row => row.assignedDate,
      sortable: true,
    },
    {
      name: 'Due Date',
      selector: row => row.dueDate,
      sortable: true,
    },
    {
      name: 'Priority',
      selector: row => row.priority,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.status,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <>
          <IconButton aria-label="edit">
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  const data = [
    {
      id: 1,
      title: 'Task 1',
      customerName: 'John Doe',
      assignedBy: 'Jane Smith',
      assignedDate: '2024-06-10',
      dueDate: '2024-06-20',
      priority: 'High',
      status: 'Open',
    },
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: '72px',
      },
    },
    headCells: {
      style: {
        paddingLeft: '8px', 
        paddingRight: '8px',
      },
    },
    cells: {
      style: {
        paddingLeft: '8px',
        paddingRight: '8px',
      },
    },
  };


const MyTask = () => {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const dispatch = useDispatch();

    const allData = () => {
        const from = page * rowsPerPage + 1;
        const to = from + rowsPerPage - 1;
        dispatch(
          getMyTaskList({
            From: from,
            FromDueDate: "",
            IsArchive: false,
            Priority: "",
            SortByDueDate: "",
            SortColumn: "",
            SortOrder: "",
            TaskStatus: "",
            // Title: searchTerm,
            To: to,
            ToDueDate: "",
            // UserId: getUserId(),
            UserIds: "",
            // ...filter,
          })
        );
      };

      useEffect(() => {
        allData();
      }, []);

  return (
    <div>
        <DataTable 
            title="Task Management"
            columns={columns}
            data={data}
            pagination
            responsive
            customStyles={customStyles}
        />
    </div>
  )
}

export default memo(MyTask)