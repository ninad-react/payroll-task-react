import React, { useEffect, useRef, useState } from "react";
import style from "./myTask.module.scss";
import {
  Autocomplete,
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
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { addTask, getCompanyMembers, getLeadsList } from "./store";
import { DatePicker } from "@mui/x-date-pickers";
import { getUserId, monthsList } from "../../utility/utils";
import { useMemo } from "react";
const useStyles = makeStyles((theme) => ({
  modal: {
    width: "600px",
  },
  fullWidth: {
    width: "100%",
  },
}));

const AddTaskForm = ({ addTaskModalOpen, setAddTaskModalOpen, allData }) => {
  const classes = useStyles();
  const tabs = ["Assign To Others", "Assign To Me"];
  const [selectedTab, setSelectedTab] = useState(0);
  const [fileLabel, setFileLabel] = useState("Attach File *");
  const [search, setSearch] = useState({
    customers: "",
    users: "",
    members: "",
  });
  const fileRef = useRef(null);
  const INITIAL_FILE_LABEL = "Attach File *";
  const dispatch = useDispatch();
  const { leadsList, companyMembers, filter } = useSelector(
    (state) => state.userTask
  );
  const selectOptions = useMemo(() => {
    const temp = leadsList?.Leads?.reduce((acc, item) => {
      acc[item?.LeadName] = item?.Id;
      return acc;
    }, {});
    return temp;
  });
  const memberOptions = useMemo(() => {
    const temp = companyMembers?.Members?.reduce((acc, item) => {
      acc[item?.Name] = item?.UserId;
      return acc;
    }, {});
    return temp;
  });
  const convertToDateString = (dateObj) => {
    if (!dateObj) return;
    let { $M, $D, $y } = dateObj;
    $D = $D < 10 ? `0${$D}` : $D;
    return `${$D} ${monthsList[$M].slice(0, 3)} ${$y} 12:00 AM`;
  };
  function getBase64(file) {
    return new Promise((res, rej) => {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        res(reader.result);
      };
      reader.onerror = function (error) {
        rej(error);
      };
    });
  }
  const initialValues = {
    Title: "",
    Description: "",
    file: "",
    customerName: "",
    TaskEndDate: "",
    Priority: "",
    UserIds: "",
    TaskOwners: "",
  };
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    trigger,
    unregister,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const values = getValues();
  console.log("values", values);
  const handleFormSubmit = async (values) => {
    // const values = getValues();
    console.log("values3456789", values);
    const tempFile = values.file && (await getBase64(values.file));
    const fileFullName = values?.file?.name?.split(".");
    let submitObj = {
      Id: "",
      AssignedToUserId: "",
      AssignedDate: "",
      CompletedDate: "",
      IntercomGroupIds: [],
      IsActive: true,
      Latitude: "",
      Location: "",
      Longitude: "",
      TaskStatus: "",
    };
    const temp = {
      ...submitObj,
      Title: values?.Title,
      Description: values?.Description,
      customerName: values?.customerName,
      TaskEndDate: convertToDateString(values?.TaskEndDate),
      MultimediaData: tempFile,
      MultimediaExtension: "." + fileFullName?.[1] || "",
      MultimediaFileName: fileFullName?.[0] || "",
      MultimediaType: fileFullName?.[1] === "pdf" ? "D" : "I" || "",
      AssignedBy: Number(localStorage.getItem("userId")),
      UserIds: values?.UserIds?.length
        ? values?.UserIds?.map((member) => memberOptions[member])
        : [Number(localStorage.getItem("userId"))],
      TaskOwners: values?.TaskOwners
        ? values?.TaskOwners?.map((member) => memberOptions[member])
        : [],
      LeadId: selectOptions[values?.customerName],
      Priority: values?.Priority,
    };
    console.log("temp", temp);
    await dispatch(addTask(temp));
    reset();
    setFileLabel(INITIAL_FILE_LABEL);
    setAddTaskModalOpen(false);
    allData();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setValue("file", file);
    setFileLabel(file ? file.name : INITIAL_FILE_LABEL);
  };
  const handleCancel = () => {
    reset();
    setAddTaskModalOpen(false);
  };
  useEffect(() => {
    reset();
    setFileLabel(INITIAL_FILE_LABEL);
  }, [selectedTab]);
  useEffect(() => {
    dispatch(getLeadsList({ From: 1, Text: "", To: -1 }));
    dispatch(getCompanyMembers({ from: 1, to: 1000 }));
  }, []);

  return (
    <div>
      <form>
        <FormControl variant="standard" fullWidth>
          <Dialog
            open={addTaskModalOpen}
            onClose={() => setAddTaskModalOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Assign Task</DialogTitle>
            <DialogContent className={classes.modal}>
              <DialogContentText id="alert-dialog-description">
                <div className={style.myTaskContainer}>
                  {tabs?.length &&
                    tabs?.map((tab, id) => {
                      return (
                        <div
                          onClick={() => {
                            setSelectedTab(id);
                            reset();
                          }}
                          className={
                            selectedTab === id ? `${style.tabName}` : ""
                          }
                        >
                          {tab}
                        </div>
                      );
                    })}
                </div>
                <div>
                  <TextField
                    // fullWidth
                    className={classes.fullWidth}
                    id="standard-basic"
                    label="Title*"
                    variant="standard"
                    {...register("Title", { required: "Please Enter Title" })}
                    value={watch(values.Title || "")}
                  ></TextField>
                  <div className={style.errorMessage}>
                    {errors.Title && errors.Title.message}
                  </div>
                </div>
                <div>
                  <TextField
                    id="standard-basic"
                    label="Description*"
                    className={classes.fullWidth}
                    variant="standard"
                    value={watch(values.Description || "")}
                    // defaultValue={initialValues.Description}
                    {...register("Description", {
                      required: "Please Enter Description",
                    })}
                  ></TextField>
                  <div className={style.errorMessage}>
                    {errors && errors.Description && errors.Description.message}
                  </div>
                  <div className={style.errorMessage}></div>
                </div>
                <div>
                  <input
                    id="fileupload"
                    label="File"
                    variant="standard"
                    ref={fileRef}
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <div className="d-flex">
                    <label htmlFor="fileupload" className={style.fileLabel}>
                      {fileLabel}
                    </label>
                    {fileLabel !== INITIAL_FILE_LABEL ? (
                      <span
                        className={style.removeFile}
                        onClick={() => {
                          setValue("file", "");
                          setFileLabel(INITIAL_FILE_LABEL);
                          fileRef.current.value = "";
                        }}
                      >
                        Remove
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className={style.errorMessage}></div>
                <div>
                  {/* <label>Leads/Customer Name</label> */}
                  <Autocomplete
                    label="leadName"
                    variant="standard"
                    name="LeadName"
                    {...register("customerName")}
                    value={values.customerName || ""}
                    onInputChange={(event, newInputValue) => {
                      setSearch((prev) => {
                        return { ...prev, customers: newInputValue };
                      });
                    }}
                    // defaultValue={initialValues.customerName}
                    onChange={(e, val) => setValue("customerName", val)}
                    options={selectOptions ? Object.keys(selectOptions) : []}
                    renderInput={(params) => (
                      <TextField
                        variant="standard"
                        {...params}
                        label="Leads/Customer Name"
                      />
                    )}
                  />
                </div>
                <div className={style.errorMessage}></div>
                <div className={style.errorMessage}></div>
                <FormControl variant="standard" fullWidth>
                  <div>
                    <DatePicker
                      label="Task End Date*"
                      name="TaskEndDate"
                      value={values?.TaskEndDate || null}
                      className={classes.fullWidth}
                      onChange={(val) => setValue("TaskEndDate", val)}
                      onBlur={() => {
                        trigger("TaskEndDate");
                      }}
                      slotProps={{ textField: { variant: "standard" } }}
                    />
                  </div>
                </FormControl>
                <div className={classes.errorMessage}>
                  {errors?.TaskEndDate && "Task End Date is required"}
                </div>
                <FormControl variant="standard" fullWidth>
                  <div>
                    <InputLabel id="demo-simple-select-standard-label">
                      Priority
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      label="Priority"
                      value={watch(values?.Priority || "")}
                      className={classes.fullWidth}
                      name="Priority"
                      onChange={(e) => setValue("Priority", e.target.value)}
                    >
                      <MenuItem value="">Select Priority</MenuItem>
                      <MenuItem value={"High"}>High Priority</MenuItem>
                      <MenuItem value={"Low"}>Low Priority</MenuItem>
                    </Select>
                  </div>
                </FormControl>
                <div className={style.errorMessage}></div>
                {selectedTab !== 1 && (
                  <div>
                    <Autocomplete
                      multiple
                      label="users"
                      variant="standard"
                      name="users"
                      onBlur={() => {
                        trigger("UserIds");
                      }}
                      inputValue={search?.users}
                      onInputChange={(event, newInputValue) => {
                        setSearch((prev) => ({
                          ...prev,
                          users: newInputValue,
                        }));
                      }}
                      onChange={(e, val) => setValue("UserIds", val)}
                      options={memberOptions ? Object.keys(memberOptions) : []}
                      renderInput={(params) => (
                        <TextField
                          variant="standard"
                          {...params}
                          label="Add Users *"
                        />
                      )}
                    />
                  </div>
                )}
                <div className={style.errorMessage}>
                  {errors.UserIds ? "Please Select Users" : ""}
                </div>
                <div>
                  <Autocomplete
                    multiple
                    label="members"
                    variant="standard"
                    name="members"
                    {...register("TaskOwners")}
                    // value={values.TaskOwners || []}
                    // defaultValue={initialValues.TaskOwners}
                    inputValue={search?.members}
                    onInputChange={(event, newInputValue) => {
                      setSearch((prev) => {
                        return { ...prev, members: newInputValue };
                      });
                    }}
                    onChange={(e, val) => setValue("TaskOwners", val)}
                    options={memberOptions ? Object.keys(memberOptions) : []}
                    renderInput={(params) => (
                      <TextField
                        variant="standard"
                        {...params}
                        label="Add members "
                        placeholder="Members"
                      />
                    )}
                  />
                </div>
                <div className={style.errorMessage}></div>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button className={style.buttonStyles} onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                className={style.buttonStyles}
                type="submit"
                onClick={() => handleSubmit((e) => handleFormSubmit(e))()}
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </FormControl>
      </form>
    </div>
  );
};

export default AddTaskForm;
