export const SendResponse =(
  res,
  status,
  success,
  message,
  data
)=>{
  const response = {
    ...(data !== undefined && { data }),
    success,
    message,
  };

  return res.status(status).json(response);
}

