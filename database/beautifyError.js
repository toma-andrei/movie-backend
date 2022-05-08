const beautifyError = (error) => {
  if (error.code === "ER_DUP_ENTRY") {
    if (error.sqlMessage.includes("email"))
      return { message: "Email already exists" };
    else if (error.sqlMessage.includes("username"))
      return { message: "Username already exists" };
  }
  return { message: "error code: " + error.code };
};

export default beautifyError;
