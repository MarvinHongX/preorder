import coolsms from 'coolsms-node-sdk'

export const sendCoolSMS = async (phoneNumber, token) => {
    if (!phoneNumber) return false;
    if (!token) return false;
    const config = useRuntimeConfig();
    const mysms = coolsms.default;
    const messageService = new mysms(config.coolApiKey, config.coolApiSecret);
    const result = await messageService.sendOne({
        to: `${phoneNumber}`,
           from : config.coolCallerNumber,
           text : `[ROAM XR7 사전예약 할인판매] 요청하신 인증번호는 [${token}]입니다.`
    })
  
    console.log('sendSMS', result);
  };

