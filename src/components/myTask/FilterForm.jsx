import { 
    Button, 
    Dialog, 
    DialogActions, 
    DialogContent, 
    DialogContentText, 
    DialogTitle, 
    FormControl, 
    InputLabel, 
    MenuItem, 
    Select, 
 } from '@mui/material';
import React, { useMemo } from 'react'
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { dateObjToDateString, getUserId } from '../../utility/utils';
import { setClearFilter, setFilter } from './store';
import styles from './myTask.module.scss'
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';
import { makeStyles } from '@mui/styles';
import toast from 'react-hot-toast';

const useStyles = makeStyles((theme) => ({
    modal: {
      height: "200px",
    },
    div: {
      margin: "20px 0",
    },
    crossButton: {
      width: "30px",
      cursor: "pointer",
    },
    dialogTitle: {
      display: "flex",
      justifyContent: "space-between",
    },
}));

const FilterForm = ({ filterModalOpen, setFilterModalOpen }) => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const { filter } = useSelector((state) => state.userTask);
    const initialValues = useMemo(() => {
        return {
          TaskStatus: filter.TaskStatus || "",
          Priority: filter.Priority || "",
          member: filter?.member,
          FromDueDate: filter.FromDueDate ? dayjs(filter.FromDueDate) : null,
          ToDueDate: filter.ToDueDate ? dayjs(filter.ToDueDate) : null,
        };
      }, [filter]);

    // console.log('filter', filter, initialValues);

    const { register, getValues, reset, setValue, handleSubmit, watch, formState: { errors }, } = useForm({
        defaultValues: initialValues,
    });

    const statusOptions = {
        "Not Accepted": -1,
        Accepted: 0,
        "Partial Completed": -2,
        Completed: 100,
    }

    const priorityOptions = {
        Low: "Low Priority",
        High: "High Priority",
    };

    const handleChange = (e, value) => {
        setValue(value, e.target.value);
    };

    const handleFormSubmit = () => {
        const values = getValues();
        if (
            watch('TaskStatus') === '' && 
            watch('Priority') === '' && 
            watch('member') === '' &&
            watch('FromDueDate') === null &&
            watch('ToDueDate') === null
        ) {
            toast.error("Please fill in at least one field before applying the filter");
            return;
        }
        
        const temp = {
            TaskStatus: values?.TaskStatus,
            Priority: values?.Priority || "",
            member: values?.member || "",
            FromDueDate: dateObjToDateString(values?.FromDueDate) || null,
            ToDueDate: dateObjToDateString(values?.ToDueDate) || null
        };
        dispatch(setFilter(temp));
        setFilterModalOpen(false);
    }

    const handleClear = (e) => {
        e.preventDefault();
        reset();
        dispatch(setClearFilter({}));
        setFilterModalOpen(false)
    }

  return (
    <form className={classes.modal} 
    // onSubmit={handleSubmit(handleFormSubmit)}
    >
        <Dialog
            open={filterModalOpen}
            onClose={() => setFilterModalOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title" className={classes.dialogTitle}>
                Filter Task
                <div
                    onClick={() => setFilterModalOpen(false)}
                    className={classes.crossButton}
                >
                    x
                </div>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <FormControl variant="standard" fullWidth className={classes.div}>
                        <InputLabel>Status</InputLabel>
                        <Select
                            label="Status"
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            name="TaskStatus"
                            // {...register("TaskStatus", {
                            //     required: "Please select Task Status",
                            //   })}
                            {...register("TaskStatus")}
                            defaultValue={initialValues.TaskStatus}
                            onChange={(e) => handleChange(e, "TaskStatus")}
                        >
                            {Object.entries(statusOptions)?.map((item) => {
                                return (
                                    <MenuItem key={item[1]} value={item[1]}>
                                        {item[0]}
                                    </MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl >

                    <FormControl variant="standard" fullWidth className={classes.div}>
                        <InputLabel id="demo-simple-select-label">By Priority</InputLabel>
                        <Select
                            label="Priority"
                            name="Priority"
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            // {...register("Priority", {
                            //     required: "Please select Priority",
                            //   })}
                            {...register("Priority")}
                            defaultValue={initialValues.Priority}
                            onChange={(e) => handleChange(e, "Priority")}
                        >
                            {Object.entries(priorityOptions)?.map((item) => {
                            return (
                                <MenuItem key={item[1]} value={item[0]}>
                                {item[1]}
                                </MenuItem>
                            );
                            })}
                        </Select>
                    </FormControl>

                    <FormControl variant="standard" fullWidth className={classes.div}>
                        <InputLabel id="demo-simple-select-standard-label">
                            By Member
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            label="Member"
                            defaultValue={initialValues.member}
                            name="member"
                            variant="standard"
                            // {...register("member", {
                            //     required: "Please select a member",
                            //   })}
                            {...register("member")}
                            onChange={(e) => handleChange(e, "member")}
                        >
                            <MenuItem value={getUserId()}>Rijo Varghese</MenuItem>
                        </Select>
                        {/* <div className={styles.errorMessage}>
                            {errors.member && errors.member.message}
                        </div> */}
                    </FormControl>

                    <FormControl variant="standard" fullWidth className={classes.div}>
                        <InputLabel id="demo-simple-select-label"></InputLabel>
                        <DatePicker
                            label="From Due Date"
                            slotProps={{ textField: { variant: "standard" } }}
                            onChange={(val) => setValue("FromDueDate", val)}
                            defaultValue={initialValues?.FromDueDate}
                            minDate={
                            getValues().fromDueDate ? dayjs(getValues().fromDueDate) : ""
                            }
                        />
                    </FormControl>

                    <FormControl variant="standard" fullWidth className={classes.div}>
                        <InputLabel id="demo-simple-select-label"></InputLabel>
                        <DatePicker
                            label="To Due Date"
                            slotProps={{ textField: { variant: "standard" } }}
                            onChange={(val) => setValue("ToDueDate", val)}
                            defaultValue={initialValues?.ToDueDate}
                            minDate={
                            getValues().fromDueDate ? dayjs(getValues().fromDueDate) : ""
                            }
                        />
                    </FormControl>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    className={styles.btnStyle}
                    type="button"
                    onClick={handleClear}
                >
                    Clear
                </Button>

                <Button
                    className={styles.btnStyle}
                    type="submit"
                    onClick={() => handleSubmit(handleFormSubmit)()}
                >
                    Apply
                </Button>
            </DialogActions>
        </Dialog>
    </form>
  )
}

export default FilterForm