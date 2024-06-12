export const getToken = () => {
  const token = localStorage.getItem("token");
  return token;
};

export const getUserId = () => {
  const id = localStorage.getItem("userId");
  return id;
};

export const getUserName = () => {
  const name = localStorage.getItem("userName");
  return name;
};

export const dateObjToDateString = (dateObj) => {
  if (!dateObj) return;
  let { $M, $D, $y } = dateObj;
  $M++;
  $M = $M < 10 ? `0${$M}` : $M;
  $D = $D < 10 ? `0${$D}` : $D;
  return `${$M}/${$D}/${$y}`;
};

export const monthsList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
