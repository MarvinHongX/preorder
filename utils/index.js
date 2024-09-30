export const generateRandomCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber || phoneNumber == undefined || phoneNumber == '') return '';

    const input = phoneNumber.replace(/[^0-9]/g, '');
    let formatted = '';
  
    if (input.length <= 3) {
      formatted = input;
    } else if (input.length <= 7) {
      formatted = `${input.slice(0, 3)}-${input.slice(3)}`;
    } else {
      formatted = `${input.slice(0, 3)}-${input.slice(3, 7)}-${input.slice(7, 11)}`;
    }
  
    return formatted;
  };
