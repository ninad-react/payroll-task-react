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
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { useMemo } from "react";
import style from "./myTask.module.scss";
import { dateObjToDateString, getUserId } from "../../utility/utils";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { setClearFilter, setFilter } from "./store";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
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

  console.log("filter", filter, initialValues);
  const { register, getValues, reset, setValue, handleSubmit } = useForm({
    initialValues,
  });
  const statusOptions = {
    "Not Accepted": -1,
    Accepted: 0,
    "Partial Completed": -2,
    Completed: 100,
  };

  const priorityOptions = {
    Low: "Low Priority",
    High: "High Priority",
  };

  const handleChange = (e, value) => {
    setValue(value, e.target.value);
  };

  const handleFormSubmit = () => {
    const values = getValues();
    console.log("values", values);
    const temp = {
      TaskStatus: values?.TaskStatus,
      Priority: values?.Priority || "",
      member: values?.member || "",
      FromDueDate: dateObjToDateString(values?.FromDueDate) || null,
      ToDueDate: dateObjToDateString(values?.ToDueDate) || null,
    };
    dispatch(setFilter(temp));
    setFilterModalOpen(false);
  };

  const handleClear = (e) => {
    e.preventDefault();
    reset();
    dispatch(setClearFilter({}));
    setFilterModalOpen(false);
  };

  return (
    <form className={classes.modal}>
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
                {...register("TaskStatus")}
                defaultValue={initialValues.TaskStatus}
                onChange={(e) => handleChange(e, "TaskStatus")}
              >
                {Object.entries(statusOptions)?.map((item) => {
                  return (
                    <MenuItem key={item[1]} value={item[1]}>
                      {item[0]}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl variant="standard" fullWidth className={classes.div}>
              <InputLabel id="demo-simple-select-label">By Priority</InputLabel>
              <Select
                label="Priority"
                name="Priority"
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
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
                {...register("member")}
                onChange={(e) => handleChange(e, "member")}
              >
                <MenuItem value={getUserId()}>Rijo Varghese</MenuItem>
              </Select>
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
            className={style.buttonStyles}
            type="button"
            onClick={handleClear}
          >
            Clear
          </Button>
          <Button
            className={style.buttonStyles}
            type="submit"
            onClick={() => handleSubmit((e) => handleFormSubmit(e))()}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default FilterForm;
