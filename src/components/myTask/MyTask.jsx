import React, { memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Tooltip } from '@mui/material';
import { getMyTaskList } from './store';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import TaskArchive from "../../assets/images/TaskArchive.svg"
import TaskAccept from "../../assets/images/TaskAccept.svg"
import TaskViewCoverage from "../../assets/images/TaskViewTaskCoverage.svg"
import TaskDelete from "../../assets/images/TaskDelete.svg"
import TaskComplete from "../../assets/images/TaskComplete.svg"
import TaskPartialComplete from "../../assets/images/TaskPartialComplete.svg"

import styles from './myTask.module.scss'

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
    const { allTasks, totalCount, filter } = useSelector(
        (state) => state.userTask
    );

    const dispatch = useDispatch();

    const stringToDate = (str) => {
        const date = new Date(str);
        return moment (date).format("Do MMM YYYY");
      };

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

      const columns = [
        {
          name: 'Title',
          selector: row => row.Title || '-',
          sortable: true,
        },
        {
          name: 'Customer Name',
          selector: row => row.LeadName || '-',
          sortable: true,
        },
        {
          name: 'Assigned By',
          selector: row => row.AssignedByUserName || '-',
          sortable: true,
        },
        {
          name: 'Assigned Date',
          selector: row => stringToDate(row?.CreateDate) || "-",
          sortable: true,
        },
        {
          name: 'Due Date',
          selector: row => stringToDate(row?.TaskEndDate) || "-",
          sortable: true,
        },
        {
          name: 'Priority',
          width: '100px',
          selector: row => row.Priority || '-',
          sortable: true,
        },
        {
          name: 'Status',
          selector: row => row.TaskStatus || '-',
          sortable: true,
        },
        {
          name: '',
          cell: row => (
            <div className={styles.actionColumnContainer}>
                <div>
                    <Tooltip title="Archive">
                        <img 
                            src={TaskArchive}
                            onClick={() => console.log("archive clicked...")}
                        />
                    </Tooltip>
                </div>

                <div>
                    {row?.TaskStatus === -1 && (
                        <Tooltip title="Accept">
                            <img src={TaskAccept}/>
                        </Tooltip>
                    )}
                </div>

                <div>
                    <Tooltip title="View Task Coverage">
                        <img src={TaskViewCoverage} />
                    </Tooltip>
                </div>

                <div>
                    <Tooltip title="Delete">
                        <img src={TaskDelete} />
                    </Tooltip>
                </div>

                <div>
                    {row?.TaskStatus === 0 && (
                        <Tooltip title="Complete">
                            <img src={TaskComplete} />
                        </Tooltip>
                    )}
                </div>

                <div>
                    {row?.TaskStatus === 0 && (
                        <Tooltip title="Partial Complete">
                            <img src={TaskPartialComplete} />
                        </Tooltip>
                    )}
                </div>
            </div>
          ),
          ignoreRowClick: true,
          allowOverflow: true,
          button: true,
        },
      ];

      useEffect(() => {
        allData();
      }, []);

  return (
    <div>
        <DataTable
            title="Task Management"
            columns={columns}
            data={allTasks}
            pagination
            responsive
            // customStyles={customStyles}
        />
    </div>
  )
}

export default memo(MyTask)