const sendSMS = async (body) => {
    if (!body.phoneNumber) return false;
    if (!body.token) return false;
    const result = await sendCoolSMS(body.phoneNumber, body.token);
    if (!result) {
        return false;
        // throw new Error("send SMS failed");
    }
    return result;
  };


export { sendSMS }