export const formatDate = (dateToFormat) => {
  if (!dateToFormat) {
    return null;
  }

  try {
    const formattedDate = new Date(dateToFormat).toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    });
    return formattedDate;
  } catch (dateError) {
    console.error("Error while formatting date", dateError);
    return null;
  }
};
