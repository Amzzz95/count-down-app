export const formatDate = (dateToFormat, timeZone) => {
  if (!dateToFormat || !timeZone) {
    return null;
  }

  try {
    const formattedDate = new Date(dateToFormat).toLocaleString("en-US", {
      timeZone,
    });
    return formattedDate;
  } catch (dateError) {
    console.error("Error while formatting date", dateError);
    return null;
  }
};
