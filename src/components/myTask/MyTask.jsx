import moment from 'moment';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { getMyTaskList, removeFromFilterValues } from './store';
import { getUserId, getUserName } from '../../utility/utils';
import privateRequest from '../services/privateRequest';
import { ARCHIVE_TASK, DELETE_TASK, TASK_COVERAGE, UPDATE_TASK_STATUS } from '../services/apiEndPoints';
import overdue from "../../assets/images/overdue.svg"
import duetoday from "../../assets/images/duetoday.svg"
import TaskArchive from '../../assets/images/TaskArchive.svg'
import TaskViewTaskCoverage from '../../assets/images/TaskViewTaskCoverage.svg'
import TaskAccept from '../../assets/images/TaskAccept.svg'
import TaskDelete from '../../assets/images/TaskDelete.svg'
import TaskComplete from '../../assets/images/TaskComplete.svg'
import TaskPartialComplete from '../../assets/images/TaskPartialComplete.svg'
import toast from 'react-hot-toast';
import { 
  Button, 
  Dialog, 
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText, 
  Divider, 
  TextField, 
  Tooltip 
} from '@mui/material';
import styles from './myTask.module.scss'
import { ClearIcon } from '@mui/x-date-pickers';
import DataTable from 'react-data-table-component';
import Pagination from '../../utility/Pagination';

const MyTask = () => {

  const dispatch = useDispatch();
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: "",
    id: null
  })
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const {allTasks, totalCount, filter} = useSelector(
    (state) => state.userTask
  )
  const [searchTerm, setSearchTerm] = useState('');
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const tabs = [
    "My Task",
    "CC",
    "Assigned By Me",
    "Archive List",
    "Calendar view"
  ];

  const statusOptions = {
    [-1] : "Not Accepted",
    [0] : "Accepted",
    [-2] : "Partial Completed",
    [100]: "Completed"
  }

  const stringToDate = (str) => {
    const date = new Date(str);
    return moment(date).format("DD-MM-YYYY");
  }

  const checkOverDue = (date) => {
    const now = new Date().getTime();
    date = date.slice(0, 10).split("-");
    date[1] = Number(date[1]) + 1;
    const dueTime = new Date(date.join("-")).getTime();
    if(now > dueTime) return true;
  }

  const checkDueToday = (date) => {
    const now = new Date().getTime();
    date = date.slice(0, 10).split("-");
    date[1] = Number(date[1]) + 1;
    const dueTime = new Date(date.join("-")).getTime();
    if(now > dueTime - 1000 * 60 * 60 * 24 && now < dueTime){
      return true;
    }
  }

  const allData  = () => {
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
        Title: searchTerm,
        To: to,
        ToDueDate: "",
        UserId: getUserId(),
        UserIds: "",
        ...filter
      })
    )
  }

  const handleButtonClick = (action, id) => {
    switch(action) {
      case "archive": {
        setConfirmModal({open: true, title:"Archive", id:id});
        break;
      }
      case "delete": {
        setConfirmModal({ open: true, title: "Delete", id: id });
        break;
      }
      case "complete": {
        setConfirmModal({ open: true, title: "Complete", id: id });
        break;
      }
      case "Task Coverage": {
        (async () => {
          const res = await privateRequest.get(TASK_COVERAGE, {
            params: {
              taskId: id,
            },
          });
          setConfirmModal({ open: true, title: "Task Coverage", id: res });
        })();
      }
      default: {
        break;
      }
    }
  }

  const handleAction = (action, id) => {
    setConfirmModal({open: false, title: '', id:null});
    console.log("action", action);

    switch (action) {
      case "Archive": {
        (async () => {
          const res = await privateRequest.post(ARCHIVE_TASK, {
            TaskId: id,
            IsArchive: true,
          });
          if (res) {
            toast.success("Task has been archived");
            allData();
          }
        })();
        break;
      }
      case "Delete": {
        (async () => {
          const res = await privateRequest.get(DELETE_TASK, {
            params: {
              taskId: id,
            },
          });
          if (res) {
            toast.success("Task deleted successfully");
            allData();
          }
        })();
        break;
      }
      case "Complete": {
        (async () => {
          const res = await privateRequest.post(UPDATE_TASK_STATUS, {
            TaskId: id,
            TaskStatusValue: 100,
          });
          if (res) {
            toast.success("Task Completed Successfully");
            allData();
          }
        })();
        break;
      }
      default: {
        break;
      }
    }
  }

  const columns = [
    {
      name: "Title",
      cell: (row) => row.Title || "-"
    },
    {
      name: "Customer Name",
      cell: (row) => row.LeadName || "-"
    },
    {
      name: "Assigned By",
      cell: (row) => row.AssignedByUserName || "-"
    },
    {
      name: "Assigned Date",
      sortable: true,
      cell: (row) => stringToDate(row?.CreateDate) || "-",
    },
    {
      name: "Due Date",
      sortable: true,
      width: "150px",
      cell: (row) => (
        <>
          {stringToDate(row?.TaskEndDate) || "-"}&nbsp;
          {row?.TaskStatus < 100 ? (
            <div>
              {checkOverDue(row?.TaskEndDate) && (
                <img src={overdue} alt="Overdue" />
              )}
              {checkDueToday(row?.TaskEndDate) && (
                <img src={duetoday} alt="Due Today"/>
              )}
            </div>
          ) : (
            ""
          )}
        </>
      ),
    },
    {
      name: "Priority",
      cell: (row) => row.Priority || "-",
    },
    {
      name: "Status",
      cell: (row) => row.TaskStatus
      // <Status num={row.TaskStatus} /> || "-",
    },
    {
      name: "",
      width: "20%",
      cell: (row) => (
        <div className={styles.actionColumnContainer}>
          <div>
            <Tooltip title="Archive">
              <img
                src={TaskArchive}
                alt='TaskArchive'
                onClick={() => handleButtonClick("archive", row?.TaskId)}
              />
            </Tooltip>
          </div>
          <div>
            {row?.TaskStatus === -1 && (
              <Tooltip title="Accept">
                <img
                  onClick={async () => {
                    const res = await privateRequest.post(UPDATE_TASK_STATUS, {
                      TaskId: row?.TaskId,
                      TaskStatus: 0,
                    });
                    if (res) {
                      toast.success("Task Accepted");
                      allData();
                    }
                  }}
                  src={TaskAccept}
                  alt='TaskAccept'
                />
              </Tooltip>
            )}
          </div>
          <div>
            <Tooltip title="View Task Coverage">
              <img
                onClick={() => handleButtonClick("Task Coverage", row.TaskId)}
                src={TaskViewTaskCoverage}
                alt='TaskViewTaskCoverage'
              />
            </Tooltip>
          </div>
          <div>
            <Tooltip title="Delete">
              <img
                onClick={() => handleButtonClick("delete", row.TaskId)}
                src={TaskDelete}
                alt='TaskDelete'
              />
            </Tooltip>
          </div>
          <div>
            {row?.TaskStatus === 0 && (
              <Tooltip title="Complete">
                <img
                  onClick={() => handleButtonClick("complete", row.TaskId)}
                  src={TaskComplete}
                  alt='TaskComplete'
                />
              </Tooltip>
            )}
          </div>
          <div>
            {row?.TaskStatus === 0 && (
              <Tooltip title="Partial Complete">
                <img
                  onClick={() => {}}
                  src={TaskPartialComplete}
                  alt='TaskPartialComplete'
                  width="20px"
                  height="20px"
                />
              </Tooltip>
            )}
          </div>
        </div>
      ),
    },
  ]

  const handleRemove = (key) => {
    dispatch(removeFromFilterValues(key))
  }

  useEffect(() => {
    selectedTab === 0 && !searchTerm && allData();
  }, [selectedTab, filter, searchTerm, page, rowsPerPage])


  useEffect(() => {
    if(selectedTab === 0) {
      const timer = setTimeout(() => {
        searchTerm && allData();
      },1000);

      return () => {
        clearTimeout(timer)
      }
    }
  }, [searchTerm])

  return (
    <div>
      <div className={styles.taskConatiner}>
          {tabs.map((item, id) => {
            return (
              <div 
                onClick={() => {
                  setSelectedTab(id);
                }}
                className={selectedTab === id ? `${styles.tabName}` : ""}
              >
                {item}
              </div>
            )
          })}
      </div>
      <Divider />
      <div className={styles.btnContainer}>
          <Button 
            className={styles.btnStyle}
            onClick={() => setFilterModalOpen(true)}
          >
            Filter
          </Button>
          
          <div>
            <TextField 
              id='standard-basic'
              label='Search'
              variant='standard'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.addTaskContainer}>
            <Button 
              className={styles.btnStyle}
              onClick={() => setAddTaskModalOpen(true)}
            >
              Add Task
            </Button>
            {addTaskModalOpen && (
              <div className={styles.taskModalContainer}>
                {/* <AddTaskForm 
                  addTaskModalOpen={addTaskModalOpen}
                  setAddTaskModalOpen={setAddTaskModalOpen}
                  allData={allData}
                /> */}
              </div>
            )}
          </div>
      </div>
      <div>
        <Divider />
      </div>
      {Object.keys(filter).length ? (
        <div className={styles.filterDisplay}>
          {Object.entries(filter).map(
            ([key, val]) => 
              !["", null, undefined].includes(val) && (
                <div className={styles.filterDisplayBtn}>
                  <button variant="contained">
                    {key + " "}
                    <ClearIcon 
                      fontSize='100px'
                      onClick = {() => handleRemove(key)}
                    />
                  </button>

                  <button sx={{ width: "max-content" }} variant="outlined">
                    {key === "TaskStatus"
                    ? statusOptions[val]
                    : key === "UserIds"
                    ? getUserName()
                    : val
                  }
                  </button>
                </div>
              )
          )}
        </div>
      ) : (
        ""
      )}
      <div>
        {selectedTab === 0 ? (
          <div className={styles.tableContainer}>
            <DataTable 
              data={allTasks}
              columns={columns}
              responsive={true}
              fixedHeader
              fixedHeaderScrollHeight='300px'
            />
            <div style={{position:"absolute", right:"12vw"}}>
              <Pagination 
                page={page}
                setPage={setPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
                totalCount={totalCount || 0}
              />
            </div>
          </div>
        ) : (
          <div>{tabs[selectedTab]}</div>
        )}
      </div>

      {confirmModal.open && confirmModal.title === 'Task Coverage' ? (
        <Dialog
          open={confirmModal.open}
          onClose={() => {
            setConfirmModal({open: false, title:"", id:null});
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {confirmModal?.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {Object.entries(confirmModal?.id?.data?.data).map((ele) => {
                console.log("ele", ele);
                return (
                  <div className={styles.taskAlignment}>
                    <div>
                      {ele[0] === "Pending"
                        ? "Partial Complete"
                        : ele[0] === "Not Started"
                        ? "Not Accepted"
                        : ele[0]}
                    </div>
                    <div>{ele[1]}%</div>
                  </div>
                );
              })}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setConfirmModal({ open: false, title: "", id: null });
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <Dialog
          open={confirmModal?.open}
          onClose={() => {
            setConfirmModal({ open: false, title: "", id: null });
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {confirmModal?.title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to {confirmModal?.title} this task?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setConfirmModal({ open: false, title: "", id: null });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() =>
                handleAction(confirmModal?.title, confirmModal?.id)
              }
              autoFocus
            >
              {confirmModal?.title}
            </Button>
          </DialogActions>
        </Dialog>
      )}
      {filterModalOpen && (
        <div className={styles.filterBtnContainer}>
          {/* <FilterForm 
            filterModalOpen={filterModalOpen}
            setFilterModalOpen={setFilterModalOpen}
          /> */}
        </div>
      )}
    </div>
  )
}

export default MyTask